// Authentication utility functions

// Token management
function getAuthToken() {
    return localStorage.getItem('authToken');
}

function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Check if user is authenticated
function isAuthenticated() {
    const token = getAuthToken();
    if (!token) return false;
    
    // Check if token is expired (basic check)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
    } catch (e) {
        return false;
    }
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    removeAuthToken();
    window.location.href = '/login.html';
}

// Show/hide loading state for buttons
function setButtonLoading(buttonId, loading = true) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const textSpan = button.querySelector('.btn-text');
    const spinnerSpan = button.querySelector('.btn-spinner');
    
    if (loading) {
        if (textSpan) textSpan.style.display = 'none';
        if (spinnerSpan) spinnerSpan.style.display = 'flex';
        button.disabled = true;
    } else {
        if (textSpan) textSpan.style.display = 'block';
        if (spinnerSpan) spinnerSpan.style.display = 'none';
        button.disabled = false;
    }
}

// Show alert message
function showAlert(elementId, message, type = 'error') {
    const alertElement = document.getElementById(elementId);
    if (!alertElement) return;
    
    alertElement.className = `alert ${type}`;
    alertElement.textContent = message;
    alertElement.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }
}

// Hide alert message
function hideAlert(elementId) {
    const alertElement = document.getElementById(elementId);
    if (alertElement) {
        alertElement.style.display = 'none';
    }
}

// Clear form errors
function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

// Show form field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear individual field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate CUET student email
function isValidCUETStudentEmail(email) {
    const cuetStudentRegex = /^u\d{7}@student\.cuet\.ac\.bd$/;
    return cuetStudentRegex.test(email);
}

// Validate CUET faculty email
function isValidCUETFacultyEmail(email) {
    const cuetFacultyRegex = /^[a-zA-Z0-9.]+@cuet\.ac\.bd$/;
    return cuetFacultyRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    
    let strength = 0;
    if (hasLowerCase) strength++;
    if (hasUpperCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;
    
    return {
        valid: true,
        strength: strength,
        message: strength < 2 ? 'Weak password' : strength < 4 ? 'Medium password' : 'Strong password'
    };
}

// Format date for display with exact time
function formatDate(dateString) {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Format time part
    const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // Show exact time for recent posts
    if (diffMinutes < 1) {
        return 'Just now';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hours ago at ${timeString}`;
    } else if (diffDays === 1) {
        return `Yesterday at ${timeString}`;
    } else if (diffDays < 7) {
        return `${diffDays} days ago at ${timeString}`;
    } else {
        // For older posts, show full date and time
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) + ` at ${timeString}`;
    }
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get user avatar initials
function getUserInitials(name) {
    if (!name) return '?';
    const names = name.trim().split(' ');
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Initialize authentication check on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a protected page
    const protectedPages = ['home.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        requireAuth();
    }
    
    // Redirect to home if already authenticated and on auth pages
    const authPages = ['login.html', 'register-student.html', 'register-faculty.html', 'register-alumni.html'];
    if (authPages.includes(currentPage) && isAuthenticated()) {
        window.location.href = '/home.html';
    }
});