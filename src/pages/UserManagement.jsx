import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import { useBrand } from '../hooks/useBrand';
import UserManagementApiService from '../services/userManagementApi';

// Styled components
const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
  padding: '0 24px',
}));

const TableHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  fontWeight: 600,
  fontSize: '14px',
  borderBottom: `2px solid ${theme.palette.divider}`,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  margin: '0 2px',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: 'transparent',
    '& .material-symbols-outlined': {
      color: theme.palette.primary.main,
    },
  },
}));

const StatusSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme.palette.primary.main,
  },
}));

// 主要操作按钮样式
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.9,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabled,
    color: '#666666',
  },
}));

// Styled TextField with theme color hover
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// Styled Select with theme color hover
const StyledSelect = styled(Select)(({ theme }) => ({
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));


// Main component
function UserManagement() {
  const theme = useTheme();
  // Get current brand/theme from URL
  const { currentBrandCode } = useBrand();
  
  // Get current user role
  const getCurrentUserRole = () => {
    try {
      const userInfoStr = localStorage.getItem('user_info');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        const roles = userInfo?.roles || [];
        
        // 检查 role（支持字符串或对象格式）
        for (const role of roles) {
          let roleName = '';
          if (typeof role === 'string') {
            roleName = role.toLowerCase();
          } else if (typeof role === 'object' && role !== null) {
            roleName = String(role.name || role.code || role.role || role.id || '').toLowerCase();
          }
          
          // 检查是否是 TENANT ADMINISTRATOR（优先检查，因为可能包含 admin）
          if (roleName.includes('tenant') && roleName.includes('administrator')) {
            return 'tenant-admin';
          }
          // 检查是否是 admin（但不是 tenant admin）
          if (roleName === 'admin' || (roleName.includes('admin') && !roleName.includes('tenant'))) {
            return 'admin';
          }
        }
      }
    } catch (error) {
      // 静默处理错误
    }
    return null;
  };

  const currentUserRole = getCurrentUserRole();
  const isAdmin = currentUserRole === 'admin';
  
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Filter states
  const [emailSearch, setEmailSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Use current theme for filtering (without _viewer suffix)
  const currentTheme = currentBrandCode;

  // Dialog states
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    country: '',
    partnerId: '',
    preferredLanguage: '',
    isActive: true,
    roleIds: [],
    themeIds: [],
    dealerId: '',
    dealerName: '',
    dealerFbLink: '',
  });
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableThemes, setAvailableThemes] = useState([]);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Validation states
  const [formErrors, setFormErrors] = useState({});

  // Load users data
  const loadUsers = useCallback(async () => {
    try {
      // 避免输入框失焦
      const isInitialLoad = users.length === 0 && !emailSearch;
      if (isInitialLoad) {
        setLoading(true);
      }
      setIsSearching(true);
      const response = await UserManagementApiService.getUsers(page, limit, emailSearch, currentTheme);
      setUsers(response.users || []);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      setError(err.message);
      showSnackbar('Failed to load users', 'error');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [page, limit, emailSearch, currentTheme, users.length]);

  // Load available roles and themes
  const loadRoles = useCallback(async () => {
    try {
      const allRoles = await UserManagementApiService.getAllRoles();
      
      // Separate roles and themes based on _viewer suffix
      const themes = (allRoles || []).filter(role => 
        role.name.toLowerCase().includes('_viewer')
      );
      let roles = (allRoles || []).filter(role => 
        !role.name.toLowerCase().includes('_viewer')
      );
      
      // If current user is admin, filter out tenant administrator role
      if (isAdmin) {
        roles = roles.filter(role => {
          const roleName = role.name?.toLowerCase() || '';
          return !(roleName.includes('tenant') && roleName.includes('administrator'));
        });
      }
      
      setAvailableRoles(roles);
      setAvailableThemes(themes);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  }, [isAdmin]);

  // Initialize data
  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [loadUsers, loadRoles]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Handle search with debounce
  const handleEmailSearch = (value) => {
    setEmailSearch(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      setPage(1); // Reset to first page when searching
    }, 500);
    
    setSearchTimeout(newTimeout);
  };

  // Clear filters
  const clearFilters = () => {
    setEmailSearch('');
    setPage(1);
  };

  // Utility functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateUserForm = (userData) => {
    const errors = {};
    
    if (!userData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!userData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!editingUser && !userData.password?.trim()) {
      errors.password = 'Password is required';
    } else if (userData.password && userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  // User operations
  const handleAddUser = async () => {
    const errors = validateUserForm(newUser);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Combine role IDs and theme IDs for creation and combine name
      const userWithAllRoles = {
        ...newUser,
        name: `${newUser.firstName} ${newUser.lastName || ''}`.trim(),
        roleIds: [
          ...(newUser.roleIds || []),
          ...(newUser.themeIds || [])
        ]
      };
      
      await UserManagementApiService.createUser(userWithAllRoles);
      showSnackbar('User created successfully');
      setAddUserDialog(false);
      setNewUser({ 
        firstName: '', 
        lastName: '',
        email: '', 
        password: '', 
        phone: '', 
        address: '', 
        country: '', 
        partnerId: '', 
        preferredLanguage: '', 
        isActive: true,
        roleIds: [], 
        themeIds: [],
        dealerId: '',
        dealerName: '',
        dealerFbLink: '',
      });
      setFormErrors({});
      loadUsers();
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleEditUser = async () => {
    const errors = validateUserForm(editingUser);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // 构建更新数据，排除 password 字段（如果为空）
      const { password, ...userDataWithoutPassword } = editingUser;
      const userUpdateData = {
        ...userDataWithoutPassword,
        name: `${editingUser.firstName || ''} ${editingUser.lastName || ''}`.trim()
      };
      
      // 只有当密码字段有值时才包含在更新数据中
      if (password && password.trim()) {
        userUpdateData.password = password;
      }
      
      await UserManagementApiService.updateUser(editingUser.id, userUpdateData);
      
      // Combine role IDs and theme IDs for role assignment
      const allRoleIds = [
        ...(editingUser.roleIds || []),
        ...(editingUser.themeIds || [])
      ];
      
      // Update user roles (always call assignRoles, even if empty array to clear all roles)
      await UserManagementApiService.assignRoles(editingUser.id, allRoleIds);
      
      showSnackbar('User updated successfully');
      setEditUserDialog(false);
      setEditingUser(null);
      setFormErrors({});
      loadUsers();
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    const userId = userToDelete.id;
    
    try {
      await UserManagementApiService.deleteUser(userId);
      showSnackbar('User deleted successfully');
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };


  const handleToggleUserStatus = async (user) => {
    try {
      await UserManagementApiService.updateUser(user.id, {
        isActive: !user.isActive,
      });
      showSnackbar(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      loadUsers();
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  // Dialog handlers
  const openEditDialog = async (user) => {
    // 排除 password 字段，确保密码字段始终为空
    const { password, ...userWithoutPassword } = user;
    setEditingUser({ ...userWithoutPassword, password: '' });
    setEditUserDialog(true);
    setFormErrors({});
    
    // Load user's current roles and separate them into roles and themes
    try {
      const userRoles = await UserManagementApiService.getUserRoles(user.id);
      const allUserRoles = userRoles.roles || [];
      
      const themeRoleIds = allUserRoles
        .filter(role => role.name.toLowerCase().includes('_viewer'))
        .map(role => role.id);
      
      let regularRoleIds = allUserRoles
        .filter(role => !role.name.toLowerCase().includes('_viewer'))
        .map(role => role.id);
      
      // If current user is admin, filter out tenant administrator role from editing user's roles
      if (isAdmin) {
        const allRoles = await UserManagementApiService.getAllRoles();
        const tenantAdminRole = allRoles.find(role => {
          const roleName = role.name?.toLowerCase() || '';
          return roleName.includes('tenant') && roleName.includes('administrator');
        });
        
        if (tenantAdminRole) {
          regularRoleIds = regularRoleIds.filter(roleId => roleId !== tenantAdminRole.id);
        }
      }
        
      setEditingUser({ 
        ...userWithoutPassword, 
        firstName: user.name ? user.name.split(' ')[0] : '',
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        roleIds: regularRoleIds,
        themeIds: themeRoleIds,
        password: '' // 确保密码字段始终为空
      });
    } catch (err) {
      console.error('Failed to load user roles:', err);
      setEditingUser({ 
        ...userWithoutPassword, 
        firstName: user.name ? user.name.split(' ')[0] : '',
        lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        roleIds: [], 
        themeIds: [],
        password: '' // 确保密码字段始终为空
      });
    }
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteConfirmDialog(true);
  };


  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render loading state
  if (loading && users.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <HeaderContainer>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ ml:-2.5 }}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml:-2.5, fontSize: '14px', fontFamily: 'var(--label-large-font-family, "Roboto-Medium", sans-serif)', paddingTop: '10px' }}>
            Results {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total} users {emailSearch ? `(filtered by email: "${emailSearch}")` : `for ${currentBrandCode.toUpperCase()} theme`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <PrimaryButton
            variant="contained"
            onClick={() => {
              setNewUser({ 
                firstName: '', 
                lastName: '',
                email: '', 
                password: '', 
                phone: '', 
                address: '', 
                country: '', 
                partnerId: '', 
                preferredLanguage: '', 
                isActive: true,
                roleIds: [], 
                themeIds: [],
                dealerId: '',
                dealerName: '',
                dealerFbLink: '',
              });
              setFormErrors({});
              setAddUserDialog(true);
            }}
          >
            ADD USER
          </PrimaryButton>
        </Box>
      </HeaderContainer>

      {/* Search and Filter Section */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3, 
        p: 2, 
        backgroundColor: 'background.paper', 
        borderRadius: 1,
        boxShadow: 1,
        alignItems: 'center'
      }}>
        <StyledTextField
          label="Search by Email"
          variant="outlined"
          size="small"
          value={emailSearch}
          onChange={(e) => handleEmailSearch(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <span className="material-symbols-outlined" style={{ fontSize: 20, marginRight: 8, color: '#666' }}>
                search
              </span>
            ),
            endAdornment: isSearching && emailSearch && (
              <CircularProgress size={16} sx={{ mr: 1 }} />
            ),
          }}
        />
        
     
        
        {emailSearch && (
          <Button
            variant="outlined"
            size="small"
            onClick={clearFilters}
            startIcon={
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                clear
              </span>
            }
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}12`,
              },
            }}
          >
            Clear Search
          </Button>
        )}
        
        {emailSearch && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Searching: "{emailSearch}"
            </Typography>
          </Box>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

 

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>First Name</TableHeader>
              <TableHeader>Last Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Created/Last Login</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Themes</TableHeader>
              <TableHeader>Operation</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              // Separate roles into theme and non-theme roles
              const themeRoles = user.roles?.filter(role => 
                role.name.toLowerCase().includes('_viewer') || 
                role.name.toLowerCase().includes('theme')
              ) || [];
              
              const nonThemeRoles = user.roles?.filter(role => 
                !role.name.toLowerCase().includes('_viewer') && 
                !role.name.toLowerCase().includes('theme')
              ) || [];

              return (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {user.id.slice(-6)}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.name?.split(' ')[0] || '-'}</TableCell>
                  <TableCell>{user.name?.split(' ').slice(1).join(' ') || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {user.createdAt ? formatDate(user.createdAt) : '-'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {nonThemeRoles.length > 0 ? (
                      nonThemeRoles.map((role) => (
                        <Chip
                          key={role.id}
                          label={role.name.toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">No roles</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {themeRoles.length > 0 ? (
                      themeRoles.map((role) => (
                        <Chip
                          key={role.id}
                          label={role.name.replace('_viewer', '').toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">No themes</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Edit">
                        <ActionButton
                          onClick={() => openEditDialog(user)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                            edit
                          </span>
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Send Email">
                        <ActionButton>
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                            mail
                          </span>
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'}>
                        <StatusSwitch
                          checked={user.isActive}
                          onChange={() => handleToggleUserStatus(user)}
                          size="small"
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <ActionButton
                          onClick={() => openDeleteDialog(user)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                            delete
                          </span>
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': {
              color: 'text.primary',
            },
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
            '& .MuiPaginationItem-root:hover': {
              backgroundColor: 'primary.light',
              color: 'white',
            },
          }}
        />
      </Box>

      {/* Add User Dialog */}
      <Dialog
        open={addUserDialog}
        onClose={() => setAddUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent sx={{
          overflow: 'auto',
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none' // Chrome, Safari, Edge
          }
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Basic Data Section */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Basic Data</Typography>
            
            <StyledTextField
              label="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              required
              fullWidth
            />
            
            <StyledTextField
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              fullWidth
            />
            
            <StyledTextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
              fullWidth
            />
            
            <Box>
              <InputLabel sx={{ mb: 1, color: 'text.primary' }}>
                Password {formErrors.password && <span style={{ color: 'red' }}>*</span>}
              </InputLabel>
              <input
                type="text"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: formErrors.password ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.palette.primary.main;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = formErrors.password ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)';
                }}
                required
              />
              {formErrors.password && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {formErrors.password}
                </Typography>
              )}
            </Box>
            
            <StyledTextField
              label="Mobile"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              fullWidth
            />
            
            <StyledTextField
              label="Address"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel sx={{ backgroundColor: 'background.paper', px: 1 }}>Country</InputLabel>
              <StyledSelect
                value={newUser.country}
                onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
              >
                <MenuItem value="China">China</MenuItem>
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="Germany">Germany</MenuItem>
                <MenuItem value="Japan">Japan</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </StyledSelect>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel sx={{ backgroundColor: 'background.paper', px: 1 }}>Language</InputLabel>
              <StyledSelect
                value={newUser.preferredLanguage}
                onChange={(e) => setNewUser({ ...newUser, preferredLanguage: e.target.value })}
              >
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="German">German</MenuItem>
                <MenuItem value="Japanese">Japanese</MenuItem>
              </StyledSelect>
            </FormControl>
            
            <StyledTextField
              label="Partner ID"
              value={newUser.partnerId}
              onChange={(e) => setNewUser({ ...newUser, partnerId: e.target.value })}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel sx={{ backgroundColor: 'background.paper', px: 1 }}>Themes</InputLabel>
              <StyledSelect
                multiple
                value={newUser.themeIds}
                onChange={(e) => setNewUser({ ...newUser, themeIds: e.target.value })}
                renderValue={(selected) =>
                  selected.map(themeId => {
                    const theme = availableThemes.find(t => t.id === themeId);
                    return theme?.name.replace('_viewer', '').toUpperCase() || themeId;
                  }).join(', ')
                }
              >
                {availableThemes.map((theme) => (
                  <MenuItem key={theme.id} value={theme.id}>
                    <Checkbox checked={newUser.themeIds.indexOf(theme.id) > -1} />
                    {theme.name.replace('_viewer', '').toUpperCase()}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            {/* Rights & Roles Section */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Rights & Roles</Typography>
            
            <FormControl fullWidth>
              <InputLabel sx={{ backgroundColor: 'background.paper', px: 1 }}>Role</InputLabel>
              <StyledSelect
                multiple
                value={newUser.roleIds}
                onChange={(e) => setNewUser({ ...newUser, roleIds: e.target.value })}
                renderValue={(selected) =>
                  selected.map(roleId => {
                    const role = availableRoles.find(r => r.id === roleId);
                    return role?.name.toUpperCase() || roleId;
                  }).join(', ')
                }
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Checkbox checked={newUser.roleIds.indexOf(role.id) > -1} />
                    {role.name.toUpperCase()}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={newUser.isActive}
                  onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })}
                />
              }
              label={"Activate Status: " + (newUser.isActive ? 'Yes' : 'No')}
            />

            {/* Dealer Data Section */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Dealer Data (Optional)</Typography>
            
            <StyledTextField
              label="Dealer ID"
              value={newUser.dealerId || ''}
              onChange={(e) => setNewUser({ ...newUser, dealerId: e.target.value })}
              fullWidth
            />
            
            <StyledTextField
              label="Dealer Name"
              value={newUser.dealerName || ''}
              onChange={(e) => setNewUser({ ...newUser, dealerName: e.target.value })}
              fullWidth
            />
            
            <StyledTextField
              label="Dealer FB Link"
              value={newUser.dealerFbLink || ''}
              onChange={(e) => setNewUser({ ...newUser, dealerFbLink: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '12px 24px', display: 'flex', gap: '8px' }}>
          <Button 
            onClick={() => setAddUserDialog(false)} 
            variant="outlined"
            sx={{ 
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              backgroundColor: '#fff',
              borderRadius: '4px',
              textTransform: 'uppercase',
              fontWeight: '500',
              minWidth: 'auto',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}12`
              }
            }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              textTransform: 'uppercase',
              borderRadius: '4px',
              fontWeight: '500',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                opacity: 0.9
              },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            SUBMIT
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={editUserDialog}
        onClose={() => setEditUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{
          overflow: 'auto',
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            display: 'none' // Chrome, Safari, Edge
          }
        }}>
          {editingUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {/* Basic Data Section */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Basic Data</Typography>
              
              <StyledTextField
                label="First Name"
                value={editingUser.firstName || (editingUser.name ? editingUser.name.split(' ')[0] : '')}
                onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                required
                fullWidth
              />
              
              <StyledTextField
                label="Last Name"
                value={editingUser.lastName || (editingUser.name ? editingUser.name.split(' ').slice(1).join(' ') : '')}
                onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                fullWidth
              />
              
              <StyledTextField
                label="Email"
                type="email"
                value={editingUser.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
                fullWidth
              />
              
              <StyledTextField
                label="Mobile"
                value={editingUser.phone || ''}
                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                fullWidth
              />
              
              <Box>
                <InputLabel sx={{ mb: 1, color: 'text.primary' }}>
                  New Password (leave empty to keep current)
                  {formErrors.password && <span style={{ color: 'red' }}>*</span>}
                </InputLabel>
                <input
                  type="text"
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: formErrors.password ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.palette.primary.main;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = formErrors.password ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)';
                  }}
                />
                {formErrors.password && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {formErrors.password}
                  </Typography>
                )}
              </Box>
              
              <StyledTextField
                label="Address"
                value={editingUser.address || ''}
                onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel sx={{ backgroundColor: 'background.paper', px: 1 }}>Country</InputLabel>
                <StyledSelect
                  value={editingUser.country || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value })}
                >
                  <MenuItem value="China">China</MenuItem>
                  <MenuItem value="USA">USA</MenuItem>
                  <MenuItem value="Germany">Germany</MenuItem>
                  <MenuItem value="Japan">Japan</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </StyledSelect>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel sx={{ backgroundColor: 'background.paper', px: 1 }}>Language</InputLabel>
                <StyledSelect
                  value={editingUser.preferredLanguage || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, preferredLanguage: e.target.value })}
                >
                  <MenuItem value="Chinese">Chinese</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="German">German</MenuItem>
                  <MenuItem value="Japanese">Japanese</MenuItem>
                </StyledSelect>
              </FormControl>
              
              <StyledTextField
                label="Partner ID"
                value={editingUser.partnerId || ''}
                onChange={(e) => setEditingUser({ ...editingUser, partnerId: e.target.value })}
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel sx={{ backgroundColor: 'background.paper', px: 1 }}>Themes</InputLabel>
                <StyledSelect
                  multiple
                  value={editingUser.themeIds || []}
                  onChange={(e) => setEditingUser({ ...editingUser, themeIds: e.target.value })}
                  renderValue={(selected) =>
                    selected.map(themeId => {
                      const theme = availableThemes.find(t => t.id === themeId);
                      return theme?.name.replace('_viewer', '').toUpperCase() || themeId;
                    }).join(', ')
                  }
                >
                  {availableThemes.map((theme) => (
                    <MenuItem key={theme.id} value={theme.id}>
                      <Checkbox checked={(editingUser.themeIds || []).indexOf(theme.id) > -1} />
                      {theme.name.replace('_viewer', '').toUpperCase()}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>

              {/* Rights & Roles Section */}
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Rights & Roles</Typography>
              
              <FormControl fullWidth>
                <InputLabel sx={{ backgroundColor: 'background.paper', px: 1 }}>Role</InputLabel>
                <StyledSelect
                  multiple
                  value={editingUser.roleIds || []}
                  onChange={(e) => setEditingUser({ ...editingUser, roleIds: e.target.value })}
                  renderValue={(selected) =>
                    selected.map(roleId => {
                      const role = availableRoles.find(r => r.id === roleId);
                      return role?.name.toUpperCase() || roleId;
                    }).join(', ')
                  }
                >
                  {availableRoles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      <Checkbox checked={(editingUser.roleIds || []).indexOf(role.id) > -1} />
                      <Box>
                        <Typography variant="body1">{role.name.toUpperCase()}</Typography>
                        {role.description && (
                          <Typography variant="body2" color="text.secondary">
                            {role.description}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={editingUser.isActive !== false}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                  />
                }
                label={"Activate Status: " + (editingUser.isActive ? 'Yes' : 'No')}
              />

              {/* Dealer Data Section */}
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Dealer Data (Optional)</Typography>
              
              <StyledTextField
                label="Dealer ID"
                value={editingUser.dealerId || ''}
                onChange={(e) => setEditingUser({ ...editingUser, dealerId: e.target.value })}
                fullWidth
              />
              
              <StyledTextField
                label="Dealer Name"
                value={editingUser.dealerName || ''}
                onChange={(e) => setEditingUser({ ...editingUser, dealerName: e.target.value })}
                fullWidth
              />
              
              <StyledTextField
                label="Dealer FB Link"
                value={editingUser.dealerFbLink || ''}
                onChange={(e) => setEditingUser({ ...editingUser, dealerFbLink: e.target.value })}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '12px 24px', display: 'flex', gap: '8px' }}>
          <Button 
            onClick={() => setEditUserDialog(false)} 
            variant="outlined"
            sx={{ 
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              backgroundColor: '#fff',
              borderRadius: '4px',
              textTransform: 'uppercase',
              fontWeight: '500',
              minWidth: 'auto',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}12`
              }
            }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleEditUser} 
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: '#fff',
              textTransform: 'uppercase',
              borderRadius: '4px',
              fontWeight: '500',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                opacity: 0.9
              },
              '&:disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            SUBMIT
          </Button>
        </DialogActions>
      </Dialog>

      {/* 确认删除对话框 */}
      <ConfirmDeleteDialog
        open={deleteConfirmDialog}
        onClose={() => {
          setDeleteConfirmDialog(false);
          // 延迟清空
          setTimeout(() => {
            setUserToDelete(null);
          }, 300);
        }}
        onConfirm={handleDeleteUser}
        message={userToDelete ? `Are you sure want to delete user "${userToDelete.name}" ?` : 'Are you sure want to delete the record ?'}
      />


      {/* Success/Error Snackbar - 顶部中间 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserManagement;
