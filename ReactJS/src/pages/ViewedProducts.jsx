import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message, Empty, Pagination, Button } from 'antd';
import { EyeOutlined, HeartOutlined, ShoppingCartOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getViewedProductsApi } from '../utils/api';
import { useAuth } from '../components/context/auth.context';

const ViewedProducts = () => {
    const { auth } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchViewedProducts();
        }
    }, [auth.isAuthenticated, pagination.current]);

    const fetchViewedProducts = async () => {
        try {
            setLoading(true);
            const response = await getViewedProductsApi(pagination.current, pagination.pageSize);
            
            if (response.data.success) {
                setProducts(response.data.data);
                // Note: API should return pagination info
                setPagination(prev => ({ ...prev, total: response.data.length }));
            }
        } catch (error) {
            message.error('Không thể tải lịch sử xem');
            console.error('Error fetching viewed products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (product) => {
        window.location.href = `/product/${product._id}`;
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current: page }));
    };

    if (!auth.isAuthenticated) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Card>
                    <Empty 
                        description="Vui lòng đăng nhập để xem lịch sử xem sản phẩm"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div style={{ padding: '20px' }}>
                <Card>
                    <Empty 
                        description="Bạn chưa xem sản phẩm nào"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Card title="Sản phẩm đã xem">
                <Row gutter={[16, 16]}>
                    {products.map(product => (
                        <Col xs={12} sm={8} md={6} lg={4} key={product._id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={product.name}
                                        src={product.image || '/placeholder-product.jpg'}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                }
                                actions={[
                                    <Button 
                                        type="text" 
                                        icon={<EyeOutlined />}
                                        onClick={() => handleProductClick(product)}
                                    >
                                        Xem lại
                                    </Button>,
                                    <Button 
                                        type="text" 
                                        icon={<HeartOutlined />}
                                    >
                                        Yêu thích
                                    </Button>,
                                    <Button 
                                        type="text" 
                                        icon={<ShoppingCartOutlined />}
                                    >
                                        Mua
                                    </Button>
                                ]}
                            >
                                <Card.Meta
                                    title={
                                        <div style={{ 
                                            fontSize: '14px', 
                                            height: '40px', 
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {product.name}
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <div style={{ 
                                                fontSize: '16px', 
                                                fontWeight: 'bold', 
                                                color: '#ff4d4f',
                                                marginBottom: '8px'
                                            }}>
                                                {product.price?.toLocaleString('vi-VN')} VNĐ
                                            </div>
                                            
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                fontSize: '12px',
                                                color: '#666',
                                                marginBottom: '4px'
                                            }}>
                                                <span>
                                                    <EyeOutlined /> {product.viewCount || 0}
                                                </span>
                                                <span>
                                                    <HeartOutlined /> {product.favoriteCount || 0}
                                                </span>
                                                <span>
                                                    <ShoppingCartOutlined /> {product.purchaseCount || 0}
                                                </span>
                                            </div>
                                            
                                            <div style={{ 
                                                fontSize: '11px', 
                                                color: '#999',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <ClockCircleOutlined style={{ marginRight: '4px' }} />
                                                Đã xem gần đây
                                            </div>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Pagination */}
                {pagination.total > pagination.pageSize && (
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ViewedProducts;
