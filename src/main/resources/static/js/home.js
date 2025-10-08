// Home page functionality

let currentSection = 'welcome';
let currentUser = null;
let departments = [];

document.addEventListener('DOMContentLoaded', function() {
    // Ensure user is authenticated
    if (!requireAuth()) return;
    
    // Get current user
    currentUser = getCurrentUser();
    
    // Initialize page
    initializePage();
});

async function initializePage() {
    try {
        // Load user welcome message
        loadUserWelcome();
        
        // Load departments
        await loadDepartments();
        
        // Set up event listeners
        setupEventListeners();
        
        // Show welcome section by default
        showSection('welcome');
        
        // Check if user is admin and show admin panel link
        if (currentUser.isAdmin) {
            addAdminNavLink();
        }
        
    } catch (error) {
        console.error('Error initializing page:', error);
        showAlert('alert', 'Failed to load page content. Please refresh and try again.');
    }
}

function loadUserWelcome() {
    const welcomeElement = document.getElementById('userWelcome');
    if (welcomeElement && currentUser) {
        const timeOfDay = getTimeOfDay();
        welcomeElement.textContent = `Good ${timeOfDay}, ${currentUser.name}! Welcome to the CUET community platform.`;
    }
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
}

async function loadDepartments() {
    try {
        departments = await API.User.getDepartments();
        
        // Populate department filters
        populateDepartmentFilters();
    } catch (error) {
        console.error('Error loading departments:', error);
    }
}

function populateDepartmentFilters() {
    const alumniFilter = document.getElementById('alumniDepartmentFilter');
    const facultyFilter = document.getElementById('facultyDepartmentFilter');
    
    departments.forEach(dept => {
        if (alumniFilter) {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            alumniFilter.appendChild(option);
        }
        
        if (facultyFilter) {
            const facultyOption = document.createElement('option');
            facultyOption.value = dept.id;
            facultyOption.textContent = dept.name;
            facultyFilter.appendChild(facultyOption);
        }
    });
}

function addAdminNavLink() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const adminLink = document.createElement('a');
        adminLink.href = '#';
        adminLink.className = 'nav-link';
        adminLink.textContent = 'Admin Panel';
        adminLink.onclick = () => showSection('admin-panel');
        navMenu.appendChild(adminLink);
    }
}

function setupEventListeners() {
    // Search inputs with debouncing
    const searchInputs = [
        { id: 'searchPosts', handler: () => loadCUETTodayPosts() },
        { id: 'searchLostFound', handler: () => loadLostFoundPosts() },
        { id: 'searchCollab', handler: () => loadCollabPosts() },
        { id: 'searchResources', handler: () => loadResources() },
        { id: 'searchAlumni', handler: () => loadAlumni() },
        { id: 'searchFaculty', handler: () => loadFaculty() }
    ];
    
    searchInputs.forEach(input => {
        const element = document.getElementById(input.id);
        if (element) {
            element.addEventListener('input', debounce(input.handler, 500));
        }
    });
    
    // Filter dropdowns
    const filters = [
        { id: 'lostFoundFilter', handler: () => loadLostFoundPosts() },
        { id: 'collabSectionFilter', handler: () => loadCollabPosts() },
        { id: 'collabStatusFilter', handler: () => loadCollabPosts() },
        { id: 'resourceCategoryFilter', handler: () => loadResources() },
        { id: 'alumniDepartmentFilter', handler: () => loadAlumni() },
        { id: 'facultyDepartmentFilter', handler: () => loadFaculty() }
    ];
    
    filters.forEach(filter => {
        const element = document.getElementById(filter.id);
        if (element) {
            element.addEventListener('change', filter.handler);
        }
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section, .welcome-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update active nav link
    updateActiveNavLink(sectionName);
    
    // Load section data
    loadSectionData(sectionName);
    
    currentSection = sectionName;
}

function updateActiveNavLink(sectionName) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current section link
    const activeLink = Array.from(navLinks).find(link => 
        link.textContent.toLowerCase().includes(sectionName.replace('-', ' '))
    );
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

async function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'cuet-today':
            await loadCUETTodayPosts();
            break;
        case 'lost-found':
            await loadLostFoundPosts();
            break;
        case 'collab':
            await loadCollabPosts();
            break;
        case 'resources':
            await loadResources();
            break;
        case 'alumni':
            await loadAlumni();
            break;
        case 'faculty':
            await loadFaculty();
            break;
        case 'admin-panel':
            if (currentUser.isAdmin) {
                await loadPendingAlumni();
            }
            break;
    }
}

// CUET Today Posts
async function loadCUETTodayPosts() {
    const container = document.getElementById('postsContainer');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading posts...</div>';
        
        const searchTerm = document.getElementById('searchPosts')?.value?.trim();
        let posts;
        
        if (searchTerm) {
            posts = await API.Posts.searchCUETTodayPosts(searchTerm);
        } else {
            posts = await API.Posts.getCUETTodayPosts();
        }
        
        displayPosts(posts, container);
    } catch (error) {
        console.error('Error loading posts:', error);
        container.innerHTML = '<div class="error">Failed to load posts. Please try again.</div>';
    }
}

