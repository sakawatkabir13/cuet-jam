// API utility functions

const API_BASE_URL = '';  // Empty since we're serving from same origin

// Generic API request function
async function apiRequest(endpoint, options = {}) {
    const url = API_BASE_URL + endpoint;
    const token = (typeof getAuthToken === 'function') ? getAuthToken() : null;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, config);
        
        // Handle unauthorized responses
        if (response.status === 401) {
            if (typeof removeAuthToken === 'function') {
                removeAuthToken();
            }
            window.location.href = '/login.html';
            return null;
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Authentication API calls
const AuthAPI = {
    async login(email, password) {
        return apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },
    
    async registerStudent(studentData) {
        return apiRequest('/api/auth/register/student', {
            method: 'POST',
            body: JSON.stringify(studentData)
        });
    },
    
    async registerFaculty(facultyData) {
        return apiRequest('/api/auth/register/faculty', {
            method: 'POST',
            body: JSON.stringify(facultyData)
        });
    },
    
    async registerAlumni(alumniData) {
        return apiRequest('/api/auth/register/alumni', {
            method: 'POST',
            body: JSON.stringify(alumniData)
        });
    },
    
    async verifyEmail(verificationCode) {
        return apiRequest('/api/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ verificationCode })
        });
    },
    
    async forgotPassword(email) {
        return apiRequest('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },
    
    async resetPassword(email, otp, newPassword) {
        return apiRequest('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, otp, newPassword })
        });
    }
};

// User API calls
const UserAPI = {
    async getProfile() {
        return apiRequest('/api/user/profile');
    },
    
    async updateProfile(profileData) {
        return apiRequest('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },
    
    async getUserById(userId) {
        return apiRequest(`/api/user/${userId}`);
    },
    
    async getAlumni(departmentId = null) {
        const url = departmentId ? `/api/user/alumni?departmentId=${departmentId}` : '/api/user/alumni';
        return apiRequest(url);
    },
    
    async getFaculty(departmentId = null) {
        const url = departmentId ? `/api/user/faculty?departmentId=${departmentId}` : '/api/user/faculty';
        return apiRequest(url);
    },
    
    async getDepartments() {
        return apiRequest('/api/user/departments');
    }
};

// Posts API calls
const PostsAPI = {
    async getCUETTodayPosts() {
        return apiRequest('/api/posts/cuet-today');
    },
    
    async createCUETTodayPost(title, description) {
        return apiRequest('/api/posts/cuet-today', {
            method: 'POST',
            body: JSON.stringify({ title, description })
        });
    },
    
    async updateCUETTodayPost(postId, title, description) {
        return apiRequest(`/api/posts/cuet-today/${postId}`, {
            method: 'PUT',
            body: JSON.stringify({ title, description })
        });
    },
    
    async deleteCUETTodayPost(postId) {
        return apiRequest(`/api/posts/cuet-today/${postId}`, {
            method: 'DELETE'
        });
    },
    
    async searchCUETTodayPosts(keyword) {
        return apiRequest(`/api/posts/cuet-today/search?keyword=${encodeURIComponent(keyword)}`);
    },
    
    async getLostFoundPosts(category = null) {
        const url = category ? `/api/posts/lost-found?category=${category}` : '/api/posts/lost-found';
        return apiRequest(url);
    },
    
    async createLostFoundPost(title, description, category, url = '') {
        return apiRequest('/api/posts/lost-found', {
            method: 'POST',
            body: JSON.stringify({ title, description, category, url })
        });
    },
    
    async updateLostFoundPost(id, title, description, url = '') {
        return apiRequest(`/api/posts/lost-found/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, description, url })
        });
    },
    
    async deleteLostFoundPost(id) {
        return apiRequest(`/api/posts/lost-found/${id}`, {
            method: 'DELETE'
        });
    },
    
    async searchLostFoundPosts(keyword) {
        return apiRequest(`/api/posts/lost-found/search?keyword=${encodeURIComponent(keyword)}`);
    }
};

// Collab API calls
const CollabAPI = {
    async getCollabPosts(section = null, status = null) {
        const params = new URLSearchParams();
        if (section) params.append('section', section);
        if (status) params.append('status', status);
        
        const url = params.toString() ? `/api/collab?${params.toString()}` : '/api/collab';
        return apiRequest(url);
    },
    
    async createCollabPost(title, description, contactInfo, section) {
        return apiRequest('/api/collab', {
            method: 'POST',
            body: JSON.stringify({ title, description, contactInfo, section })
        });
    },
    
    async getCollab(id) {
        return apiRequest(`/api/collab/${id}`);
    },
    
    async updateCollabPost(id, title, description, contactInfo, status) {
        return apiRequest(`/api/collab/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, description, contactInfo, status })
        });
    },
    
    async deleteCollabPost(id) {
        return apiRequest(`/api/collab/${id}`, {
            method: 'DELETE'
        });
    },
    
    async searchCollabPosts(keyword) {
        return apiRequest(`/api/collab/search?keyword=${encodeURIComponent(keyword)}`);
    }
};

// Resources API calls
const ResourcesAPI = {
    async getResources(category = null) {
        const url = category ? `/api/resources?category=${category}` : '/api/resources';
        return apiRequest(url);
    },
    
    async createResource(title, description, url, category) {
        return apiRequest('/api/resources', {
            method: 'POST',
            body: JSON.stringify({ title, description, url, category })
        });
    },
    
    async updateResource(id, title, description, url) {
        return apiRequest(`/api/resources/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, description, url })
        });
    },
    
    async deleteResource(id) {
        return apiRequest(`/api/resources/${id}`, {
            method: 'DELETE'
        });
    },
    
    async searchResources(keyword) {
        return apiRequest(`/api/resources/search?keyword=${encodeURIComponent(keyword)}`);
    }
};

// Admin API calls
const AdminAPI = {
    async getPendingAlumni() {
        return apiRequest('/api/admin/alumni/pending');
    },
    
    async approveAlumni(alumniId) {
        return apiRequest(`/api/admin/alumni/${alumniId}/approve`, {
            method: 'POST'
        });
    },
    
    async rejectAlumni(alumniId) {
        return apiRequest(`/api/admin/alumni/${alumniId}/reject`, {
            method: 'POST'
        });
    }
};

// Export for use in other files
window.API = {
    Auth: AuthAPI,
    User: UserAPI,
    Posts: PostsAPI,
    Collab: CollabAPI,
    Resources: ResourcesAPI,
    Admin: AdminAPI
};