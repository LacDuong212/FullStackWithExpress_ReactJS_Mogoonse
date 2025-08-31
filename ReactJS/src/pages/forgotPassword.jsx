import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { forgotPasswordApi } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { email, newPassword, confirmPassword } = values;

        if (newPassword !== confirmPassword) {
            notification.error({
                message: "LỖI",
                description: "Mật khẩu xác nhận không khớp!",
            });
            return;
        }

        const res = await forgotPasswordApi(email, newPassword);

        if (res && res.EC === 0) {
            notification.success({
                message: "ĐẶT LẠI MẬT KHẨU",
                description: "Đặt lại mật khẩu thành công!",
            });
            navigate('/login');
        } else {
            notification.error({
                message: "ĐẶT LẠI MẬT KHẨU",
                description: res?.EM ?? "Có lỗi xảy ra!",
            });
        }
    };

    return (
        <Row justify="center" style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đặt Lại Mật Khẩu</legend>
                    <Form
                        name="forgotPassword"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email của bạn!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu mới!',
                                },
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                                }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu mới"
                            name="confirmPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng xác nhận mật khẩu mới!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Đặt lại mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>

                    <Link to="/">
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>

                    <Divider />

                    <div style={{ textAlign: "center" }}>
                        Đã nhớ mật khẩu? <Link to="/login">Đăng nhập tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default ForgotPasswordPage;
