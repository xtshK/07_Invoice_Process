import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    RefreshCw,
    Download,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowLeft,
    CloudDownload,
    Database,
    FileText,
    Package,
    Settings,
} from 'lucide-react';
import {
    fetchPurchaseOrders,
    fetchTickets,
    fetchAssets,
    testConnection,
    transformPurchaseOrderToInvoice,
} from '../services/freshserviceApi';

const FreshserviceImport = () => {
    const navigate = useNavigate();
    const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, testing, connected, failed
    const [activeTab, setActiveTab] = useState('purchase_orders');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [importedCount, setImportedCount] = useState(0);

    // Test connection on mount
    useEffect(() => {
        handleTestConnection();
    }, []);

    const handleTestConnection = async () => {
        setConnectionStatus('testing');
        const result = await testConnection();
        setConnectionStatus(result.success ? 'connected' : 'failed');
        if (!result.success) {
            setError(result.message);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        let result;
        switch (activeTab) {
            case 'purchase_orders':
                result = await fetchPurchaseOrders();
                break;
            case 'tickets':
                result = await fetchTickets();
                break;
            case 'assets':
                result = await fetchAssets();
                break;
            default:
                result = { success: false, error: 'Unknown data type', data: [] };
        }

        setLoading(false);

        if (result.success) {
            setData(result.data);
            setSelectedItems([]);
        } else {
            setError(result.error);
            setData([]);
        }
    };

    useEffect(() => {
        if (connectionStatus === 'connected') {
            fetchData();
        }
    }, [activeTab, connectionStatus]);

    const handleSelectAll = () => {
        if (selectedItems.length === data.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(data.map(item => item.id));
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleImportSelected = () => {
        // Transform and save to localStorage for now
        const itemsToImport = data.filter(item => selectedItems.includes(item.id));
        const transformedItems = itemsToImport.map(item => {
            if (activeTab === 'purchase_orders') {
                return transformPurchaseOrderToInvoice(item);
            }
            // For other types, create a basic invoice structure
            return {
                id: `FS-${activeTab.toUpperCase()}-${item.id}`,
                freshserviceId: item.id,
                source: 'freshservice',
                type: activeTab,
                rawData: item,
            };
        });

        // Get existing imported items
        const existing = JSON.parse(localStorage.getItem('freshserviceImports') || '[]');
        const updated = [...existing, ...transformedItems];
        localStorage.setItem('freshserviceImports', JSON.stringify(updated));

        setImportedCount(prev => prev + transformedItems.length);
        setSelectedItems([]);
        alert(`Successfully imported ${transformedItems.length} items!`);
    };

    const getStatusBadge = () => {
        switch (connectionStatus) {
            case 'testing':
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F59E0B' }}>
                        <RefreshCw size={16} className="spin" />
                        Testing connection...
                    </span>
                );
            case 'connected':
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22C55E' }}>
                        <CheckCircle size={16} />
                        Connected to Freshservice
                    </span>
                );
            case 'failed':
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444' }}>
                        <XCircle size={16} />
                        Connection failed
                    </span>
                );
            default:
                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9BA7B6' }}>
                        <AlertCircle size={16} />
                        Not connected
                    </span>
                );
        }
    };

    const tabs = [
        { id: 'purchase_orders', label: 'Purchase Orders', icon: FileText },
        { id: 'tickets', label: 'Tickets', icon: Package },
        { id: 'assets', label: 'Assets', icon: Database },
    ];

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString();
    };

    const renderDataTable = () => {
        if (loading) {
            return (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9BA7B6' }}>
                    <RefreshCw size={32} className="spin" style={{ marginBottom: '1rem' }} />
                    <p>Loading data from Freshservice...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#EF4444' }}>
                    <XCircle size={32} style={{ marginBottom: '1rem' }} />
                    <p>{error}</p>
                    <button
                        onClick={fetchData}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: '#47C1BF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        Retry
                    </button>
                </div>
            );
        }

        if (data.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9BA7B6' }}>
                    <CloudDownload size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No {activeTab.replace('_', ' ')} found in Freshservice</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Create some data in Freshservice and refresh to see it here.
                    </p>
                </div>
            );
        }

        return (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === data.length && data.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            {activeTab === 'purchase_orders' && (
                                <>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>PO ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Vendor</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Total Cost</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Created</th>
                                </>
                            )}
                            {activeTab === 'tickets' && (
                                <>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Subject</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Priority</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Created</th>
                                </>
                            )}
                            {activeTab === 'assets' && (
                                <>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Asset Tag</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Type</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Impact</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Created</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr
                                key={item.id}
                                style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    background: selectedItems.includes(item.id) ? 'rgba(71, 193, 191, 0.1)' : 'transparent',
                                }}
                            >
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)}
                                    />
                                </td>
                                {activeTab === 'purchase_orders' && (
                                    <>
                                        <td style={{ padding: '1rem' }}>#{item.id}</td>
                                        <td style={{ padding: '1rem' }}>{item.vendor_name || '-'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                background: 'rgba(71, 193, 191, 0.2)',
                                                color: '#47C1BF',
                                            }}>
                                                {item.status_name || `Status ${item.status}`}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            ${(item.total_cost || 0).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '1rem' }}>{formatDate(item.created_at)}</td>
                                    </>
                                )}
                                {activeTab === 'tickets' && (
                                    <>
                                        <td style={{ padding: '1rem' }}>#{item.id}</td>
                                        <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.subject}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                background: item.status === 5 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: item.status === 5 ? '#22C55E' : '#F59E0B',
                                            }}>
                                                {item.status === 2 ? 'Open' : item.status === 3 ? 'Pending' : item.status === 4 ? 'Resolved' : item.status === 5 ? 'Closed' : `Status ${item.status}`}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {item.priority === 1 ? 'Low' : item.priority === 2 ? 'Medium' : item.priority === 3 ? 'High' : 'Urgent'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>{formatDate(item.created_at)}</td>
                                    </>
                                )}
                                {activeTab === 'assets' && (
                                    <>
                                        <td style={{ padding: '1rem' }}>{item.asset_tag}</td>
                                        <td style={{ padding: '1rem' }}>{item.name}</td>
                                        <td style={{ padding: '1rem' }}>{item.asset_type_id}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                background: 'rgba(139, 92, 246, 0.2)',
                                                color: '#8B5CF6',
                                            }}>
                                                {item.impact || 'low'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{formatDate(item.created_at)}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'none',
                            border: 'none',
                            color: '#9BA7B6',
                            cursor: 'pointer',
                            padding: '0.5rem',
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                            Freshservice Import
                        </h1>
                        <p style={{ color: '#9BA7B6', fontSize: '0.875rem' }}>
                            Import invoices and purchase orders from Freshservice ITSM
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getStatusBadge()}
                    <button
                        onClick={handleTestConnection}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        <Settings size={16} />
                        Reconnect
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(71, 193, 191, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CloudDownload size={24} style={{ color: '#47C1BF' }} />
                        </div>
                        <div>
                            <p style={{ color: '#9BA7B6', fontSize: '0.875rem' }}>Available</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{data.length}</p>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={24} style={{ color: '#8B5CF6' }} />
                        </div>
                        <div>
                            <p style={{ color: '#9BA7B6', fontSize: '0.875rem' }}>Selected</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{selectedItems.length}</p>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Download size={24} style={{ color: '#22C55E' }} />
                        </div>
                        <div>
                            <p style={{ color: '#9BA7B6', fontSize: '0.875rem' }}>Imported</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>{importedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="card">
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem 1.5rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid #47C1BF' : '2px solid transparent',
                                color: activeTab === tab.id ? '#47C1BF' : '#9BA7B6',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab.id ? '600' : '400',
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#9BA7B6', fontSize: '0.875rem' }}>
                        {selectedItems.length > 0 ? `${selectedItems.length} items selected` : `${data.length} items available`}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={fetchData}
                            disabled={connectionStatus !== 'connected'}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: connectionStatus === 'connected' ? 'pointer' : 'not-allowed',
                                opacity: connectionStatus === 'connected' ? 1 : 0.5,
                            }}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                        <button
                            onClick={handleImportSelected}
                            disabled={selectedItems.length === 0}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: selectedItems.length > 0 ? '#47C1BF' : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed',
                                opacity: selectedItems.length > 0 ? 1 : 0.5,
                            }}
                        >
                            <Download size={16} />
                            Import Selected
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                {renderDataTable()}
            </div>

            {/* CSS for spinner animation */}
            <style>{`
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default FreshserviceImport;
