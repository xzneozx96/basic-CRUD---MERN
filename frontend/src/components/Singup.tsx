import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Signup: React.FC<any> = (props) => {
  const navigate = useNavigate();

  const lgoinNavigation = () => {
    navigate("/login");
  };

  const onRegister = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className="form-wrapper">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onRegister}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            autoComplete="on"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            autoComplete="on"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Register
          </Button>
          <button
            onClick={lgoinNavigation}
            type="button"
            className="btn register-trigger"
          >
            Already have an account? <span>Log In now!</span>
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
