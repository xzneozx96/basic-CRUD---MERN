import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import axios from "../api/api";
import { useState } from "react";

import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/auth-slice";

const Login: React.FC<any> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [err, setErr] = useState(null);

  const calculateDurationSession = (expiresAt: string) => {
    const now = new Date().getTime();
    const expires_at = new Date(expiresAt).getTime();

    const remaining_time = expires_at - now;
    return remaining_time;
  };

  const onLogin = async (user_input: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await axios.post<{ access_token: string }>(
        `/auth/login`,
        user_input
      );

      // get expiration from decoded token
      const decoded_token = jwt_decode<{ username: string; exp: number }>(
        res.data.access_token
      );

      const expires_at = new Date(decoded_token.exp * 1000);

      dispatch(
        authActions.login({
          token: res.data.access_token,
          expiresAt: expires_at.toISOString(),
        })
      );

      // start timer for auto-logout
      // const remaining_time = calculateDurationSession(expires_at.toISOString());

      // let timer = setTimeout(() => {
      //   dispatch(authActions.logout());
      //   navigate("/login");
      //   clearTimeout(timer);
      // }, remaining_time);

      // re-direct user to dashboard page
      navigate("/dashboard");
    } catch (err: any) {
      let err_msg = err.response.data.msg;
      setErr(err_msg);
    }
  };

  const registerNavigation = () => {
    navigate("/signup");
  };

  const forgotPwNavigation = () => {
    navigate("/forgot-pw");
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

          <button
            type="button"
            className="login-form-forgot btn"
            onClick={forgotPwNavigation}
          >
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

      {err && <h3 style={{ color: "red", textAlign: "center" }}>{err}</h3>}
    </div>
  );
};

export default Login;
