import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useStoreDispatch } from "../redux/app-redux";
import { login } from "../redux/auth-slice";
import { openErrNotification } from "../utils/errorNoti";

export const LoginPage = () => {
  const dispatch = useStoreDispatch();
  const navigate = useNavigate();

  const onLogin = async (user_input: {
    username: string;
    password: string;
  }) => {
    try {
      await dispatch(login(user_input)).unwrap();

      // re-direct user to dashboard page
      navigate("/dashboard");
    } catch (err_msg: any) {
      openErrNotification(err_msg);
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
    </div>
  );
};
