import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import axios from "../api/api";

const Signup: React.FC<any> = (props) => {
  const navigate = useNavigate();

  const [err, setErr] = useState(null);

  const loginNavigation = () => {
    navigate("/login");
  };

  const onRegister = async (user_input: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await axios.post<{ msg: string; success: boolean }>(
        `/auth/register`,
        user_input
      );

      // re-direct user to dashboard page
      loginNavigation();
    } catch (err: any) {
      let err_msg = err.response.data.msg;
      setErr(err_msg);
    }
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
            onClick={loginNavigation}
            type="button"
            className="btn register-trigger"
          >
            Already have an account? <span>Log In now!</span>
          </button>
        </Form.Item>
      </Form>

      {err && <h3 style={{ color: "red", textAlign: "center" }}>{err}</h3>}
    </div>
  );
};

export default Signup;
