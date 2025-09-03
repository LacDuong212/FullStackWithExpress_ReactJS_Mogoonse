import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/auth.context.jsx";
import {HomeOutlined, SettingOutlined, UsergroupAddOutlined, AppstoreOutlined} from "@ant-design/icons";
import {Menu} from "antd";

const Header = () => {

    const navigate = useNavigate();
    const {auth, setAuth} = useContext(AuthContext);
    console.log(">>> check auth: ", auth);
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
            label: `Welcome ${auth?.user?.email ?? ""}`,
            key: "SubMenu",
            icon: <SettingOutlined />,
            children: [
                ...(auth.isAuthenticated ? [{
                    label: <span onClick={() => {
                        localStorage.removeItem("access_token");
                        setCurrent("home");
                        setAuth({
                            isAuthenticated: false,
                            user: {
                                email: "",
                                name: ""
                            }
                        })
                        navigate("/");
                    }}>Đăng xuất</span>,
                    key: "logout",
                }] : [
                    {
                        label: <Link to={"/login"}>Đăng nhập</Link>,
                        key: "login",
                    }
                ]),
            ],
        },
    ];
    const [current, setCurrent] = useState('mail');
    const  onClick = (e) => {
        console.log('click', e);
        setCurrent(e.key)
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
};
export default Header;