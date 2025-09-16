import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import ForgotPasswordPage from './pages/forgotPassword.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ProductLazyLoad from './pages/productLazyLoad.jsx';
import ProductPagination from './pages/productPagination.jsx';
import FavoriteProducts from './pages/FavoriteProducts.jsx';
import ViewedProducts from './pages/ViewedProducts.jsx';
import ProductDetail from './components/product/ProductDetail.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "user",
                element: <UserPage />,
            },
            {
                path: "favorites",
                element: <FavoriteProducts />,
            },
            {
                path: "viewed",
                element: <ViewedProducts />,
            },
            {
                path: "product/:id",
                element: <ProductDetail />,
            },
        ],
    },
    {
        path: "register",
        element: <RegisterPage />,
    },
    {
        path: "login",
        element: <LoginPage />,
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
    },
    {
        path: "product-lazy",
        element: <ProductLazyLoad />,
    },
    {
        path: "product-pagination",
        element: <ProductPagination />,
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthWrapper>
            <RouterProvider router={router} />
        </AuthWrapper>
    </React.StrictMode>,
);