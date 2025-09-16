import React, { useState, useEffect } from 'react';
import { Card, Button, Rate, Tag, Statistic, Row, Col, message, Spin } from 'antd';
import { HeartOutlined, HeartFilled, EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getProductByIdApi, toggleFavoriteApi, getProductStatsApi } from '../../utils/api';
import { useAuth } from '../../components/context/auth.context';
import ProductReviews from './ProductReviews';
import SimilarProducts from './SimilarProducts';

const ProductDetail = () => {
    const { id: productId } = useParams();
    const { auth } = useAuth();
    const [product, setProduct] = useState(null);
    const [stats, setStats] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const [productResponse, statsResponse] = await Promise.all([
                getProductByIdApi(productId),
                getProductStatsApi(productId)
            ]);

            if (productResponse.success) {
                setProduct(productResponse.data.product);
                setStats(statsResponse.success ? statsResponse.data.data : null);
            }
        } catch (error) {
            message.error('Không thể tải thông tin sản phẩm');
            console.error('Error fetching product detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm vào yêu thích');
            return;
        }

        try {
            setFavoriteLoading(true);
            const response = await toggleFavoriteApi(productId);
            
            if (response.data.success) {
                setIsFavorite(response.data.isFavorite);
                message.success(response.data.message);
                // Cập nhật favorite count
                if (product) {
                    setProduct(prev => ({
                        ...prev,
                        favoriteCount: response.data.isFavorite 
                            ? prev.favoriteCount + 1 
                            : prev.favoriteCount - 1
                    }));
                }
            }
        } catch (error) {
            message.error('Không thể cập nhật yêu thích');
            console.error('Error toggling favorite:', error);
        } finally {
            setFavoriteLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Sản phẩm không tồn tại</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={[24, 24]}>
                {/* Product Image */}
                <Col xs={24} md={12}>
                    <Card>
                        <img 
                            src={product.image || '/placeholder-product.jpg'} 
                            alt={product.name}
                            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                        />
                    </Card>
                </Col>

                {/* Product Info */}
                <Col xs={24} md={12}>
                    <Card>
                        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
                            {product.name}
                        </h1>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <Rate 
                                disabled 
                                value={product.averageRating || 0} 
                                style={{ marginRight: '8px' }}
                            />
                            <span>({product.reviewCount || 0} đánh giá)</span>
                        </div>

                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff4d4f', marginBottom: '16px' }}>
                            {product.price?.toLocaleString('vi-VN')} VNĐ
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <Tag color="blue">{product.category}</Tag>
                            {product.brand && <Tag color="green">{product.brand}</Tag>}
                            {product.tags?.map(tag => (
                                <Tag key={tag} color="purple">{tag}</Tag>
                            ))}
                        </div>

                        {product.description && (
                            <div style={{ marginBottom: '24px' }}>
                                <h3>Mô tả sản phẩm</h3>
                                <p>{product.description}</p>
                            </div>
                        )}

                        {/* Stats */}
                        {stats && (
                            <Row gutter={16} style={{ marginBottom: '24px' }}>
                                <Col span={6}>
                                    <Statistic 
                                        title="Lượt xem" 
                                        value={stats.viewCount} 
                                        prefix={<EyeOutlined />}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic 
                                        title="Yêu thích" 
                                        value={stats.favoriteCount} 
                                        prefix={<HeartOutlined />}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic 
                                        title="Đã bán" 
                                        value={stats.purchaseCount} 
                                        prefix={<ShoppingCartOutlined />}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Statistic 
                                        title="Đánh giá" 
                                        value={stats.reviewCount} 
                                    />
                                </Col>
                            </Row>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Button 
                                type="primary" 
                                size="large"
                                icon={<ShoppingCartOutlined />}
                                style={{ flex: 1 }}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                            
                            <Button 
                                size="large"
                                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                loading={favoriteLoading}
                                onClick={handleToggleFavorite}
                                style={{ 
                                    color: isFavorite ? '#ff4d4f' : undefined,
                                    borderColor: isFavorite ? '#ff4d4f' : undefined
                                }}
                            >
                                {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Reviews Section */}
            <div style={{ marginTop: '24px' }}>
                <ProductReviews productId={productId} />
            </div>

            {/* Similar Products */}
            <div style={{ marginTop: '24px' }}>
                <SimilarProducts productId={productId} />
            </div>
        </div>
    );
};

export default ProductDetail;
