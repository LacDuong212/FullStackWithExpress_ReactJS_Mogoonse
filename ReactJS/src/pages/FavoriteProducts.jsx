import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message, Empty, Pagination, Button } from 'antd';
import { HeartFilled, EyeOutlined, ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons';
import { getFavoriteProductsApi, toggleFavoriteApi } from '../utils/api';
import { useAuth } from '../components/context/auth.context';

const FavoriteProducts = () => {
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
            fetchFavoriteProducts();
        }
    }, [auth.isAuthenticated, pagination.current]);

    const fetchFavoriteProducts = async () => {
        try {
            setLoading(true);
            const response = await getFavoriteProductsApi(pagination.current, pagination.pageSize);
            
            if (response.data.success) {
                setProducts(response.data.data);
                // Note: API should return pagination info
                setPagination(prev => ({ ...prev, total: response.data.data.length }));
            }
        } catch (error) {
            message.error('Không thể tải danh sách yêu thích');
            console.error('Error fetching favorite products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (productId) => {
        try {
            const response = await toggleFavoriteApi(productId);
            
            if (response.data.success && !response.data.isFavorite) {
                message.success('Đã xóa khỏi danh sách yêu thích');
                setProducts(prev => prev.filter(p => p._id !== productId));
            }
        } catch (error) {
            message.error('Không thể xóa khỏi yêu thích');
            console.error('Error removing favorite:', error);
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
                        description="Vui lòng đăng nhập để xem danh sách yêu thích"
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
                        description="Bạn chưa có sản phẩm yêu thích nào"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Card title="Sản phẩm yêu thích">
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
                                        Xem
                                    </Button>,
                                    <Button 
                                        type="text" 
                                        icon={<ShoppingCartOutlined />}
                                    >
                                        Mua
                                    </Button>,
                                    <Button 
                                        type="text" 
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveFavorite(product._id)}
                                    >
                                        Xóa
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
                                                color: '#666'
                                            }}>
                                                <span>
                                                    <EyeOutlined /> {product.viewCount || 0}
                                                </span>
                                                <span>
                                                    <HeartFilled style={{ color: '#ff4d4f' }} /> {product.favoriteCount || 0}
                                                </span>
                                                <span>
                                                    <ShoppingCartOutlined /> {product.purchaseCount || 0}
                                                </span>
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

export default FavoriteProducts;
