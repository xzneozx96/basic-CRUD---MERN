import React from "react";
import { useState } from "react";

import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import axios from "../api/api";

const ForgotPW: React.FC<any> = (props) => {
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onFinish = async (user_input: { username: string; email: string }) => {
    try {
      const res = await axios.post<{ success: boolean; reset_link: string }>(
        `/auth/forgot-pw`,
        user_input
      );

      if (res.data.success) {
        let success_msg = res.data.reset_link;
        setSuccessMsg(success_msg);
        setErr("");
      }
    } catch (err: any) {
      let err_msg = err.response.data.msg;
      setErr(err_msg);
      setSuccessMsg("");
    }
  };

  return (
    <div className="form-wrapper">
      <h1>Forgot Password</h1>
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
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
          name="email"
          rules={[{ required: true, message: "Please enter your Email!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="Email"
            autoComplete="on"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Send Verification Link
          </Button>
        </Form.Item>
      </Form>

      {err && <h3 style={{ color: "red", textAlign: "center" }}>{err}</h3>}

      {successMsg && (
        <h3 style={{ color: "green", textAlign: "center", width: "400px" }}>
          Please click{" "}
          <u>
            <a href={successMsg}>here</a>
          </u>{" "}
          to start resetting you password
        </h3>
      )}
    </div>
  );
};

export default ForgotPW;
