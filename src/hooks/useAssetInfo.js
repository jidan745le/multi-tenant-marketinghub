import { useEffect, useState } from 'react';
import CookieService from '../utils/cookieService';

const GRAPHQL_ASSETS_URL = '/apis/kendo/assets';
const API_KEY = '7ce45a85b23aa742131a94d4431e22fe';

/**
 * Build GraphQL query for fetching single asset by ID
 * @param {number|string} assetId - Asset ID
 * @returns {string} GraphQL query string
 */
const buildAssetQuery = (assetId) => {
    return `{
  getAsset(id: ${assetId}) {
    id
    filename
    fullpath
    assetThumb: fullpath(thumbnail: "content", format: "webp")
    type
    mimetype
    creationDate
    modificationDate
    dimensions {
      width
      height
    }
    metadata {
      data
      name
      type
      language
    }
    filesize
  }
}`;
};

/**
 * Extract metadata value by name
 * @param {Array} metadata - Metadata array
 * @param {string} fieldName - Field name to search for
 * @returns {string} Field value or empty string
 */
const getMetadataValue = (metadata, fieldName) => {
    if (!metadata || !Array.isArray(metadata)) return '';
    const field = metadata.find(item => item.name === fieldName);
    return field?.data || '';
};

/**
 * Parse metadata to extract language list
 * @param {Array} metadata - Metadata array
 * @returns {Array<string>} Array of languages
 */
const parseLanguages = (metadata) => {
    // Try Document, Video, and Media prefixes
    const languageValue = getMetadataValue(metadata, 'Document Language') || 
                         getMetadataValue(metadata, 'Video Language') ||
                         getMetadataValue(metadata, 'Media Language');
    if (!languageValue) return [];

    // Split by comma and trim whitespace
    return languageValue.split(',').map(lang => lang.trim()).filter(Boolean);
};

/**
 * Parse metadata to extract tags
 * @param {Array} metadata - Metadata array
 * @returns {Array<string>} Array of tags
 */
const parseTags = (metadata) => {
    // Try Document, Video, and Media prefixes
    const tagsValue = getMetadataValue(metadata, 'Document Key Words') || 
                     getMetadataValue(metadata, 'Video Key Words') ||
                     getMetadataValue(metadata, 'Media Key Words');
    if (!tagsValue) return [];

    // Split by semicolon or comma and trim whitespace
    return tagsValue.split(/[;,]/).map(tag => tag.trim()).filter(Boolean);
};

/**
 * Parse metadata to extract product IDs
 * @param {Array} metadata - Metadata array
 * @returns {Array<string>} Array of product IDs
 */
const parseProductIds = (metadata) => {
    // Try Document, Video, and Media prefixes
    const productIdsValue = getMetadataValue(metadata, 'Document Product IDs') || 
                           getMetadataValue(metadata, 'Video Product IDs') ||
                           getMetadataValue(metadata, 'Media Product IDs');
    if (!productIdsValue) return [];

    // Split by semicolon or comma and trim whitespace
    return productIdsValue.split(/[;,]/).map(id => id.trim()).filter(Boolean);
};

/**
 * Parse metadata to extract approval status list
 * @param {Array} metadata - Metadata array
 * @returns {Array<string>} Array of approval statuses
 */
const parseApprovalStatus = (metadata) => {
    // Try Document, Video, and Media prefixes
    const statusValue = getMetadataValue(metadata, 'Document Approval Status') || 
                       getMetadataValue(metadata, 'Video Approval Status') ||
                       getMetadataValue(metadata, 'Media Approval Status');
    if (!statusValue) return [];

    // Split by semicolon or comma and trim whitespace
    return statusValue.split(/[;,]/).map(status => status.trim()).filter(Boolean);
};

/**
 * Format file size to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const  formatFileSize =(bytes)=> {
    if (bytes == null || bytes === 0) return '';
    const mb = bytes / 1_000_000; // 十进制：1 MB = 1,000,000 bytes
    // console.log('formatFileSize', bytes, mb.toFixed(2));

    return `${mb.toFixed(2)} MB`;
  }

/**
 * Format date to MM/DD/YYYY HH:mm:ss
 * @param {number|string} dateInput - Unix timestamp (number) or ISO date string
 * @returns {string} Formatted date string
 */
const formatDate = (dateInput) => {
    if (!dateInput) return '';

    // Handle both Unix timestamp and ISO string
    let date;
    if (typeof dateInput === 'number') {
        // Unix timestamp in seconds
        date = new Date(dateInput * 1000);
    } else if (typeof dateInput === 'string') {
        // ISO date string
        date = new Date(dateInput);
    } else {
        return '';
    }

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};

/**
 * Detect asset category based on mimetype and type
 * @param {string} mimetype - MIME type
 * @param {string} type - Asset type
 * @returns {string} Category: 'video', 'document', or 'media'
 */
