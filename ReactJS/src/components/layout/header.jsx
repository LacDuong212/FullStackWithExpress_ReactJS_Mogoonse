import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";
import { HomeOutlined, SettingOutlined, UsergroupAddOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Menu } from "antd";

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [current, setCurrent] = useState("home"); // key mặc định

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: {
                email: "",
                name: ""
            }
        });
        setCurrent("home"); // quay về Home
        navigate("/");
    };

    const items = [
        {
            label: <Link to={"/"}>Home Page</Link>,
            key: "home",
            icon: <HomeOutlined />
        },
        {
            label: <Link to={"/product-pagination"}>Products Pagination</Link>,
            key: "productsPagi",
            icon: <AppstoreOutlined />
        },
        {
            label: <Link to={"/product-lazy"}>Products Lazy Loading</Link>,
            key: "productsLazy",
            icon: <AppstoreOutlined />
        },
        ...(auth.isAuthenticated ? [{
            label: <Link to={"/user"}>Users</Link>,
            key: 'user',
            icon: <UsergroupAddOutlined />
        }] : []),
        {
            label: `Welcome ${auth?.user?.email ?? "Guest"}`,
            key: "SubMenu",
            icon: <SettingOutlined />,
            children: auth.isAuthenticated
                ? [{ label: <span onClick={handleLogout}>Đăng xuất</span>, key: "logout" }]
                : [{ label: <Link to={"/login"}>Đăng nhập</Link>, key: "login" }]
        }
    ];

    const onClick = (e) => {
        setCurrent(e.key);
    };

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default Header;
