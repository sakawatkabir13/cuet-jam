// Student registration page functionality

document.addEventListener('DOMContentLoaded', function() {
    const studentRegisterForm = document.getElementById('studentRegisterForm');
    
    // Handle form submission
    studentRegisterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        clearFormErrors('studentRegisterForm');
        hideAlert('alert');
        setButtonLoading('registerBtn', true);
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            batch: parseInt(document.getElementById('batch').value),
            department: document.getElementById('department').value
        };
        
        // Validate form
        if (!validateStudentForm(formData)) {
            setButtonLoading('registerBtn', false);
            return;
        }
        
        try {
            const response = await API.Auth.registerStudent({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                batch: formData.batch,
                department: formData.department
            });
            
            if (response.success) {
                showAlert('alert', response.message, 'success');
                
                // Clear form
                studentRegisterForm.reset();
                
                // Show verification modal after registration
                setTimeout(() => {
                    showVerificationModal();
                }, 2000);
            } else {
                showAlert('alert', response.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('alert', error.message || 'Registration failed. Please try again.');
        }
        
        setButtonLoading('registerBtn', false);
    });
    
    // Real-time email validation
    document.getElementById('email').addEventListener('blur', function(e) {
        const email = e.target.value.trim();
        if (email && !isValidCUETStudentEmail(email)) {
            showFieldError('email', 'Please enter a valid CUET student email (format: u1234567@student.cuet.ac.bd)');
        } else if (email && isValidCUETStudentEmail(email)) {
            clearFieldError('email');
        }
    });
    
    // Real-time password validation
    document.getElementById('password').addEventListener('input', function(e) {
        const password = e.target.value;
        const validation = validatePassword(password);
        
        if (password && !validation.valid) {
            showFieldError('password', validation.message);
        } else if (password && validation.valid) {
            clearFieldError('password');
        }
    });
    
    // Confirm password validation
    document.getElementById('confirmPassword').addEventListener('blur', function(e) {
        const password = document.getElementById('password').value;
        const confirmPassword = e.target.value;
        
        if (confirmPassword && password !== confirmPassword) {
            showFieldError('confirmPassword', 'Passwords do not match');
        } else if (confirmPassword && password === confirmPassword) {
            clearFieldError('confirmPassword');
        }
    });
});

function validateStudentForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name) {
        showFieldError('name', 'Name is required');
        isValid = false;
    } else if (data.name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    if (!data.email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidCUETStudentEmail(data.email)) {
        showFieldError('email', 'Please enter a valid CUET student email (format: u1234567@student.cuet.ac.bd)');
        isValid = false;
    }
    
    // Password validation
    if (!data.password) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else {
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid) {
            showFieldError('password', passwordValidation.message);
            isValid = false;
        }
    }
    
    // Confirm password validation
    if (!data.confirmPassword) {
        showFieldError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Batch validation
    if (!data.batch) {
        showFieldError('batch', 'Please select your batch');
        isValid = false;
    } else if (data.batch < 2010 || data.batch > 2030) {
        showFieldError('batch', 'Please select a valid batch');
        isValid = false;
    }
    
    // Department validation
    if (!data.department) {
        showFieldError('department', 'Please select your department');
        isValid = false;
    }
    
    return isValid;
}

// Verification Modal Functions
function showVerificationModal() {
    const modal = document.getElementById('verificationModal');
    modal.style.display = 'flex';
    document.getElementById('verificationCode').focus();
}

function closeVerificationModal() {
    const modal = document.getElementById('verificationModal');
    modal.style.display = 'none';
    document.getElementById('verificationCode').value = '';
    const alert = document.getElementById('verificationAlert');
    alert.style.display = 'none';
}

// Add verification form event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const verificationForm = document.getElementById('verificationForm');
    if (verificationForm) {
        verificationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const verificationCode = document.getElementById('verificationCode').value.trim();
            
            if (!verificationCode) {
                showAlert('verificationAlert', 'Please enter the verification code');
                return;
            }
            
            setButtonLoading('verifyBtn', true);
            
            try {
                const response = await API.Auth.verifyEmail(verificationCode);
                
                if (response.success) {
                    showAlert('verificationAlert', 'Email verified successfully! Redirecting to login...', 'success');
                    
                    setTimeout(() => {
                        closeVerificationModal();
                        window.location.href = '/login.html';
                    }, 2000);
                } else {
                    showAlert('verificationAlert', response.message);
                }
            } catch (error) {
                console.error('Verification error:', error);
                showAlert('verificationAlert', error.message || 'Verification failed. Please try again.');
            }
            
            setButtonLoading('verifyBtn', false);
        });
    }
});