function displayPosts(posts, container) {
    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="empty-state">No posts found.</div>';
        return;
    }
    
    console.log('DEBUG: Current user for post display:', currentUser);
    console.log('DEBUG: Posts to display:', posts);
    
    container.innerHTML = posts.map(post => {
        const isAuthor = currentUser && currentUser.userId === post.authorId;
        const isAdmin = currentUser && currentUser.isAdmin;
        const canEdit = isAuthor; // Only authors can edit
        const canDelete = isAuthor || isAdmin; // Authors and admins can delete
        console.log(`DEBUG: Post ${post.postId} - Author: ${post.authorId}, Current user: ${currentUser?.userId}, Is author: ${isAuthor}, Is admin: ${isAdmin}`);
        
        return `
        <div class="post-card">
            <div class="post-header">
                <div class="post-meta">
                    <span class="post-author" onclick="showUserProfile('${post.authorId}')">${escapeHtml(post.author?.name || 'Unknown')}</span>
                    <span class="post-date">${formatDate(post.timeOfPost)}</span>
                </div>
                ${canEdit || canDelete ? `
                    <div class="post-actions">
                        ${canEdit ? `<button class="btn btn-sm btn-outline" onclick="editPost(${post.postId})">Edit</button>` : ''}
                        ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="deletePost(${post.postId})">${isAdmin && !isAuthor ? 'Delete (Admin)' : 'Delete'}</button>` : ''}
                    </div>
                ` : ''}
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <div class="post-description">${escapeHtml(post.description)}</div>
        </div>
    `;
    }).join('');
}

// Lost & Found Posts
async function loadLostFoundPosts() {
    const container = document.getElementById('lostFoundContainer');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading posts...</div>';
        
        const searchTerm = document.getElementById('searchLostFound')?.value?.trim();
        const category = document.getElementById('lostFoundFilter')?.value;
        let posts;
        
        if (searchTerm) {
            posts = await API.Posts.searchLostFoundPosts(searchTerm);
        } else {
            posts = await API.Posts.getLostFoundPosts(category);
        }
        
        displayLostFoundPosts(posts, container);
    } catch (error) {
        console.error('Error loading lost & found posts:', error);
        container.innerHTML = '<div class="error">Failed to load posts. Please try again.</div>';
    }
}

function displayLostFoundPosts(posts, container) {
    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="empty-state">No posts found.</div>';
        return;
    }
    
    console.log('DEBUG: Current user for Lost & Found display:', currentUser);
    console.log('DEBUG: Lost & Found posts to display:', posts);
    
    container.innerHTML = posts.map(post => {
        const isAuthor = currentUser && currentUser.userId === post.authorId;
        const isAdmin = currentUser && currentUser.isAdmin;
        const canEdit = isAuthor; // Only authors can edit
        const canDelete = isAuthor || isAdmin; // Authors and admins can delete
        console.log(`DEBUG: Lost & Found Post ${post.id} - Author: ${post.authorId}, Current user: ${currentUser?.userId}, Is author: ${isAuthor}, Is admin: ${isAdmin}`);
        
        return `
        <div class="post-card">
            <div class="post-header">
                <div class="post-meta">
                    <span class="post-author" onclick="showUserProfile('${post.authorId}')">${escapeHtml(post.author?.name || 'Unknown')}</span>
                    <span class="post-date">${formatDate(post.timeOfPost)}</span>
                </div>
                <div class="post-tags">
                    <span class="tag ${post.category.toLowerCase()}">${post.category}</span>
                </div>
                ${canEdit || canDelete ? `
                    <div class="post-actions">
                        ${canEdit ? `<button class="btn btn-sm btn-outline" onclick="editLostFound(${post.id})">Edit</button>` : ''}
                        ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="deleteLostFound(${post.id})">${isAdmin && !isAuthor ? 'Delete (Admin)' : 'Delete'}</button>` : ''}
                    </div>
                ` : ''}
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <div class="post-description">${escapeHtml(post.description)}</div>
            ${post.url ? `<div class="post-link"><a href="${post.url}" target="_blank" class="resource-link">View Link</a></div>` : ''}
        </div>
    `;
    }).join('');
}

// Profile management
function showProfile() {
    // Show profile modal and load current user data
    document.getElementById('profileModal').style.display = 'flex';
    loadProfileData();
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
}

async function loadProfileData() {
    const container = document.getElementById('profileContent');
    try {
        container.innerHTML = '<div class="loading">Loading profile...</div>';
        
        const profile = await API.User.getProfile();
        displayProfileForm(profile.user, container);
    } catch (error) {
        console.error('Error loading profile:', error);
        container.innerHTML = '<div class="error">Failed to load profile. Please try again.</div>';
    }
}

function displayProfileForm(user, container) {
    const userTypeSpecificFields = getUserTypeSpecificFields(user);
    
    container.innerHTML = `
        <div class="form-group">
            <label for="profileName">Name</label>
            <input type="text" id="profileName" value="${escapeHtml(user.name)}">
        </div>
        
        <div class="form-group">
            <label for="profileEmail">Email</label>
            <input type="email" id="profileEmail" value="${escapeHtml(user.email)}" readonly>
            <div class="form-hint">Email cannot be changed</div>
        </div>
        
        <div class="form-group">
            <label for="profilePassword">New Password (leave empty to keep current)</label>
            <input type="password" id="profilePassword" placeholder="Enter new password">
        </div>
        
        <div class="form-group">
            <label for="profileDepartment">Department</label>
            <input type="text" id="profileDepartment" value="${user.department?.name || ''}" readonly>
        </div>
        
        ${userTypeSpecificFields}
        
        <div class="form-actions">
            <button type="button" class="btn btn-primary" onclick="updateProfile()">Update Profile</button>
            <button type="button" class="btn btn-outline" onclick="closeProfileModal()">Cancel</button>
        </div>
        
        <div class="alert" id="profileAlert" style="display: none;"></div>
    `;
}

function getUserTypeSpecificFields(user) {
    switch (user.userType) {
        case 'STUDENT':
            return `
                <div class="form-group">
                    <label for="profileBatch">Batch</label>
                    <input type="number" id="profileBatch" value="${user.batch || ''}" min="2010" max="2030">
                </div>
            `;
        case 'FACULTY':
            return `
                <div class="form-group">
                    <label for="profileDesignation">Designation</label>
                    <input type="text" id="profileDesignation" value="${escapeHtml(user.designation || '')}">
                </div>
                <div class="form-group">
                    <label for="profileResearchAreas">Research Areas</label>
                    <textarea id="profileResearchAreas" rows="3">${escapeHtml(user.researchAreas || '')}</textarea>
                </div>
            `;
        case 'ALUMNI':
            return `
                <div class="form-group">
                    <label for="profileWorkingPlace">Current Working Place</label>
                    <input type="text" id="profileWorkingPlace" value="${escapeHtml(user.currentWorkingPlace || '')}">
                </div>
                <div class="form-group">
                    <label for="profileResearchAreas">Research Areas</label>
                    <textarea id="profileResearchAreas" rows="3">${escapeHtml(user.researchAreas || '')}</textarea>
                </div>
                <div class="form-group">
                    <label for="profileDescription">Short Description</label>
                    <textarea id="profileDescription" rows="3">${escapeHtml(user.shortDescription || '')}</textarea>
                </div>
            `;
        default:
            return '';
    }
}

