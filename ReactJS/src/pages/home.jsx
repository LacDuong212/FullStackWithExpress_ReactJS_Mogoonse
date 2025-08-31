import {Result} from "antd";
import {CrownOutlined} from "@ant-design/icons";

const HomePage = () => {
    return (
        <div style={{ padding: 20 }}>
            <Result
                icon={<CrownOutlined />}
                title="JSON Web Token (React/Node.JS)"
            />
        </div>
    )
}

export default HomePage;