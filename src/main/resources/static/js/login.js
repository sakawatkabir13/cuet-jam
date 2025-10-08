// Login page functionality

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    
    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        clearFormErrors('loginForm');
        hideAlert('alert');
        setButtonLoading('loginBtn', true);
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!email) {
            showFieldError('email', 'Email is required');
            setButtonLoading('loginBtn', false);
            return;
        }
        
        if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            setButtonLoading('loginBtn', false);
            return;
        }
        
        if (!password) {
            showFieldError('password', 'Password is required');
            setButtonLoading('loginBtn', false);
            return;
        }
        
        try {
            const response = await API.Auth.login(email, password);
            
            if (response.success) {
                // Store token and user data
                setAuthToken(response.token);
                setCurrentUser(response.user);
                
                showAlert('alert', 'Login successful! Redirecting...', 'success');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/home.html';
                }, 1500);
            } else {
                showAlert('alert', response.message);
                setButtonLoading('loginBtn', false);
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle validation errors
            if (error.errors) {
                // Show field-specific errors
                Object.keys(error.errors).forEach(field => {
                    showFieldError(field, error.errors[field]);
                });
            } else if (error.message.includes('verify') || error.message.includes('email address')) {
                showAlert('alert', 'Your email is not verified. Please complete the verification process during registration.');
            } else {
                showAlert('alert', error.message || 'Login failed. Please try again.');
            }
            
            setButtonLoading('loginBtn', false);
        }
    });
    
    // Handle forgot password link
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        showForgotPasswordModal();
    });
    
    // Handle email verification
    const verificationForm = document.getElementById('verificationForm');
    verificationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const verificationCode = document.getElementById('verificationCode').value.trim();
        
        if (!verificationCode || verificationCode.length !== 6) {
            showAlert('verificationAlert', 'Please enter a valid 6-digit verification code');
            return;
        }
        
        try {
            const response = await API.Auth.verifyEmail(verificationCode);
            
            if (response.success) {
                showAlert('verificationAlert', response.message, 'success');
                
                // If login credentials are provided, log the user in automatically
                if (response.token && response.user) {
                    setAuthToken(response.token);
                    setCurrentUser(response.user);
                    
                    setTimeout(() => {
                        closeVerificationModal();
                        window.location.href = '/home.html';
                    }, 1500);
                } else {
                    setTimeout(() => {
                        closeVerificationModal();
                        // Clear the login form to allow re-login
                        document.getElementById('password').value = '';
                    }, 2000);
                }
            } else {
                showAlert('verificationAlert', response.message);
            }
        } catch (error) {
            showAlert('verificationAlert', error.message || 'Verification failed. Please try again.');
        }
    });
    
    // Handle forgot password form (Step 1: Send OTP)
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    forgotPasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value.trim();
        
        if (!email || !isValidEmail(email)) {
            showAlert('forgotAlert', 'Please enter a valid email address');
            return;
        }
        
        setButtonLoading('forgotPasswordForm button[type="submit"]', true);
        
        try {
            const response = await API.Auth.forgotPassword(email);
            if (response.success) {
                showAlert('forgotAlert', response.message, 'success');
                
                // Move to step 2 after successful OTP send
                setTimeout(() => {
                    showPasswordResetStep2();
                }, 1500);
            } else {
                showAlert('forgotAlert', response.message);
            }
        } catch (error) {
            showAlert('forgotAlert', error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setButtonLoading('forgotPasswordForm button[type="submit"]', false);
        }
    });
    
    // Handle reset password form (Step 2: Verify OTP and Reset)
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    resetPasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value.trim();
        const otp = document.getElementById('resetOTP').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (!otp || otp.length !== 6) {
            showAlert('forgotAlert', 'Please enter a valid 6-digit OTP');
            return;
        }
        
        if (!newPassword || newPassword.length < 6) {
            showAlert('forgotAlert', 'Password must be at least 6 characters long');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showAlert('forgotAlert', 'Passwords do not match');
            return;
        }
        
        setButtonLoading('resetPasswordForm button[type="submit"]', true);
        
        try {
            const response = await API.Auth.resetPassword(email, otp, newPassword);
            if (response.success) {
                showAlert('forgotAlert', response.message, 'success');
                
                setTimeout(() => {
                    closeForgotPasswordModal();
                    showAlert('alert', 'Password reset successfully! You can now log in with your new password.', 'success');
                }, 2000);
            } else {
                showAlert('forgotAlert', response.message);
            }
        } catch (error) {
            showAlert('forgotAlert', error.message || 'Failed to reset password. Please try again.');
        } finally {
            setButtonLoading('resetPasswordForm button[type="submit"]', false);
        }
    });
});

// Show email verification modal
function showEmailVerificationModal() {
    document.getElementById('verificationModal').style.display = 'flex';
    document.getElementById('verificationCode').focus();
    hideAlert('verificationAlert');
}

// Close email verification modal
function closeVerificationModal() {
    document.getElementById('verificationModal').style.display = 'none';
    document.getElementById('verificationCode').value = '';
    hideAlert('verificationAlert');
}

// Show forgot password modal
function showForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'flex';
    showPasswordResetStep1();
    document.getElementById('forgotEmail').focus();
    hideAlert('forgotAlert');
}

// Close forgot password modal
function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').style.display = 'none';
    showPasswordResetStep1(); // Reset to step 1
    document.getElementById('forgotEmail').value = '';
    document.getElementById('resetOTP').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    hideAlert('forgotAlert');
}

// Show password reset step 1 (email input)
function showPasswordResetStep1() {
    document.getElementById('forgotPasswordStep1').style.display = 'block';
    document.getElementById('forgotPasswordStep2').style.display = 'none';
}

// Show password reset step 2 (OTP and new password)
function showPasswordResetStep2() {
    document.getElementById('forgotPasswordStep1').style.display = 'none';
    document.getElementById('forgotPasswordStep2').style.display = 'block';
    document.getElementById('resetOTP').focus();
    hideAlert('forgotAlert');
}

// Go back to email step
function backToEmailStep() {
    showPasswordResetStep1();
    document.getElementById('forgotEmail').focus();
    hideAlert('forgotAlert');
}

// Handle click outside modal to close
document.addEventListener('click', function(e) {
    const verificationModal = document.getElementById('verificationModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    
    if (e.target === verificationModal) {
        closeVerificationModal();
    }
    
    if (e.target === forgotPasswordModal) {
        closeForgotPasswordModal();
    }
});

// Handle verification code input formatting
document.getElementById('verificationCode').addEventListener('input', function(e) {
    // Remove any non-digit characters
    e.target.value = e.target.value.replace(/\D/g, '');
    
    // Limit to 6 digits
    if (e.target.value.length > 6) {
        e.target.value = e.target.value.substring(0, 6);
    }
});

// Handle reset OTP input formatting
document.getElementById('resetOTP').addEventListener('input', function(e) {
    // Remove any non-digit characters
    e.target.value = e.target.value.replace(/\D/g, '');
    
    // Limit to 6 digits
    if (e.target.value.length > 6) {
        e.target.value = e.target.value.substring(0, 6);
    }
});

// Auto-submit verification form when 6 digits are entered
document.getElementById('verificationCode').addEventListener('input', function(e) {
    if (e.target.value.length === 6) {
        setTimeout(() => {
            document.getElementById('verificationForm').dispatchEvent(new Event('submit'));
        }, 500);
    }
});