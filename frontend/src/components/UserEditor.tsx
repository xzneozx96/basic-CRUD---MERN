import { Form, Input, InputNumber, Button, DatePicker, Space } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";

const UserEditor = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { userID } = useParams();

  const [editMode, setEditMode] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (userID) {
      setEditMode(true);
      api.get(`/users/${userID}`).then((res) => {
        form.setFieldsValue({
          ...res.data,
          date_of_birth: moment(res.data.date_of_birth),
        });
      });
    }
  }, [userID, form]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const dateFormat = "DD/MM/YYYY";

  const onFinish = async (user: any) => {
    try {
      if (editMode) {
        const post_data = {
          ...user,
        };

        await api.put(`/users/${userID}`, post_data);
        navigate("/dashboard");
      } else {
        const post_data = {
          id: Math.floor(Math.random() * (100 - 20 + 1) + 20).toString(),
          ...user,
        };

        const res = await api.post("/users", post_data);
        if (!res.data.success) {
          setError(res.data.msg);
          return;
        }
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onCancel = () => {
    navigate("/dashboard");
  };

  return (
    <Form
      form={form}
      {...layout}
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item name={["name"]} label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={["email"]}
        label="Email"
        rules={[{ type: "email", required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["age"]}
        label="Age"
        rules={[{ type: "number", min: 0, max: 99, required: true }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name={["phone_number"]}
        label="Phone Number"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["date_of_birth"]}
        label="Date of Birth"
        rules={[{ required: true }]}
      >
        <DatePicker format={dateFormat} />
      </Form.Item>
      {error && (
        <Form.Item label="Error">
          <p style={{ color: "red", marginBottom: 0 }}>{error}</p>
        </Form.Item>
      )}
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            {editMode ? "Update" : "Create"}
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserEditor;
