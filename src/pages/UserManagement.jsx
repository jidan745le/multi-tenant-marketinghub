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
  FormHelperText,
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
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
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
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StatusSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: theme.palette.success.main,
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme.palette.success.main,
  },
}));

// 主要操作按钮样式
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabled,
    color: theme.palette.action.disabled,
  },
}));

// 角色分配按钮样式
const AssignRoleButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

// Main component
function UserManagement() {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Dialog states
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [assignRolesDialog, setAssignRolesDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    roleIds: [],
  });
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUserForRoles, setSelectedUserForRoles] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  
  // 批量选择用户状态
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectAllUsers, setSelectAllUsers] = useState(false);

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
      setLoading(true);
      const response = await UserManagementApiService.getUsers(page, limit);
      setUsers(response.users || []);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      setError(err.message);
      showSnackbar('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // Load available roles
  const loadRoles = useCallback(async () => {
    try {
      const roles = await UserManagementApiService.getAllRoles();
      setAvailableRoles(roles || []);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [loadUsers, loadRoles]);

  // Utility functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateUserForm = (userData) => {
    const errors = {};
    
    if (!userData.name?.trim()) {
      errors.name = 'Name is required';
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
      await UserManagementApiService.createUser(newUser);
      showSnackbar('User created successfully');
      setAddUserDialog(false);
      setNewUser({ name: '', email: '', password: '', roleIds: [] });
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
      await UserManagementApiService.updateUser(editingUser.id, editingUser);
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
    try {
      await UserManagementApiService.deleteUser(userToDelete.id);
      showSnackbar('User deleted successfully');
      setDeleteConfirmDialog(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      showSnackbar(err.message, 'error');
    }
  };

  const handleAssignRoles = async () => {
    try {
      if (selectedUserForRoles.isBulk) {
        // 批量分配角色
        const promises = selectedUserForRoles.userIds.map(userId =>
          UserManagementApiService.assignRoles(userId, selectedRoles)
        );
        await Promise.all(promises);
        showSnackbar(`Roles assigned successfully to ${selectedUserForRoles.userIds.length} users`);
      } else {
        // 单个用户分配角色
        await UserManagementApiService.assignRoles(
          selectedUserForRoles.id,
          selectedRoles
        );
        showSnackbar('Roles assigned successfully');
      }
      
      setAssignRolesDialog(false);
      setSelectedUserForRoles(null);
      setSelectedRoles([]);
      setSelectedUserIds([]); // 清空选择
      setSelectAllUsers(false);
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
  const openEditDialog = (user) => {
    setEditingUser({ ...user });
    setEditUserDialog(true);
    setFormErrors({});
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteConfirmDialog(true);
  };

  const openAssignRolesDialog = async (user) => {
    setSelectedUserForRoles(user);
    try {
      const userRoles = await UserManagementApiService.getUserRoles(user.id);
      setSelectedRoles(userRoles.roles?.map(role => role.id) || []);
    } catch (err) {
      setSelectedRoles([]);
    }
    setAssignRolesDialog(true);
  };

  // 批量选择用户处理函数
  const handleSelectAllUsers = (checked) => {
    setSelectAllUsers(checked);
    if (checked) {
      setSelectedUserIds(users.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
    
    // 更新全选状态
    const newSelectedIds = checked 
      ? [...selectedUserIds, userId]
      : selectedUserIds.filter(id => id !== userId);
    setSelectAllUsers(newSelectedIds.length === users.length);
  };

  // 批量分配角色
  const handleBulkAssignRoles = () => {
    if (selectedUserIds.length === 0) {
      showSnackbar('Please select at least one user', 'warning');
      return;
    }
    
    // 为批量操作设置虚拟用户对象
    setSelectedUserForRoles({
      id: 'bulk',
      name: `${selectedUserIds.length} selected users`,
      isBulk: true,
      userIds: selectedUserIds
    });
    setSelectedRoles([]);
    setAssignRolesDialog(true);
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
          <Typography variant="h4" component="h1" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Results {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total} in User Information
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <PrimaryButton
            variant="contained"
            onClick={() => {
              setNewUser({ name: '', email: '', password: '', roleIds: [] });
              setFormErrors({});
              setAddUserDialog(true);
            }}
          >
            ADD USER
          </PrimaryButton>
          <PrimaryButton
            variant="contained"
            onClick={handleBulkAssignRoles}
            disabled={selectedUserIds.length === 0}
          >
            ASSIGN ROLES ({selectedUserIds.length})
          </PrimaryButton>
        </Box>
      </HeaderContainer>

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
              <TableHeader>
                <Checkbox 
                  size="small" 
                  checked={selectAllUsers}
                  indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < users.length}
                  onChange={(e) => handleSelectAllUsers(e.target.checked)}
                />
              </TableHeader>
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
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Checkbox 
                    size="small" 
                    checked={selectedUserIds.includes(user.id)}
                    onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="primary">
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
                  {user.roles?.map((role) => (
                    <Chip
                      key={role.id}
                      label={role.name}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  )) || 'No roles'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.tenant?.name || 'KENDO'}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Edit">
                      <ActionButton
                        onClick={() => openEditDialog(user)}
                        sx={{ color: 'primary.main' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                          edit
                        </span>
                      </ActionButton>
                    </Tooltip>
                    <Tooltip title="Send Email">
                      <ActionButton sx={{ color: 'primary.main' }}>
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
                    <Tooltip title="Assign Roles">
                      <AssignRoleButton
                        onClick={() => openAssignRolesDialog(user)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                          person_add
                        </span>
                      </AssignRoleButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <ActionButton
                        onClick={() => openDeleteDialog(user)}
                        sx={{ color: 'primary.main' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                          delete
                        </span>
                      </ActionButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              error={!!formErrors.password}
              helperText={formErrors.password}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                value={newUser.roleIds}
                onChange={(e) => setNewUser({ ...newUser, roleIds: e.target.value })}
                renderValue={(selected) =>
                  selected.map(roleId => {
                    const role = availableRoles.find(r => r.id === roleId);
                    return role?.name || roleId;
                  }).join(', ')
                }
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Checkbox checked={newUser.roleIds.indexOf(role.id) > -1} />
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserDialog(false)}>Cancel</Button>
          <PrimaryButton onClick={handleAddUser} variant="contained">
            Add User
          </PrimaryButton>
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
        <DialogContent>
          {editingUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Full Name"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
                fullWidth
              />
              <TextField
                label="New Password (leave empty to keep current)"
                type="password"
                value={editingUser.password || ''}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                error={!!formErrors.password}
                helperText={formErrors.password}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editingUser.isActive}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialog(false)}>Cancel</Button>
          <PrimaryButton onClick={handleEditUser} variant="contained">
            Update User
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog}
        onClose={() => setDeleteConfirmDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Roles Dialog */}
      <Dialog
        open={assignRolesDialog}
        onClose={() => setAssignRolesDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Assign Roles {selectedUserForRoles && `to ${selectedUserForRoles.name}`}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Select Roles</InputLabel>
            <Select
              multiple
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.target.value)}
              renderValue={(selected) =>
                selected.map(roleId => {
                  const role = availableRoles.find(r => r.id === roleId);
                  return role?.name || roleId;
                }).join(', ')
              }
            >
              {availableRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  <Checkbox checked={selectedRoles.indexOf(role.id) > -1} />
                  <Box>
                    <Typography variant="body1">{role.name}</Typography>
                    {role.description && (
                      <Typography variant="body2" color="text.secondary">
                        {role.description}
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Select one or more roles to assign to the user
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignRolesDialog(false)}>Cancel</Button>
          <PrimaryButton onClick={handleAssignRoles} variant="contained">
            Assign Roles
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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
