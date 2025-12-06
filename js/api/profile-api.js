//import api from "./axios.js"; //uncomment

// ============================================
// PROFILE OPERATIONS
// ============================================

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise} - User profile data
 */
function getUserProfile(userId) {
    return api.get(`/users/${userId}`);
}

/**
 * Update user profile
 * @param {Object} data - Profile data to update
 * @returns {Promise} - Updated profile
 */
function updateProfile(data) {
    return api.put("/users/me", data);
}

/**
 * Delete user profile
 * @returns {Promise} - Delete confirmation
 */
function deleteProfile() {
    return api.delete("/users/me");
}

/**
 * Upload profile photo
 * @param {File} file - Image file
 * @returns {Promise} - Upload response with URL
 */
function uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post('/users/me/photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * Upload banner photo
 * @param {File} file - Image file
 * @returns {Promise} - Upload response with URL
 */
function uploadBannerPhoto(file) {
    const formData = new FormData();
    formData.append('banner', file);
    return api.post('/users/me/banner', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// ============================================
// EDUCATION OPERATIONS
// ============================================

/**
 * Get all education entries
 * @returns {Promise} - Array of education entries
 */
function getEducation() {
    return api.get('/users/me/education');
}

/**
 * Create education entry
 * @param {Object} data - Education data
 * @returns {Promise} - Created education entry
 */
function createEducation(data) {
    return { data: { success: true, data: null } }//api.post('/users/me/education', data);
}

/**
 * Update education entry
 * @param {string} id - Education ID
 * @param {Object} data - Updated data
 * @returns {Promise} - Updated education entry
 */
function updateEducation(id, data) {
    return api.put(`/users/me/education/${id}`, data);
}

/**
 * Delete education entry
 * @param {string} id - Education ID
 * @returns {Promise} - Delete confirmation
 */
function deleteEducation(id) {
    return api.delete(`/users/me/education/${id}`);
}

// ============================================
// LICENSE/CERTIFICATE OPERATIONS
// ============================================

/**
 * Get all licenses/certificates
 * @returns {Promise} - Array of licenses
 */
function getLicenses() {
    return api.get('/users/me/licenses');
}

/**
 * Create license/certificate entry
 * @param {Object} data - License data
 * @returns {Promise} - Created license entry
 */
function createLicense(data) {
    return api.post('/users/me/licenses', data);
}

/**
 * Update license/certificate entry
 * @param {string} id - License ID
 * @param {Object} data - Updated data
 * @returns {Promise} - Updated license entry
 */
function updateLicense(id, data) {
    return api.put(`/users/me/licenses/${id}`, data);
}

/**
 * Delete license/certificate entry
 * @param {string} id - License ID
 * @returns {Promise} - Delete confirmation
 */
function deleteLicense(id) {
    return api.delete(`/users/me/licenses/${id}`);
}

// ============================================
// ANNOUNCEMENT/POST OPERATIONS
// ============================================

/**
 * Get all user announcements
 * @returns {Promise} - Array of announcements
 */
function getAnnouncements() {
    return api.get('/users/me/posts');
}

/**
 * Create announcement/post
 * @param {Object} data - Announcement data
 * @returns {Promise} - Created announcement
 */
function createAnnouncement(data) {
    return api.post('/posts', data);
}

/**
 * Update announcement/post
 * @param {string} id - Announcement ID
 * @param {Object} data - Updated data
 * @returns {Promise} - Updated announcement
 */
function updateAnnouncement(id, data) {
    return api.put(`/posts/${id}`, data);
}

/**
 * Delete announcement/post
 * @param {string} id - Announcement ID
 * @returns {Promise} - Delete confirmation
 */
function deleteAnnouncement(id) {
    return api.delete(`/posts/${id}`);
}

// ============================================
// COMMENT OPERATIONS
// ============================================

/**
 * Get comments for a post
 * @param {string} postId - Post ID
 * @returns {Promise} - Array of comments
 */
function getComments(postId) {
    // Mock data for testing
    const mockComments = {
        data: [
            {
                id: 1,
                text: "Շնորհակալություն տեղեկության համար:",
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                author: {
                    name: "Արմեն Պետրոսյան",
                    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                }
            },
            {
                id: 2,
                text: "CV-ն ուղարկել եմ:",
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
                author: {
                    name: "Անի Գրիգորյան",
                    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                }
            }
        ]
    };

    return mockComments; //api.get(`/posts/${postId}/comments`);
}

/**
 * Create comment on a post
 * @param {string} postId - Post ID
 * @param {Object} commentData - Comment data
 * @returns {Promise} - Created comment
 */

function createComment(postId, commentData) {
    const newComment = {
        data: {
            success: true,
            data: {
                id: postId,
                text: commentData.text,
                createdAt: new Date().toISOString(),
                author: {
                    name: "Գայանե Սարգսյան",
                    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
                }
            }
        }
    }

    return newComment//api.post(`/posts/${postId}/comments`, commentData);
}
/**
 * Update comment
 * @param {string} postId - Post ID
 * @param {string} commentId - Comment ID
 * @param {Object} data - Updated comment data
 * @returns {Promise} - Updated comment
 */
function updateComment(postId, commentId, data) {
    return api.put(`/posts/${postId}/comments/${commentId}`, data);
}

/**
 * Delete comment
 * @param {string} postId - Post ID
 * @param {string} commentId - Comment ID
 * @returns {Promise} - Delete confirmation
 */
function deleteComment(postId, commentId) {
    return api.delete(`/posts/${postId}/comments/${commentId}`);
}
/* uncomment
// Export all functions
export {
    // Profile
    getUserProfile,
    updateProfile,
    deleteProfile,
    uploadProfilePhoto,
    uploadBannerPhoto,
    // Education
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation,
    // Licenses
    getLicenses,
    createLicense,
    updateLicense,
    deleteLicense,
    // Announcements
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    // Comments
    getComments,
    createComment,
    updateComment,
    deleteComment
};
*/