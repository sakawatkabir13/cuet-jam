// Alumni registration page functionality

document.addEventListener('DOMContentLoaded', function() {
    const alumniRegisterForm = document.getElementById('alumniRegisterForm');
    
    // Handle form submission
    alumniRegisterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        clearFormErrors('alumniRegisterForm');
        hideAlert('alert');
        setButtonLoading('registerBtn', true);
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            department: document.getElementById('department').value,
            currentWorkingPlace: document.getElementById('currentWorkingPlace').value.trim(),
            researchAreas: document.getElementById('researchAreas').value.trim(),
            shortDescription: document.getElementById('shortDescription').value.trim(),
            proofUrl: document.getElementById('proofUrl').value.trim(),
            agreeTerms: document.getElementById('agreeTerms').checked
        };
        
        // Validate form
        if (!validateAlumniForm(formData)) {
            setButtonLoading('registerBtn', false);
            return;
        }
        
        try {
            const response = await API.Auth.registerAlumni({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                department: formData.department,
                currentWorkingPlace: formData.currentWorkingPlace,
                researchAreas: formData.researchAreas,
                shortDescription: formData.shortDescription,
                proofUrl: formData.proofUrl
            });
            
            if (response.success) {
                showAlert('alert', response.message, 'success');
                
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
        if (email && !isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
        } else if (email && isValidEmail(email)) {
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
    
    // Proof URL validation
    document.getElementById('proofUrl').addEventListener('blur', function(e) {
        const url = e.target.value.trim();
        if (url && !isValidUrl(url)) {
            showFieldError('proofUrl', 'Please enter a valid URL');
        } else if (url && !url.includes('drive.google.com')) {
            showFieldError('proofUrl', 'Please provide a Google Drive link for better accessibility');
        }
    });
});

function validateAlumniForm(data) {
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
    } else if (!isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
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
    
    // Department validation
    if (!data.department) {
        showFieldError('department', 'Please select your department');
        isValid = false;
    }
    
    // Proof URL validation
    if (!data.proofUrl) {
        showFieldError('proofUrl', 'Proof document URL is required');
        isValid = false;
    } else if (!isValidUrl(data.proofUrl)) {
        showFieldError('proofUrl', 'Please enter a valid URL');
        isValid = false;
    }
    
    // Terms agreement validation
    if (!data.agreeTerms) {
        showFieldError('agreeTerms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    // Optional field validations (if provided)
    if (data.currentWorkingPlace && data.currentWorkingPlace.length > 200) {
        showFieldError('currentWorkingPlace', 'Current working place must not exceed 200 characters');
        isValid = false;
    }
    
    if (data.researchAreas && data.researchAreas.length > 1000) {
        showFieldError('researchAreas', 'Research areas must not exceed 1000 characters');
        isValid = false;
    }
    
    if (data.shortDescription && data.shortDescription.length > 500) {
        showFieldError('shortDescription', 'Short description must not exceed 500 characters');
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

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}