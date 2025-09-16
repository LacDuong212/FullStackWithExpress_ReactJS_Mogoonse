import React, { useState, useEffect } from 'react';
import { Card, Rate, Button, Input, Modal, message, Pagination, Select, Spin, Empty, Row, Col } from 'antd';
import { StarOutlined, LikeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
    getProductReviewsApi, 
    createReviewApi, 
    updateReviewApi, 
    deleteReviewApi, 
    markReviewHelpfulApi 
} from '../../utils/api';
import { useAuth } from '../../components/context/auth.context';

const { TextArea } = Input;
const { Option } = Select;

const ProductReviews = ({ productId }) => {
    const { auth } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingDistribution, setRatingDistribution] = useState({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [sortBy, setSortBy] = useState('newest');
    const [ratingFilter, setRatingFilter] = useState(null);
    
    // Review form states
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId, pagination.current, sortBy, ratingFilter]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await getProductReviewsApi(
                productId, 
                pagination.current, 
                pagination.pageSize, 
                ratingFilter, 
                sortBy
            );

            if (response.data.success) {
                setReviews(response.data.data.reviews);
                setRatingDistribution(response.data.data.ratingDistribution);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.data.pagination.totalReviews
                }));
            }
        } catch (error) {
            message.error('Không thể tải đánh giá');
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReview = async () => {
        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để đánh giá');
            return;
        }

        try {
            const response = await createReviewApi(
                productId, 
                reviewForm.rating, 
                reviewForm.comment
            );

            if (response.data.success) {
                message.success('Đánh giá đã được gửi thành công');
                setReviewModalVisible(false);
                setReviewForm({ rating: 5, comment: '' });
                fetchReviews();
            }
        } catch (error) {
            message.error('Không thể gửi đánh giá');
            console.error('Error creating review:', error);
        }
    };

    const handleUpdateReview = async () => {
        try {
            const response = await updateReviewApi(
                editingReview._id,
                reviewForm.rating,
                reviewForm.comment
            );

            if (response.data.success) {
                message.success('Đánh giá đã được cập nhật');
                setReviewModalVisible(false);
                setEditingReview(null);
                setReviewForm({ rating: 5, comment: '' });
                fetchReviews();
            }
        } catch (error) {
            message.error('Không thể cập nhật đánh giá');
            console.error('Error updating review:', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await deleteReviewApi(reviewId);
            if (response.data.success) {
                message.success('Đánh giá đã được xóa');
                fetchReviews();
            }
        } catch (error) {
            message.error('Không thể xóa đánh giá');
            console.error('Error deleting review:', error);
        }
    };

    const handleMarkHelpful = async (reviewId) => {
        try {
            const response = await markReviewHelpfulApi(reviewId);
            if (response.data.success) {
                message.success('Đã đánh dấu hữu ích');
                fetchReviews();
            }
        } catch (error) {
            message.error('Không thể đánh dấu hữu ích');
            console.error('Error marking helpful:', error);
        }
    };

    const openEditModal = (review) => {
        setEditingReview(review);
        setReviewForm({
            rating: review.rating,
            comment: review.comment
        });
        setReviewModalVisible(true);
    };

    const closeModal = () => {
        setReviewModalVisible(false);
        setEditingReview(null);
        setReviewForm({ rating: 5, comment: '' });
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current: page }));
    };

    const totalReviews = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0);

    return (
        <div>
            <Card title="Đánh giá sản phẩm">
                {/* Rating Summary */}
                <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1890ff' }}>
                                    {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                                </div>
                                <Rate disabled value={reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0} />
                                <div style={{ marginTop: '8px' }}>
                                    {totalReviews} đánh giá
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ width: '20px' }}>{rating}</span>
                                        <StarOutlined style={{ color: '#faad14', margin: '0 8px' }} />
                                        <div style={{ 
                                            flex: 1, 
                                            height: '8px', 
                                            backgroundColor: '#d9d9d9', 
                                            borderRadius: '4px',
                                            margin: '0 8px'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                backgroundColor: '#1890ff',
                                                borderRadius: '4px',
                                                width: `${totalReviews > 0 ? (ratingDistribution[rating] / totalReviews) * 100 : 0}%`
                                            }} />
                                        </div>
                                        <span style={{ width: '30px', textAlign: 'right' }}>
                                            {ratingDistribution[rating] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Filters and Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Select value={sortBy} onChange={setSortBy} style={{ width: 120 }}>
                            <Option value="newest">Mới nhất</Option>
                            <Option value="oldest">Cũ nhất</Option>
                            <Option value="highest">Điểm cao</Option>
                            <Option value="lowest">Điểm thấp</Option>
                            <Option value="helpful">Hữu ích</Option>
                        </Select>
                        
                        <Select value={ratingFilter} onChange={setRatingFilter} placeholder="Lọc theo điểm" allowClear style={{ width: 120 }}>
                            <Option value={5}>5 sao</Option>
                            <Option value={4}>4 sao</Option>
                            <Option value={3}>3 sao</Option>
                            <Option value={2}>2 sao</Option>
                            <Option value={1}>1 sao</Option>
                        </Select>
                    </div>

                    {auth.isAuthenticated && (
                        <Button type="primary" onClick={() => setReviewModalVisible(true)}>
                            Viết đánh giá
                        </Button>
                    )}
                </div>

                {/* Reviews List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin />
                    </div>
                ) : reviews.length === 0 ? (
                    <Empty description="Chưa có đánh giá nào" />
                ) : (
                    <div>
                        {reviews.map(review => (
                            <Card key={review._id} size="small" style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                            <strong style={{ marginRight: '8px' }}>
                                                {review.userId?.name || 'Người dùng'}
                                            </strong>
                                            <Rate disabled value={review.rating} size="small" />
                                            <span style={{ marginLeft: '8px', color: '#666' }}>
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                            {review.isVerifiedPurchase && (
                                                <Tag color="green" size="small" style={{ marginLeft: '8px' }}>
                                                    Đã mua
                                                </Tag>
                                            )}
                                        </div>
                                        <p style={{ margin: 0 }}>{review.comment}</p>
                                        <div style={{ marginTop: '8px' }}>
                                            <Button 
                                                type="text" 
                                                size="small" 
                                                icon={<LikeOutlined />}
                                                onClick={() => handleMarkHelpful(review._id)}
                                            >
                                                Hữu ích ({review.helpfulCount || 0})
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {auth.isAuthenticated && auth.user.id === review.userId?._id && (
                                        <div>
                                            <Button 
                                                type="text" 
                                                size="small" 
                                                icon={<EditOutlined />}
                                                onClick={() => openEditModal(review)}
                                            />
                                            <Button 
                                                type="text" 
                                                size="small" 
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDeleteReview(review._id)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {pagination.total > pagination.pageSize && (
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Pagination
                                    current={pagination.current}
                                    pageSize={pagination.pageSize}
                                    total={pagination.total}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Review Modal */}
            <Modal
                title={editingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
                open={reviewModalVisible}
                onOk={editingReview ? handleUpdateReview : handleCreateReview}
                onCancel={closeModal}
                okText={editingReview ? "Cập nhật" : "Gửi đánh giá"}
                cancelText="Hủy"
            >
                <div style={{ marginBottom: '16px' }}>
                    <label>Đánh giá:</label>
                    <Rate 
                        value={reviewForm.rating} 
                        onChange={(value) => setReviewForm(prev => ({ ...prev, rating: value }))}
                        style={{ marginLeft: '8px' }}
                    />
                </div>
                <div>
                    <label>Bình luận:</label>
                    <TextArea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        rows={4}
                        maxLength={1000}
                        showCount
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ProductReviews;
