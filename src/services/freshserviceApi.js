// Freshservice API Service
// Documentation: https://api.freshservice.com/v2

const FRESHSERVICE_CONFIG = {
    domain: 'viewsonic-viewsonic-fs-sandbox.freshservice.com',
    apiKey: 'ybeePbt84yqZD2Ai6b83',
};

// Create Base64 encoded auth header
const getAuthHeader = () => {
    const credentials = btoa(`${FRESHSERVICE_CONFIG.apiKey}:X`);
    return `Basic ${credentials}`;
};

// Base fetch function with error handling
const fetchFromFreshservice = async (endpoint, options = {}) => {
    const url = `https://${FRESHSERVICE_CONFIG.domain}/api/v2${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
};

// Fetch Purchase Orders (for invoice data)
export const fetchPurchaseOrders = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/purchase_orders${queryString ? `?${queryString}` : ''}`;

    try {
        const data = await fetchFromFreshservice(endpoint);
        return {
            success: true,
            data: data.purchase_orders || [],
            meta: data.meta || {},
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: [],
        };
    }
};

// Fetch a single Purchase Order by ID
export const fetchPurchaseOrderById = async (id) => {
    try {
        const data = await fetchFromFreshservice(`/purchase_orders/${id}`);
        return {
            success: true,
            data: data.purchase_order,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: null,
        };
    }
};

// Fetch Tickets (alternative source for invoice-related data)
export const fetchTickets = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/tickets${queryString ? `?${queryString}` : ''}`;

    try {
        const data = await fetchFromFreshservice(endpoint);
        return {
            success: true,
            data: data.tickets || [],
            meta: data.meta || {},
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: [],
        };
    }
};

// Fetch Assets
export const fetchAssets = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/assets${queryString ? `?${queryString}` : ''}`;

    try {
        const data = await fetchFromFreshservice(endpoint);
        return {
            success: true,
            data: data.assets || [],
            meta: data.meta || {},
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: [],
        };
    }
};

// Fetch Contracts
export const fetchContracts = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/contracts${queryString ? `?${queryString}` : ''}`;

    try {
        const data = await fetchFromFreshservice(endpoint);
        return {
            success: true,
            data: data.contracts || [],
            meta: data.meta || {},
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: [],
        };
    }
};

// Fetch Vendors
export const fetchVendors = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/vendors${queryString ? `?${queryString}` : ''}`;

    try {
        const data = await fetchFromFreshservice(endpoint);
        return {
            success: true,
            data: data.vendors || [],
            meta: data.meta || {},
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: [],
        };
    }
};

// Transform Freshservice Purchase Order to local invoice format
export const transformPurchaseOrderToInvoice = (po) => {
    return {
        id: `PO-${po.id}`,
        freshserviceId: po.id,
        source: 'freshservice',
        userId: null, // Will need to map to local user
        userName: po.vendor_name || 'Unknown Vendor',
        amount: po.total_cost || 0,
        status: mapPurchaseOrderStatus(po.status),
        dueDate: po.expected_delivery_date || null,
        issueDate: po.created_at ? po.created_at.split('T')[0] : null,
        items: (po.po_items || []).map(item => ({
            description: item.name || item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unit_cost || 0,
        })),
        rawData: po, // Keep original data for reference
    };
};

// Map Freshservice PO status to local status
const mapPurchaseOrderStatus = (status) => {
    const statusMap = {
        1: 'Pending',      // Open
        2: 'Pending',      // Requested
        3: 'Pending',      // Ordered
        4: 'Paid',         // Received
        5: 'Paid',         // Partially Received
        6: 'Cancelled',    // Cancelled
    };
    return statusMap[status] || 'Pending';
};

// Test API connection
export const testConnection = async () => {
    try {
        // Try to fetch tickets as a simple connection test
        const response = await fetchFromFreshservice('/tickets?per_page=1');
        return {
            success: true,
            message: 'Connection successful',
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

// Update configuration (for runtime config changes)
export const updateConfig = (newConfig) => {
    if (newConfig.domain) FRESHSERVICE_CONFIG.domain = newConfig.domain;
    if (newConfig.apiKey) FRESHSERVICE_CONFIG.apiKey = newConfig.apiKey;
};

export default {
    fetchPurchaseOrders,
    fetchPurchaseOrderById,
    fetchTickets,
    fetchAssets,
    fetchContracts,
    fetchVendors,
    transformPurchaseOrderToInvoice,
    testConnection,
    updateConfig,
};