async function updateProfile() {
    try {
        const updateData = {
            name: document.getElementById('profileName').value.trim(),
            password: document.getElementById('profilePassword').value
        };
        
        // Add user type specific fields
        if (currentUser.userType === 'STUDENT') {
            const batch = document.getElementById('profileBatch').value;
            if (batch) updateData.batch = parseInt(batch);
        } else if (currentUser.userType === 'FACULTY') {
            updateData.designation = document.getElementById('profileDesignation').value.trim();
            updateData.researchAreas = document.getElementById('profileResearchAreas').value.trim();
        } else if (currentUser.userType === 'ALUMNI') {
            updateData.currentWorkingPlace = document.getElementById('profileWorkingPlace').value.trim();
            updateData.researchAreas = document.getElementById('profileResearchAreas').value.trim();
            updateData.shortDescription = document.getElementById('profileDescription').value.trim();
        }
        
        const response = await API.User.updateProfile(updateData);
        
        if (response.success) {
            showAlert('profileAlert', response.message, 'success');
            // Update current user data
            setCurrentUser(response.user);
            currentUser = response.user;
            loadUserWelcome();
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('profileAlert', error.message || 'Failed to update profile');
    }
}

// Create post functionality
function showCreatePostModal() {
    console.log('DEBUG: showCreatePostModal called for section:', currentSection);
    
    const modal = document.getElementById('createPostModal');
    const form = document.getElementById('createPostForm');
    
    // Update modal title based on current section
    const modalTitle = document.querySelector('#createPostModal .modal-header h3');
    const sectionNames = {
        'cuet-today': 'Create CUET Today Post',
        'lost-found': 'Create Lost & Found Post',
        'collab': 'Create Collaboration Post',
        'resources': 'Create Resource Post',
        'alumni-network': 'Create Alumni Post',
        'faculty-section': 'Create Faculty Post'
    };
    modalTitle.textContent = sectionNames[currentSection] || 'Create Post';
    
    console.log('DEBUG: Modal title set to:', modalTitle.textContent);
    
    // Remove any existing dynamic fields
    const existingDynamicFields = form.querySelectorAll('.dynamic-field');
    existingDynamicFields.forEach(field => field.remove());
    
    // Add section-specific fields
    const descriptionInput = document.getElementById('postDescription');
    const descriptionGroup = descriptionInput ? descriptionInput.parentElement : form.children[1];
    
    console.log('DEBUG: About to add fields for section:', currentSection);
    console.log('DEBUG: descriptionGroup found:', !!descriptionGroup);
    
    switch(currentSection) {
        case 'lost-found':
            console.log('DEBUG: Adding lost-found fields');
            // Add category selection
            const categoryGroup = document.createElement('div');
            categoryGroup.className = 'form-group dynamic-field';
            categoryGroup.innerHTML = `
                <label for="postCategory">Category *</label>
                <select id="postCategory" required>
                    <option value="LOST">Lost</option>
                    <option value="FOUND">Found</option>
                </select>
            `;
            
            // Add URL field
            const urlGroup = document.createElement('div');
            urlGroup.className = 'form-group dynamic-field';
            urlGroup.innerHTML = `
                <label for="postUrl">Image URL (optional)</label>
                <input type="url" id="postUrl" placeholder="https://example.com/image.jpg">
            `;
            
            if (descriptionGroup && descriptionGroup.parentNode) {
                descriptionGroup.parentNode.insertBefore(categoryGroup, descriptionGroup.nextSibling);
                descriptionGroup.parentNode.insertBefore(urlGroup, categoryGroup.nextSibling);
            }
            console.log('DEBUG: Lost-found fields added');
            break;
            
        case 'collab':
            console.log('DEBUG: Adding study-collab fields');
            // Add contact info
            const contactGroup = document.createElement('div');
            contactGroup.className = 'form-group dynamic-field';
            contactGroup.innerHTML = `
                <label for="postContactInfo">Contact Information *</label>
                <input type="text" id="postContactInfo" required placeholder="Email, phone, or other contact details">
            `;
            
            // Add section selection
            const sectionGroup = document.createElement('div');
            sectionGroup.className = 'form-group dynamic-field';
            sectionGroup.innerHTML = `
                <label for="postSection">Collaboration Type *</label>
                <select id="postSection" required>
                    <option value="RESEARCH">Research</option>
                    <option value="COMPETITION_PARTNER">Competition Partner</option>
                    <option value="ACADEMICS">Academics</option>
                    <option value="OTHERS">Others</option>
                </select>
            `;
            
            if (descriptionGroup && descriptionGroup.parentNode) {
                descriptionGroup.parentNode.insertBefore(contactGroup, descriptionGroup.nextSibling);
                descriptionGroup.parentNode.insertBefore(sectionGroup, contactGroup.nextSibling);
            }
            console.log('DEBUG: Study-collab fields added');
            break;
            
        case 'resources':
            console.log('DEBUG: Adding resource-library fields');
            // Add URL field (required)
            const resourceUrlGroup = document.createElement('div');
            resourceUrlGroup.className = 'form-group dynamic-field';
            resourceUrlGroup.innerHTML = `
                <label for="postUrl">Resource URL or Drive Link *</label>
                <input type="url" id="postUrl" required placeholder="https://example.com/resource or drive.google.com/...">
            `;
            
            // Add category selection
            const resourceCategoryGroup = document.createElement('div');
            resourceCategoryGroup.className = 'form-group dynamic-field';
            resourceCategoryGroup.innerHTML = `
                <label for="postCategory">Category *</label>
                <select id="postCategory" required>
                    <option value="ACADEMICS">Academics</option>
                    <option value="HIGHER_STUDY">Higher Study</option>
                    <option value="CHOTHA">Chotha</option>
                    <option value="OTHERS">Others</option>
                </select>
            `;
            
            if (descriptionGroup && descriptionGroup.parentNode) {
                descriptionGroup.parentNode.insertBefore(resourceUrlGroup, descriptionGroup.nextSibling);
                descriptionGroup.parentNode.insertBefore(resourceCategoryGroup, resourceUrlGroup.nextSibling);
            }
            console.log('DEBUG: Resource-library fields added');
            break;
    }
    
    modal.style.display = 'flex';
    document.getElementById('postTitle').focus();
}

function closeCreatePostModal() {
    const modal = document.getElementById('createPostModal');
    const form = document.getElementById('createPostForm');
    
    // Remove dynamic fields
    const existingDynamicFields = form.querySelectorAll('.dynamic-field');
    existingDynamicFields.forEach(field => field.remove());
    
    modal.style.display = 'none';
    form.reset();
    hideAlert('createPostAlert');
}

// Initialize create post form
document.getElementById('createPostForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('DEBUG: Form submitted for section:', currentSection);
    
    const title = document.getElementById('postTitle').value.trim();
    const description = document.getElementById('postDescription').value.trim();
    
    console.log('DEBUG: Title:', title, 'Description:', description);
    
    if (!title || !description) {
        showAlert('createPostAlert', 'Please fill in all required fields');
        return;
    }
    
    try {
        let response;
        
        console.log('DEBUG: About to create post for section:', currentSection);
        console.log('DEBUG: Current user:', currentUser);
        console.log('DEBUG: JWT token exists:', !!localStorage.getItem('jwt'));
        
        switch(currentSection) {
            case 'cuet-today':
                response = await API.Posts.createCUETTodayPost(title, description);
                break;
                
            case 'lost-found':
                console.log('DEBUG: Creating lost-found post');
                const categoryElement = document.getElementById('postCategory');
                const urlElement = document.getElementById('postUrl');
                console.log('DEBUG: Category element found:', !!categoryElement);
                console.log('DEBUG: URL element found:', !!urlElement);
                
                const category = categoryElement?.value || 'LOST';
                const url = urlElement?.value || '';
                console.log('DEBUG: Category:', category, 'URL:', url);
                response = await API.Posts.createLostFoundPost(title, description, category, url);
                console.log('DEBUG: Lost-found response:', response);
                break;
                
            case 'collab':
                console.log('DEBUG: Creating collab post');
                const contactInfoElement = document.getElementById('postContactInfo');
                const sectionElement = document.getElementById('postSection');
                console.log('DEBUG: ContactInfo element found:', !!contactInfoElement);
                console.log('DEBUG: Section element found:', !!sectionElement);
                
                const contactInfo = contactInfoElement?.value || '';
                const section = sectionElement?.value || 'ACADEMICS';
                console.log('DEBUG: ContactInfo:', contactInfo, 'Section:', section);
                if (!contactInfo) {
                    showAlert('createPostAlert', 'Contact information is required for collaboration posts');
                    return;
                }
                response = await API.Collab.createCollabPost(title, description, contactInfo, section);
                console.log('DEBUG: Collab response:', response);
                break;
                
            case 'resources':
                console.log('DEBUG: Creating resource post');
                const resourceUrl = document.getElementById('postUrl')?.value || '';
                const resourceCategory = document.getElementById('postCategory')?.value || 'ACADEMICS';
                console.log('DEBUG: ResourceURL:', resourceUrl, 'ResourceCategory:', resourceCategory);
                if (!resourceUrl) {
                    showAlert('createPostAlert', 'URL is required for resource posts');
                    return;
                }
                response = await API.Resources.createResource(title, description, resourceUrl, resourceCategory);
                console.log('DEBUG: Resource response:', response);
                break;
                
            case 'alumni-network':
                // Alumni posts use the general post API
                response = await API.Posts.createCUETTodayPost(title, description);
                break;
                
            case 'faculty-section':
                // Faculty posts use the general post API
                response = await API.Posts.createCUETTodayPost(title, description);
                break;
                
            default:
                throw new Error('Invalid section for post creation');
        }
        
        if (response.success) {
            showAlert('createPostAlert', 'Post created successfully!', 'success');
            setTimeout(() => {
                closeCreatePostModal();
                // Reload the appropriate section
                switch(currentSection) {
                    case 'cuet-today':
                        loadCUETTodayPosts();
                        break;
                    case 'lost-found':
                        loadLostFoundPosts();
                        break;
                    case 'collab':
                        loadCollabPosts();
                        break;
                    case 'resources':
                        loadResources();
                        break;
                    case 'alumni-network':
                        loadCUETTodayPosts();
                        break;
                    case 'faculty-section':
                        loadCUETTodayPosts();
                        break;
                }
            }, 1500);
        }
    } catch (error) {
        console.error('Error creating post:', error);
        showAlert('createPostAlert', error.message || 'Failed to create post');
    }
});

