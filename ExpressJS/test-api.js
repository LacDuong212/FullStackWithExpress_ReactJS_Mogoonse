// Script để test các API đã triển khai
const axios = require('axios');

const BASE_URL = 'http://localhost:8080/v1/api';

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
};

const testProduct = {
    name: 'Test Product',
    price: 100000,
    category: 'Electronics',
    description: 'This is a test product',
    tags: ['test', 'electronics'],
    brand: 'TestBrand'
};

let authToken = '';
let productId = '';
let userId = '';

async function testAPI() {
    console.log('🚀 Bắt đầu test API...\n');

    try {
        // 1. Test đăng ký user
        console.log('1. Testing user registration...');
        try {
            const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
            console.log('✅ User registration successful');
            console.log('Response:', registerResponse.data);
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('ℹ️ User already exists, continuing...');
            } else {
                throw error;
            }
        }

        // 2. Test đăng nhập
        console.log('\n2. Testing user login...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        authToken = loginResponse.data.data.access_token;
        userId = loginResponse.data.data.user.id;
        console.log('✅ User login successful');
        console.log('Token:', authToken.substring(0, 20) + '...');

        // 3. Test tạo sản phẩm (cần thêm API này)
        console.log('\n3. Testing product creation...');
        // Note: Cần thêm API tạo sản phẩm trong ProductController
        console.log('⚠️ Product creation API not implemented yet');

        // 4. Test lấy danh sách sản phẩm
        console.log('\n4. Testing get products...');
        const productsResponse = await axios.get(`${BASE_URL}/product`);
        console.log('✅ Get products successful');
        console.log('Products count:', productsResponse.data.data.products.length);
        
        if (productsResponse.data.data.products.length > 0) {
            productId = productsResponse.data.data.products[0]._id;
            console.log('Using product ID:', productId);
        }

        // 5. Test lấy chi tiết sản phẩm
        if (productId) {
            console.log('\n5. Testing get product detail...');
            const productDetailResponse = await axios.get(`${BASE_URL}/product/${productId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Get product detail successful');
            console.log('Product:', productDetailResponse.data.data.product.name);
        }

        // 6. Test toggle favorite
        if (productId) {
            console.log('\n6. Testing toggle favorite...');
            const favoriteResponse = await axios.post(`${BASE_URL}/product/${productId}/favorite`, {}, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Toggle favorite successful');
            console.log('Is favorite:', favoriteResponse.data.isFavorite);
        }

        // 7. Test lấy sản phẩm yêu thích
        console.log('\n7. Testing get favorite products...');
        const favoritesResponse = await axios.get(`${BASE_URL}/user/favorite-products`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Get favorite products successful');
        console.log('Favorite products count:', favoritesResponse.data.data.length);

        // 8. Test lấy sản phẩm đã xem
        console.log('\n8. Testing get viewed products...');
        const viewedResponse = await axios.get(`${BASE_URL}/user/viewed-products`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Get viewed products successful');
        console.log('Viewed products count:', viewedResponse.data.data.length);

        // 9. Test tạo review
        if (productId) {
            console.log('\n9. Testing create review...');
            const reviewData = {
                rating: 5,
                comment: 'This is a great product! Highly recommended.'
            };
            const reviewResponse = await axios.post(`${BASE_URL}/product/${productId}/review`, reviewData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Create review successful');
            console.log('Review ID:', reviewResponse.data.data._id);
        }

        // 10. Test lấy reviews của sản phẩm
        if (productId) {
            console.log('\n10. Testing get product reviews...');
            const reviewsResponse = await axios.get(`${BASE_URL}/product/${productId}/reviews`);
            console.log('✅ Get product reviews successful');
            console.log('Reviews count:', reviewsResponse.data.data.reviews.length);
        }

        // 11. Test lấy thống kê sản phẩm
        if (productId) {
            console.log('\n11. Testing get product stats...');
            const statsResponse = await axios.get(`${BASE_URL}/product/${productId}/stats`);
            console.log('✅ Get product stats successful');
            console.log('Stats:', statsResponse.data.data);
        }

        // 12. Test lấy reviews của user
        console.log('\n12. Testing get user reviews...');
        const userReviewsResponse = await axios.get(`${BASE_URL}/user/reviews`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Get user reviews successful');
        console.log('User reviews count:', userReviewsResponse.data.data.reviews.length);

        console.log('\n🎉 Tất cả test đã hoàn thành thành công!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('URL:', error.config?.url);
    }
}

// Chạy test
testAPI();
