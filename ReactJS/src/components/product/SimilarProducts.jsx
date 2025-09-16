import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import { EyeOutlined, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getProductByIdApi } from '../../utils/api';

const SimilarProducts = ({ productId }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productId) {
            fetchSimilarProducts();
        }
    }, [productId]);

    const fetchSimilarProducts = async () => {
        try {
            setLoading(true);
            const response = await getProductByIdApi(productId);
            
            if (response.data.success) {
                setSimilarProducts(response.data.data.similarProducts || []);
            }
        } catch (error) {
            console.error('Error fetching similar products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (product) => {
        // Navigate to product detail page
        window.location.href = `/product/${product._id}`;
    };

    if (loading) {
        return (
            <Card title="Sản phẩm tương tự">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                </div>
            </Card>
        );
    }

    if (similarProducts.length === 0) {
        return null;
    }

    return (
        <Card title="Sản phẩm tương tự">
            <Row gutter={[16, 16]}>
                {similarProducts.map(product => (
                    <Col xs={12} sm={8} md={6} lg={4} key={product._id}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt={product.name}
                                    src={product.image || '/placeholder-product.jpg'}
                                    style={{ height: '150px', objectFit: 'cover' }}
                                />
                            }
                            onClick={() => handleProductClick(product)}
                            style={{ cursor: 'pointer' }}
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
                                                <HeartOutlined /> {product.favoriteCount || 0}
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
        </Card>
    );
};

export default SimilarProducts;
