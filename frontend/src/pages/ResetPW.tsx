import { useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";

import axios from "../api/api";

export const ResetPwPage = () => {
  const { user_id, reset_token } = useParams();

  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onFinish = async (user_input: { password: string }) => {
    try {
      const res = await axios.post<{ success: boolean; msg: string }>(
        `/auth/reset-pw`,
        { ...user_input, user_id, reset_token }
      );

      if (res.data.success) {
        let success_msg = res.data.msg;
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
      <h1>Reset Password</h1>
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
        <Form.Item
          name="new_pw"
          rules={[
            { required: true, message: "Please enter your new password!" },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Enter new password"
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Reset
          </Button>
        </Form.Item>
      </Form>

      {err && <h3 style={{ color: "red", textAlign: "center" }}>{err}</h3>}

      {successMsg && (
        <h3 style={{ color: "green", textAlign: "center", width: "400px" }}>
          {successMsg}
          <br />
          <NavLink className="navbar-item" to="/login">
            Login Now
          </NavLink>
          {/* <a l>Login Now</a> */}
        </h3>
      )}
    </div>
  );
};
