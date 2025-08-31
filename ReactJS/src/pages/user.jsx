import {useEffect, useState} from "react";
import {getUserApi} from "../utils/api.js";
import {notification, Table} from "antd";

const UserPage = () => {
    const [dataSoure, setDataSoure] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            if (!res?.message) {
                setDataSoure(res)
            } else {
                notification.error({
                    message: "Unauthorized",
                    description: res.message
                })
            }
        }
        fetchUser();
    }, [])
    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Role",
            dataIndex: "role",
        }
    ];
    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSoure} columns={columns}
                rowKey={"_id"}
            />
        </div>
    )
}

export default UserPage;