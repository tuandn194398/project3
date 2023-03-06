import "./NewBlog.css"
import { useState } from "react";
import { getIPFS } from "../ultils/IPFS";
import { getContract, getOwnedAddr } from "../ultils/Contract";
import { Button, Form, Input, Checkbox } from 'antd';
import { useNavigate } from "react-router-dom";
// import { Buffer } from "buffer";

function NewBlog() {

    const onFinish = (values) => {
        console.log(values);
    };

    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 14,
        },
    };


    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mode, setMode] = useState(false);//
    const navigate = useNavigate();

    console.log('this is ', window.location.pathname.split('/')[1]);
    async function myFunction() {
        navigate(`/my-blogs`);
    }

    async function storeData(event) {
        // event.preventDefault();
        const data = {
            title: title,
            content: content,
            date: new Date(),
            author: await getOwnedAddr()
        };

        console.log(data);
        const ipfsRes = await getIPFS().add(JSON.stringify(data));

        let uri = ipfsRes.path;
        console.log('mode: ', mode)
        const mint = await getContract().ownedMint(uri, mode);
        window.setTimeout(myFunction, 20000);
        console.log(mint)
    }

    return (
        <Form
            {...layout}
            name="create-form"
            onFinish={storeData}
            style={{
                padding: "60px 20px"
            }}
            validateMessages={{ required: '${label} is required' }}
        >
            <Form.Item
                name={'title'}
                label="Title"
                rules={[{ required: true }]}
            >
                <Input allowClear onChange={(e) => setTitle(e.target.value)} />
            </Form.Item>
            <Form.Item
                name={'content'}
                label="Content"
                rules={[{ required: true }]}
            >
                <Input.TextArea className="content-field" allowClear style={{ minHeight: 200 }} onChange={(e) => setContent(e.target.value)} />
            </Form.Item>
            <Form.Item
                name="status-check"
                valuePropName="checked"
                wrapperCol={{ offset: 5 }}
            >
                <Checkbox onChange={(e) => setMode(e.target.checked)}>Public</Checkbox>
            </Form.Item>
            <Form.Item
                wrapperCol={{ offset: 5 }}
            >
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>

        </Form>
    );
};

export default NewBlog;