// Handle modal clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        if (e.target.id === 'profileModal') closeProfileModal();
        if (e.target.id === 'createPostModal') closeCreatePostModal();
    }
});

// Admin functionality
async function loadPendingAlumni() {
    if (!currentUser.isAdmin) return;
    
    const container = document.getElementById('pendingAlumniContainer');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading pending approvals...</div>';
        
        const pendingAlumni = await API.Admin.getPendingAlumni();
        displayPendingAlumni(pendingAlumni, container);
    } catch (error) {
        console.error('Error loading pending alumni:', error);
        container.innerHTML = '<div class="error">Failed to load pending approvals.</div>';
    }
}

function displayPendingAlumni(alumni, container) {
    if (!alumni || alumni.length === 0) {
        container.innerHTML = '<div class="empty-state">No pending alumni approvals.</div>';
        return;
    }
    
    container.innerHTML = alumni.map(alumnus => `
        <div class="pending-alumni-item">
            <div class="pending-alumni-header">
                <div>
                    <div class="pending-alumni-name">${escapeHtml(alumnus.name)}</div>
                    <div class="pending-alumni-email">${escapeHtml(alumnus.email)}</div>
                    <div class="pending-alumni-date">Registered: ${formatDate(alumnus.createdAt)}</div>
                </div>
                <div class="pending-status">
                    <span class="status-badge pending">Pending Approval</span>
                </div>
            </div>
            <div class="profile-details">
                <div class="profile-detail">
                    <div class="profile-detail-label">Department:</div>
                    <div class="profile-detail-value">${alumnus.department?.name || 'N/A'}</div>
                </div>
                <div class="profile-detail">
                    <div class="profile-detail-label">Current Working Place:</div>
                    <div class="profile-detail-value">${escapeHtml(alumnus.currentWorkingPlace || 'N/A')}</div>
                </div>
                <div class="profile-detail">
                    <div class="profile-detail-label">Research Areas:</div>
                    <div class="profile-detail-value">${escapeHtml(alumnus.researchAreas || 'N/A')}</div>
                </div>
                <div class="profile-detail">
                    <div class="profile-detail-label">Short Description:</div>
                    <div class="profile-detail-value">${escapeHtml(alumnus.shortDescription || 'N/A')}</div>
                </div>
                <div class="profile-detail">
                    <div class="profile-detail-label">Proof Document:</div>
                    <div class="profile-detail-value">
                        ${alumnus.proofUrl ? `
                            <a href="${alumnus.proofUrl}" target="_blank" class="resource-link">
                                <i class="fas fa-external-link-alt"></i> View Studentship Proof
                            </a>
                        ` : '<span class="text-muted">Not provided</span>'}
                    </div>
                </div>
            </div>
            <div class="pending-alumni-actions">
                <button class="btn btn-sm btn-success" onclick="approveAlumni('${alumnus.userId}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn btn-sm btn-danger" onclick="rejectAlumni('${alumnus.userId}')">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        </div>
    `).join('');
}

