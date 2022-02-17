import { Button, DatePicker, Form, Input, InputNumber, Space } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreDispatch } from "../redux/app-redux";
import {
  addNewUserAction,
  getSingleUserAction,
  updateUserAction,
} from "../redux/users-slice";
import { openErrNotification } from "../utils/errorNoti";

export const UserEditorPage = () => {
  const navigate = useNavigate();
  const dispatch = useStoreDispatch();

  const [form] = Form.useForm();

  const { userID } = useParams();

  const [editMode, setEditMode] = useState(false);

  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    if (userID) {
      setSpinner(true);
      setEditMode(true);

      dispatch(getSingleUserAction(userID))
        .unwrap()
        .then((user) => {
          setSpinner(false);

          form.setFieldsValue({
            ...user,
            date_of_birth: moment(user.date_of_birth),
          });
        })
        .catch((err_msg) => {
          setSpinner(false);

          openErrNotification(err_msg);
        });
    }
  }, [userID, form, dispatch]);

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
      setSpinner(true);

      if (editMode) {
        const updated_user = {
          ...user,
        };

        await dispatch(updateUserAction({ userID, updated_user })).unwrap();

        setSpinner(false);
        navigate("/dashboard");
      } else {
        const new_user = {
          id: Math.floor(Math.random() * (100 - 20 + 1) + 20).toString(),
          ...user,
        };

        await dispatch(addNewUserAction(new_user)).unwrap();

        setSpinner(false);
        navigate("/dashboard");
      }
    } catch (err_msg: any) {
      setSpinner(false);

      openErrNotification(err_msg);
    }
  };

  const onCancel = () => {
    navigate("/dashboard");
  };

  const getButtonLabel = () => {
    if (spinner) return "Loading";
    if (editMode && !spinner) return "Update";
    if (!editMode && !spinner) return "Create";
    return "";
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

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Space>
          <Button loading={spinner} type="primary" htmlType="submit">
            {getButtonLabel()}
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
