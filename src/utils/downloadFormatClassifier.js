/**
 * Download Format Classification Utility
 * Determines whether files require derivate selection or can be downloaded directly
 */

// Restricted formats that require derivate selection
const restrictedFormats = ['psd', 'jpg', 'png', 'tiff', 'eps', 'ai'];

/**
 * Extract file extension from filename
 * @param {string} filename - File name
 * @returns {string} File extension in lowercase
 */
const getFileExtension = (filename) => {
    if (!filename) return '';
    const match = filename.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : '';
};

/**
 * Extract file extensions from multiple sources (filename, mimetype, etc.)
 * @param {Object} media - Media object
 * @returns {Array<string>} Array of file extensions
 */
const extractFileExtensions = (media) => {
    const extensions = [];

    // Extract from filename
    if (media.filename) {
        const ext = getFileExtension(media.filename);
        if (ext) extensions.push(ext);
    }

    // Extract from name property
    if (media.name && media.name !== media.filename) {
        const ext = getFileExtension(media.name);
        if (ext) extensions.push(ext);
    }

    // Extract from mimetype
    if (media.mimetype) {
        const mimeTypeParts = media.mimetype.split('/');
        if (mimeTypeParts.length > 1) {
            const ext = mimeTypeParts[1].toLowerCase();
            // Map common MIME types to extensions
            const mimeMap = {
                'jpeg': 'jpg',
                'svg+xml': 'svg',
                'x-photoshop': 'psd',
                'postscript': 'eps'
            };
            extensions.push(mimeMap[ext] || ext);
        }
    }

    // Extract from fullpath/downloadUrl
    if (media.fullpath) {
        const ext = getFileExtension(media.fullpath);
        if (ext) extensions.push(ext);
    }

    if (media.downloadUrl) {
        const ext = getFileExtension(media.downloadUrl);
        if (ext) extensions.push(ext);
    }

    // Remove duplicates and return
    return [...new Set(extensions)];
};

/**
 * Check if media contains any restricted format
 * @param {Object|Array} media - Single media object or array of media objects
 * @returns {boolean} True if any media contains restricted format
 */
export const hasRestrictedFormat = (media) => {
    const mediaArray = Array.isArray(media) ? media : [media];

    for (const item of mediaArray) {
        const extensions = extractFileExtensions(item);

        // Check if any extension is in restricted formats
        const hasRestricted = extensions.some(ext =>
            restrictedFormats.includes(ext?.toLowerCase())
        );

        if (hasRestricted) {
            console.log(`🔒 Restricted format detected for ${item.filename || item.name}:`, {
                extensions,
                restrictedFound: extensions.filter(ext => restrictedFormats.includes(ext?.toLowerCase()))
            });
            return true;
        }
    }

    return false;
};

/**
 * Check if all media can be downloaded directly (no restricted formats)
 * @param {Object|Array} media - Single media object or array of media objects
 * @returns {boolean} True if all media can be downloaded directly
 */
export const canDownloadDirectly = (media) => {
    const mediaArray = Array.isArray(media) ? media : [media];

    // All media must be non-restricted for direct download
    const allNonRestricted = mediaArray.every(item => {
        const extensions = extractFileExtensions(item);

        // If no extensions found, SHOW DIALOG for safety (cannot determine format)
        if (extensions.length === 0) {
            console.log(`⚠️ No file extensions found for ${item.filename || item.name || item.id}, showing dialog for safety`);
            return false; // Changed to false - show dialog when format is unknown
        }

        // Check that NONE of the extensions are restricted
        const isNonRestricted = extensions.every(ext =>
            !restrictedFormats.includes(ext?.toLowerCase())
        );

        if (isNonRestricted) {
            console.log(`✅ Non-restricted format detected for ${item.filename || item.name}:`, {
                extensions,
                canDownloadDirectly: true
            });
        } else {
            console.log(`🔒 Restricted format detected for ${item.filename || item.name}:`, {
                extensions,
                restrictedExtensions: extensions.filter(ext => restrictedFormats.includes(ext?.toLowerCase()))
            });
        }

        return isNonRestricted;
    });

    return allNonRestricted;
};

/**
 * Get format classification summary for media
 * @param {Object|Array} media - Single media object or array of media objects
 * @returns {Object} Classification summary
 */
export const getFormatClassification = (media) => {
    const mediaArray = Array.isArray(media) ? media : [media];
    const classifications = mediaArray.map(item => {
        const extensions = extractFileExtensions(item);
        const restricted = extensions.filter(ext => restrictedFormats.includes(ext?.toLowerCase()));
        const nonRestricted = extensions.filter(ext => !restrictedFormats.includes(ext?.toLowerCase()));

        return {
            filename: item.filename || item.name,
            extensions,
            restricted,
            nonRestricted,
            requiresDerivateSelection: restricted.length > 0
        };
    });

    const hasAnyRestricted = classifications.some(c => c.requiresDerivateSelection);
    const allCanDownloadDirectly = classifications.every(c => !c.requiresDerivateSelection);

    return {
        mediaCount: mediaArray.length,
        hasRestrictedFormat: hasAnyRestricted,
        canDownloadDirectly: allCanDownloadDirectly,
        classifications,
        restrictedFormats,
        recommendedAction: hasAnyRestricted ? 'showDerivateDialog' : 'directDownload'
    };
};

export default {
    hasRestrictedFormat,
    canDownloadDirectly,
    getFormatClassification,
    restrictedFormats
};