async function approveAlumni(alumniId) {
    if (!confirm('Are you sure you want to approve this alumni registration?')) return;
    
    try {
        await API.Admin.approveAlumni(alumniId);
        loadPendingAlumni(); // Reload the list
    } catch (error) {
        console.error('Error approving alumni:', error);
        alert('Failed to approve alumni: ' + error.message);
    }
}

async function rejectAlumni(alumniId) {
    if (!confirm('Are you sure you want to reject this alumni registration? This action cannot be undone.')) return;
    
    try {
        await API.Admin.rejectAlumni(alumniId);
        loadPendingAlumni(); // Reload the list
    } catch (error) {
        console.error('Error rejecting alumni:', error);
        alert('Failed to reject alumni: ' + error.message);
    }
}

// Alumni and Faculty loading functions
async function loadAlumni() {
    const container = document.getElementById('alumniContainer');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading alumni...</div>';
        
        const departmentId = document.getElementById('alumniDepartmentFilter')?.value;
        const alumni = await API.User.getAlumni(departmentId || null);
        
        displayProfiles(alumni, container, 'alumni');
    } catch (error) {
        console.error('Error loading alumni:', error);
        container.innerHTML = '<div class="error">Failed to load alumni.</div>';
    }
}

async function loadFaculty() {
    const container = document.getElementById('facultyContainer');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading faculty...</div>';
        
        const departmentId = document.getElementById('facultyDepartmentFilter')?.value;
        const faculty = await API.User.getFaculty(departmentId || null);
        
        displayProfiles(faculty, container, 'faculty');
    } catch (error) {
        console.error('Error loading faculty:', error);
        container.innerHTML = '<div class="error">Failed to load faculty.</div>';
    }
}