const detectAssetCategory = (mimetype, type) => {
    // Check mimetype first
    if (mimetype) {
        if (mimetype.startsWith('video/')) return 'video';
        if (mimetype.startsWith('application/') || mimetype.startsWith('text/')) return 'document';
        if (mimetype.startsWith('image/')) return 'media';
    }
    
    // Check type field
    if (type) {
        const lowerType = type.toLowerCase();
        if (lowerType === 'video') return 'video';
        if (lowerType === 'document' || lowerType === 'pdf') return 'document';
        if (lowerType === 'image' || lowerType === 'media') return 'media';
    }
    
    // Default to media
    return 'media';
};

/**
 * Get media type based on asset category
 * @param {Array} metadata - Metadata array
 * @param {string} category - Asset category ('video', 'document', 'media')
 * @returns {string} Media type value
 */
const getMediaTypeByCategory = (metadata, category) => {
    if (category === 'document') {
        // Document: Try Document Type first, then Media Type
        return getMetadataValue(metadata, 'Document Type') || 
               getMetadataValue(metadata, 'Media Type');
    } else if (category === 'video') {
        // Video: Try Video Type first, then Media Type
        return getMetadataValue(metadata, 'Video Type') || 
               getMetadataValue(metadata, 'Media Type');
    } else {
        // Media/Image: Use Media Type
        return getMetadataValue(metadata, 'Media Type');
    }
};

/**
 * Transform GraphQL asset response to structured data
 * @param {Object} assetData - Raw GraphQL response
 * @returns {Object} Structured asset information
 */
const transformAssetData = (assetData) => {
    if (!assetData) return null;

    const { metadata, dimensions, filesize, creationDate, modificationDate, filename, type, mimetype, fullpath, assetThumb } = assetData;

    // Detect asset category
    const category = detectAssetCategory(mimetype, type);
    
    // Get media type based on category
    const mediaType = getMediaTypeByCategory(metadata, category);

    return {
        // Basic info
        id: assetData.id,
        name: filename,
        fullpath: fullpath,
        thumbnail: assetThumb,
        type: type,
        mimetype: mimetype,
        category: category, // Add category for reference

        // Metadata fields - Try both Document and Media prefixes
        mediaType: mediaType,
        usage: getMetadataValue(metadata, 'Document Usage') || 
              getMetadataValue(metadata, 'Video Usage') ||
              getMetadataValue(metadata, 'Media Usage') || 
              'Internal', // Default to Internal if not specified
        language: getMetadataValue(metadata, 'Document Language') || 
                 getMetadataValue(metadata, 'Video Language') ||
                 getMetadataValue(metadata, 'Media Language'),
        languages: parseLanguages(metadata),
        tags: parseTags(metadata),
        productIds: parseProductIds(metadata),
        productIdsString: getMetadataValue(metadata, 'Document Product IDs') || 
                         getMetadataValue(metadata, 'Video Product IDs') ||
                         getMetadataValue(metadata, 'Media Product IDs'), // Original string format
        approvalStatus: parseApprovalStatus(metadata),
        approvalStatusString: getMetadataValue(metadata, 'Document Approval Status') || 
                            getMetadataValue(metadata, 'Video Approval Status') ||
                            getMetadataValue(metadata, 'Media Approval Status'), // Original string format

        // Automatic/Technical fields
        creationDate: formatDate(creationDate),
        creationDateRaw: creationDate,
        changedOn: formatDate(modificationDate), // Alias for modificationDate
        width: dimensions?.width || 0,
        height: dimensions?.height || 0,
        fileSize: formatFileSize(filesize),
        fileSizeBytes: filesize,

        // Raw data (for advanced usage)
        raw: assetData
    };
};

/**
 * Custom hook to fetch asset information by ID
 * @param {number|string} assetId - Asset ID to fetch
 * @param {Object} options - Hook options
 * @returns {Object} { data, loading, error, refetch }
 */
const useAssetInfo = (assetId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAsset = async (id) => {
        console.log('useAssetInfo - Starting to fetch asset with ID:', id);

        if (!id) {
            console.warn('useAssetInfo - Asset ID is required');
            setError('Asset ID is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const query = buildAssetQuery(id);
            const token = CookieService.getToken();

            const response = await fetch(GRAPHQL_ASSETS_URL, {
                method: 'POST',
                headers: {
                    'Pragma': 'no-cache',
                    'X-API-Key': API_KEY,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    operationName: null,
                    variables: {},
                    query: query
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Check for GraphQL errors
            if (result.errors) {
                throw new Error(`GraphQL error: ${result.errors.map(e => e.message).join(', ')}`);
            }

            const assetData = result.data?.getAsset;

            if (!assetData) {
                throw new Error('Asset not found');
            }

            const transformedData = transformAssetData(assetData);
            console.log('useAssetInfo - Asset data fetched successfully:', {
                rawData: assetData,
                transformedData: transformedData
            });
            setData(transformedData);
        } catch (err) {
            console.error('useAssetInfo - Error fetching asset:', err.message);
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (assetId) {
            fetchAsset(assetId);
        }
    }, [assetId]);

    const refetch = () => {
        if (assetId) {
            fetchAsset(assetId);
        }
    };

    return {
        data,
        loading,
        error,
        refetch
    };
};

export default useAssetInfo;

