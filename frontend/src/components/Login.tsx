import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Login: React.FC<any> = (props) => {
  const navigate = useNavigate();

  const onLogin = (values: any) => {
    console.log("Received values of form: ", values);
  };

  const registerNavigation = () => {
    navigate("/signup");
  };

  return (
    <div className="form-wrapper">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onLogin}
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
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <button type="button" className="login-form-forgot btn">
            Forgot password
          </button>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          <button
            onClick={registerNavigation}
            type="button"
            className="btn register-trigger"
          >
            Or <span>register now!</span>
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