function displayProfiles(profiles, container, type) {
    if (!profiles || profiles.length === 0) {
        container.innerHTML = '<div class="empty-state">No profiles found.</div>';
        return;
    }
    
    container.innerHTML = profiles.map(profile => `
        <div class="profile-card" onclick="showUserProfile('${profile.userId}')">
            <div class="profile-header">
                <div class="profile-avatar">${getUserInitials(profile.name)}</div>
                <div class="profile-name">${escapeHtml(profile.name)}</div>
                ${profile.email ? `<div class="profile-email">${escapeHtml(profile.email)}</div>` : ''}
                ${profile.designation ? `<div class="profile-title">${escapeHtml(profile.designation)}</div>` : ''}
                ${profile.currentWorkingPlace ? `<div class="profile-title">${escapeHtml(profile.currentWorkingPlace)}</div>` : ''}
                <div class="profile-department">${profile.department?.name || 'Unknown'}</div>
            </div>
            <div class="profile-details">
                ${profile.researchAreas ? `
                    <div class="profile-detail">
                        <div class="profile-detail-label">Research Areas:</div>
                        <div class="profile-detail-value">${truncateText(escapeHtml(profile.researchAreas), 100)}</div>
                    </div>
                ` : ''}
                ${profile.shortDescription ? `
                    <div class="profile-detail">
                        <div class="profile-detail-label">About:</div>
                        <div class="profile-detail-value">${truncateText(escapeHtml(profile.shortDescription), 100)}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function showUserProfile(userId) {
    try {
        const response = await API.User.getUserById(userId);
        if (response.success) {
            const user = response.user;
            displayUserProfileModal(user);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        showAlert('alert', 'Failed to load user profile', 'error');
    }
}

function displayUserProfileModal(user) {
    const modal = document.getElementById('profileModal');
    const modalTitle = modal.querySelector('.modal-header h3');
    const container = document.getElementById('profileContent');
    
    // Update modal title
    modalTitle.textContent = `${user.name}'s Profile`;
    
    // Create read-only profile display
    const userTypeInfo = getUserTypeInfo(user);
    
    container.innerHTML = `
        <div class="profile-info">
            <div class="info-group">
                <label>Name:</label>
                <span class="info-value">${escapeHtml(user.name)}</span>
            </div>
            
            ${(user.userType === 'FACULTY' || user.userType === 'ALUMNI') ? `
                <div class="info-group">
                    <label>Email:</label>
                    <span class="info-value">${escapeHtml(user.email)}</span>
                </div>
            ` : ''}
            
            <div class="info-group">
                <label>Department:</label>
                <span class="info-value">${user.department?.name || 'Not specified'}</span>
            </div>
            
            <div class="info-group">
                <label>User Type:</label>
                <span class="info-value">${user.userType.charAt(0) + user.userType.slice(1).toLowerCase()}</span>
            </div>
            
            ${userTypeInfo}
        </div>
        
        <div class="form-actions">
            <button type="button" class="btn btn-outline" onclick="closeProfileModal()">Close</button>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
}

function getUserTypeInfo(user) {
    switch (user.userType) {
        case 'STUDENT':
            return `
                <div class="info-group">
                    <label>Batch:</label>
                    <span class="info-value">${user.batch || 'Not specified'}</span>
                </div>
                ${user.isAdmin ? `
                    <div class="info-group">
                        <label>Role:</label>
                        <span class="info-value admin-badge">Administrator</span>
                    </div>
                ` : ''}
            `;
        case 'FACULTY':
            return `
                <div class="info-group">
                    <label>Designation:</label>
                    <span class="info-value">${escapeHtml(user.designation || 'Not specified')}</span>
                </div>
                ${user.researchAreas ? `
                    <div class="info-group">
                        <label>Research Areas:</label>
                        <span class="info-value">${escapeHtml(user.researchAreas)}</span>
                    </div>
                ` : ''}
            `;
        case 'ALUMNI':
            return `
                ${user.currentWorkingPlace ? `
                    <div class="info-group">
                        <label>Current Working Place:</label>
                        <span class="info-value">${escapeHtml(user.currentWorkingPlace)}</span>
                    </div>
                ` : ''}
                ${user.researchAreas ? `
                    <div class="info-group">
                        <label>Research Areas:</label>
                        <span class="info-value">${escapeHtml(user.researchAreas)}</span>
                    </div>
                ` : ''}
                ${user.shortDescription ? `
                    <div class="info-group">
                        <label>About:</label>
                        <span class="info-value">${escapeHtml(user.shortDescription)}</span>
                    </div>
                ` : ''}
                <div class="info-group">
                    <label>Status:</label>
                    <span class="info-value ${user.isApproved ? 'approved' : 'pending'}">${user.isApproved ? 'Approved Alumni' : 'Pending Approval'}</span>
                </div>
            `;
        default:
            return '';
    }
}

// Resources and Collab loading (similar patterns)
async function loadResources() {
    const container = document.getElementById('resourcesContainer');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading resources...</div>';
        
        const category = document.getElementById('resourceCategoryFilter')?.value;
        const searchTerm = document.getElementById('searchResources')?.value?.trim();
        let resources;
        
        if (searchTerm) {
            resources = await API.Resources.searchResources(searchTerm);
        } else {
            resources = await API.Resources.getResources(category);
        }
        
        displayResources(resources, container);
    } catch (error) {
        console.error('Error loading resources:', error);
        container.innerHTML = '<div class="error">Failed to load resources.</div>';
    }
}

function displayResources(resources, container) {
    if (!resources || resources.length === 0) {
        container.innerHTML = '<div class="empty-state">No resources found.</div>';
        return;
    }
    
    console.log('DEBUG: Current user for Resources display:', currentUser);
    console.log('DEBUG: Resources to display:', resources);
    
    container.innerHTML = resources.map(resource => {
        const isAuthor = currentUser && currentUser.userId === resource.authorId;
        const isAdmin = currentUser && currentUser.isAdmin;
        const canEdit = isAuthor; // Only authors can edit
        const canDelete = isAuthor || isAdmin; // Authors and admins can delete
        console.log(`DEBUG: Resource ${resource.id} - Author: ${resource.authorId}, Current user: ${currentUser?.userId}, Is author: ${isAuthor}, Is admin: ${isAdmin}`);
        
        return `
        <div class="post-card">
            <div class="post-header">
                <div class="post-meta">
                    <span class="post-author" onclick="showUserProfile('${resource.authorId}')">${escapeHtml(resource.author?.name || 'Unknown')}</span>
                    <span class="post-date">${formatDate(resource.createdTime)}</span>
                </div>
                <div class="post-tags">
                    <span class="tag">${resource.category.replace('_', ' ')}</span>
                </div>
                ${canEdit || canDelete ? `
                    <div class="post-actions">
                        ${canEdit ? `<button class="btn btn-sm btn-outline" onclick="editResource(${resource.id})">Edit</button>` : ''}
                        ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="deleteResource(${resource.id})">${isAdmin && !isAuthor ? 'Delete (Admin)' : 'Delete'}</button>` : ''}
                    </div>
                ` : ''}
            </div>
            <h3 class="post-title">${escapeHtml(resource.title)}</h3>
            <div class="post-description">${escapeHtml(resource.description)}</div>
            <div class="post-link">
                <a href="${resource.url}" target="_blank" class="resource-link">Access Resource</a>
            </div>
        </div>
    `;
    }).join('');
}

async function loadCollabPosts() {
    const container = document.getElementById('collabContainer');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Loading posts...</div>';
        
        const section = document.getElementById('collabSectionFilter')?.value;
        const status = document.getElementById('collabStatusFilter')?.value;
        const searchTerm = document.getElementById('searchCollab')?.value?.trim();
        let posts;
        
        if (searchTerm) {
            posts = await API.Collab.searchCollabPosts(searchTerm);
        } else {
            posts = await API.Collab.getCollabPosts(section, status);
        }
        
        displayCollabPosts(posts, container);
    } catch (error) {
        console.error('Error loading collab posts:', error);
        container.innerHTML = '<div class="error">Failed to load posts.</div>';
    }
}

