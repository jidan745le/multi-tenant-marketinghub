import CookieService from '../utils/cookieService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class UserManagementApiService {
    constructor() {
        this.baseURL = `/apis/marketinghub/users`;
    }

    // 获取请求头
    getHeaders() {
        const token = CookieService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    // 处理API响应
    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    // 获取用户列表
    async getUsers(page = 1, limit = 10) {
        try {
            const response = await fetch(`${this.baseURL}?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // 获取单个用户
    async getUser(userId) {
        try {
            const response = await fetch(`${this.baseURL}/${userId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    // 创建用户
    async createUser(userData) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(userData),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // 更新用户
    async updateUser(userId, userData) {
        try {
            const response = await fetch(`${this.baseURL}/${userId}`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(userData),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // 删除用户
    async deleteUser(userId) {
        try {
            const response = await fetch(`${this.baseURL}/${userId}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // 分配角色
    async assignRoles(userId, roleIds) {
        try {
            const response = await fetch(`${this.baseURL}/${userId}/assign-roles`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ roleIds }),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error assigning roles:', error);
            throw error;
        }
    }

    // 获取用户角色
    async getUserRoles(userId) {
        try {
            const response = await fetch(`${this.baseURL}/${userId}/roles`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching user roles:', error);
            throw error;
        }
    }

    // 获取所有角色 (假设有这个接口)
    async getAllRoles() {
        try {
            const response = await fetch(`/apis/marketinghub/users/roles/all`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    }
}

export default new UserManagementApiService();