function displayCollabPosts(posts, container) {
    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="empty-state">No collaboration posts found.</div>';
        return;
    }
    
    console.log('DEBUG: Current user for Collab display:', currentUser);
    console.log('DEBUG: Collab posts to display:', posts);
    
    container.innerHTML = posts.map(post => {
        const isAuthor = currentUser && currentUser.userId === post.authorId;
        const isAdmin = currentUser && currentUser.isAdmin;
        const canEdit = isAuthor; // Only authors can edit
        const canDelete = isAuthor || isAdmin; // Authors and admins can delete
        console.log(`DEBUG: Collab ${post.id} - Author: ${post.authorId}, Current user: ${currentUser?.userId}, Is author: ${isAuthor}, Is admin: ${isAdmin}`);
        
        return `
        <div class="post-card">
            <div class="post-header">
                <div class="post-meta">
                    <span class="post-author" onclick="showUserProfile('${post.authorId}')">${escapeHtml(post.author?.name || 'Unknown')}</span>
                    <span class="post-date">${formatDate(post.createdTime)}</span>
                </div>
                <div class="post-tags">
                    <span class="tag ${post.section.toLowerCase()}">${post.section.replace('_', ' ')}</span>
                    <span class="tag status-${post.status.toLowerCase()}">${post.status}</span>
                </div>
                ${canEdit || canDelete ? `
                    <div class="post-actions">
                        ${canEdit ? `<button class="btn btn-sm btn-outline" onclick="editCollab(${post.id})">Edit</button>` : ''}
                        ${canDelete ? `<button class="btn btn-sm btn-danger" onclick="deleteCollab(${post.id})">${isAdmin && !isAuthor ? 'Delete (Admin)' : 'Delete'}</button>` : ''}
                        ${canEdit && post.status === 'OPEN' ? `
                            <button class="btn btn-sm btn-secondary" onclick="closeCollab(${post.id})">Close</button>
                        ` : ''}
                        ${canEdit && post.status !== 'OPEN' ? `
                            <button class="btn btn-sm btn-success" onclick="reopenCollab(${post.id})">Reopen</button>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <div class="post-description">${escapeHtml(post.description)}</div>
            <div class="post-contact">
                <strong>Contact:</strong> ${escapeHtml(post.contactInfo)}
            </div>
            ${post.status === 'OPEN' && currentUser && currentUser.userId !== post.authorId ? `
                <div class="collab-actions">
                    <button class="btn btn-primary" onclick="acceptCollab(${post.id}, '${post.contactInfo}')">
                        <i class="fas fa-handshake"></i> Accept Collaboration
                    </button>
                </div>
            ` : post.status === 'CLOSED' ? `
                <div class="collab-status">
                    <span class="closed-status"><i class="fas fa-lock"></i> This collaboration is closed</span>
                </div>
            ` : ''}
        </div>
    `;
    }).join('');
}

// Collab action functions
async function acceptCollab(collabId, contactInfo) {
    if (!confirm('Do you want to accept this collaboration? You will be redirected to contact the collaborator.')) {
        return;
    }
    
    try {
        // Show contact information
        alert(`Contact Information: ${contactInfo}\n\nPlease reach out to the collaborator using the provided contact details.`);
        
        // Optional: You can add functionality to mark this collaboration as "interested" 
        // or send a notification to the original poster
    } catch (error) {
        console.error('Error accepting collaboration:', error);
        alert('Failed to process collaboration acceptance. Please try again.');
    }
}

async function closeCollab(collabId) {
    if (!confirm('Are you sure you want to close this collaboration? This will prevent others from accepting it.')) {
        return;
    }
    
    try {
        // Get current collab data first
        const currentCollab = await API.Collab.getCollab(collabId);
        if (!currentCollab.success) {
            alert('Failed to get collaboration details');
            return;
        }
        
        const collab = currentCollab.collab;
        const response = await API.Collab.updateCollabPost(
            collabId, 
            collab.title, 
            collab.description, 
            collab.contactInfo, 
            'CLOSED'
        );
        
        if (response.success) {
            alert('Collaboration closed successfully!');
            loadCollabPosts(); // Reload the posts
        } else {
            alert('Failed to close collaboration: ' + response.message);
        }
    } catch (error) {
        console.error('Error closing collaboration:', error);
        alert('Failed to close collaboration. Please try again.');
    }
}

async function reopenCollab(collabId) {
    if (!confirm('Are you sure you want to reopen this collaboration?')) {
        return;
    }
    
    try {
        // Get current collab data first
        const currentCollab = await API.Collab.getCollab(collabId);
        if (!currentCollab.success) {
            alert('Failed to get collaboration details');
            return;
        }
        
        const collab = currentCollab.collab;
        const response = await API.Collab.updateCollabPost(
            collabId, 
            collab.title, 
            collab.description, 
            collab.contactInfo, 
            'OPEN'
        );
        
        if (response.success) {
            alert('Collaboration reopened successfully!');
            loadCollabPosts(); // Reload the posts
        } else {
            alert('Failed to reopen collaboration: ' + response.message);
        }
    } catch (error) {
        console.error('Error reopening collaboration:', error);
        alert('Failed to reopen collaboration. Please try again.');
    }
}

// Edit and Delete Functions for All Sections

// CUET Today Posts Edit/Delete
async function editPost(postId) {
    console.log('DEBUG: Editing post with ID:', postId, 'Current user:', currentUser);
    
    try {
        const response = await API.Posts.getCUETTodayPosts();
        const post = response.find(p => p.postId === postId);
        
        if (!post) {
            alert('Post not found');
            return;
        }
        
        console.log('DEBUG: Found post:', post);
        
        const title = prompt('Edit Title:', post.title);
        if (title === null) return; // User cancelled
        
        const description = prompt('Edit Description:', post.description);
        if (description === null) return; // User cancelled
        
        if (!title.trim() || !description.trim()) {
            alert('Title and description are required');
            return;
        }
        
        const updateResponse = await API.Posts.updateCUETTodayPost(postId, title.trim(), description.trim());
        console.log('DEBUG: Update response:', updateResponse);
        
        if (updateResponse.success) {
            alert('Post updated successfully!');
            loadCUETTodayPosts();
        } else {
            alert('Failed to update post: ' + updateResponse.message);
        }
    } catch (error) {
        console.error('Error editing post:', error);
        alert('Failed to edit post: ' + error.message);
    }
}

async function deletePost(postId) {
    console.log('DEBUG: Deleting post with ID:', postId);
    
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    try {
        const response = await API.Posts.deleteCUETTodayPost(postId);
        console.log('DEBUG: Delete response:', response);
        
        if (response.success) {
            alert('Post deleted successfully!');
            loadCUETTodayPosts();
        } else {
            alert('Failed to delete post: ' + response.message);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post: ' + error.message);
    }
}

// Lost & Found Edit/Delete
async function editLostFound(postId) {
    try {
        const response = await API.Posts.getLostFoundPosts();
        const post = response.find(p => p.id === postId);
        
        if (!post) {
            alert('Lost & Found post not found');
            return;
        }
        
        const title = prompt('Edit Title:', post.title);
        if (title === null) return; // User cancelled
        
        const description = prompt('Edit Description:', post.description);
        if (description === null) return; // User cancelled
        
        const url = prompt('Edit Image URL (optional):', post.url || '');
        if (url === null) return; // User cancelled
        
        if (!title.trim() || !description.trim()) {
            alert('Title and description are required');
            return;
        }
        
        const updateResponse = await API.Posts.updateLostFoundPost(postId, title.trim(), description.trim(), url.trim());
        if (updateResponse.success) {
            alert('Lost & Found post updated successfully!');
            loadLostFoundPosts();
        } else {
            alert('Failed to update post: ' + updateResponse.message);
        }
    } catch (error) {
        console.error('Error editing Lost & Found post:', error);
        alert('Failed to edit post. Please try again.');
    }
}

async function deleteLostFound(postId) {
    if (!confirm('Are you sure you want to delete this Lost & Found post?')) {
        return;
    }
    
    try {
        const response = await API.Posts.deleteLostFoundPost(postId);
        if (response.success) {
            alert('Lost & Found post deleted successfully!');
            loadLostFoundPosts();
        } else {
            alert('Failed to delete post: ' + response.message);
        }
    } catch (error) {
        console.error('Error deleting Lost & Found post:', error);
        alert('Failed to delete post. Please try again.');
    }
}

// Collaboration Edit/Delete
async function editCollab(collabId) {
    try {
        const response = await API.Collab.getCollab(collabId);
        if (!response.success) {
            alert('Collaboration not found');
            return;
        }
        
        const collab = response.collab;
        
        const title = prompt('Edit Title:', collab.title);
        if (title === null) return; // User cancelled
        
        const description = prompt('Edit Description:', collab.description);
        if (description === null) return; // User cancelled
        
        const contactInfo = prompt('Edit Contact Info:', collab.contactInfo);
        if (contactInfo === null) return; // User cancelled
        
        const statusInput = prompt('Edit Status (OPEN/CLOSED):', collab.status);
        if (statusInput === null) return; // User cancelled
        
        const status = statusInput.toUpperCase();
        if (status !== 'OPEN' && status !== 'CLOSED') {
            alert('Status must be either OPEN or CLOSED');
            return;
        }
        
        if (!title.trim() || !description.trim() || !contactInfo.trim()) {
            alert('Title, description, and contact info are required');
            return;
        }
        
        const updateResponse = await API.Collab.updateCollabPost(
            collabId, 
            title.trim(), 
            description.trim(), 
            contactInfo.trim(), 
            status
        );
        
        if (updateResponse.success) {
            alert('Collaboration updated successfully!');
            loadCollabPosts();
        } else {
            alert('Failed to update collaboration: ' + updateResponse.message);
        }
    } catch (error) {
        console.error('Error editing collaboration:', error);
        alert('Failed to edit collaboration. Please try again.');
    }
}

async function deleteCollab(collabId) {
    if (!confirm('Are you sure you want to delete this collaboration?')) {
        return;
    }
    
    try {
        const response = await API.Collab.deleteCollabPost(collabId);
        if (response.success) {
            alert('Collaboration deleted successfully!');
            loadCollabPosts();
        } else {
            alert('Failed to delete collaboration: ' + response.message);
        }
    } catch (error) {
        console.error('Error deleting collaboration:', error);
        alert('Failed to delete collaboration. Please try again.');
    }
}

// Resources Edit/Delete
async function editResource(resourceId) {
    try {
        const response = await API.Resources.getResources();
        const resource = response.find(r => r.id === resourceId);
        
        if (!resource) {
            alert('Resource not found');
            return;
        }
        
        const title = prompt('Edit Title:', resource.title);
        if (title === null) return; // User cancelled
        
        const description = prompt('Edit Description:', resource.description);
        if (description === null) return; // User cancelled
        
        const url = prompt('Edit URL:', resource.url);
        if (url === null) return; // User cancelled
        
        if (!title.trim() || !description.trim() || !url.trim()) {
            alert('Title, description, and URL are required');
            return;
        }
        
        const updateResponse = await API.Resources.updateResource(
            resourceId, 
            title.trim(), 
            description.trim(), 
            url.trim()
        );
        
        if (updateResponse.success) {
            alert('Resource updated successfully!');
            loadResources();
        } else {
            alert('Failed to update resource: ' + updateResponse.message);
        }
    } catch (error) {
        console.error('Error editing resource:', error);
        alert('Failed to edit resource. Please try again.');
    }
}

async function deleteResource(resourceId) {
    if (!confirm('Are you sure you want to delete this resource?')) {
        return;
    }
    
    try {
        const response = await API.Resources.deleteResource(resourceId);
        if (response.success) {
            alert('Resource deleted successfully!');
            loadResources();
        } else {
            alert('Failed to delete resource: ' + response.message);
        }
    } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource. Please try again.');
    }
}