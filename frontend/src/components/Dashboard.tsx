import { Table, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "../models/index";

import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/app-redux";
import { getAllUsersAction, deleteUserAction } from "../redux/users-slice";
import { logout } from "../redux/auth-slice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector((state: RootState) => state.users.users);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      render: (date: string) => {
        let formated_date = moment(date).format("DD/MM/YYYY");
        return <span>{formated_date}</span>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (record: User) => (
        <Space size="middle">
          <EditOutlined
            style={{ fontSize: "18px", color: "#08c", cursor: "pointer" }}
            onClick={() => {
              editUserHandler(record.id);
            }}
          />
          <DeleteOutlined
            style={{ fontSize: "18px", color: "red", cursor: "pointer" }}
            onClick={() => {
              removeUserHandler(record.id);
            }}
          />
        </Space>
      ),
    },
  ];

  // get users data from JSON server
  useEffect(() => {
    dispatch(getAllUsersAction());
  }, [dispatch]);

  // delete a user
  const removeUserHandler = (id: string | undefined) => {
    dispatch(deleteUserAction(id));
  };

  // create new user
  const createUserHandler = () => {
    navigate("/new-user");
  };

  // update a user
  const editUserHandler = (id: string | undefined) => {
    navigate(`/user/${id}`);
  };

  // log out
  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="table-wrapper">
      <div className="table-heading">
        <h1>Users List</h1>
        <Space>
          <Button type="primary" htmlType="button" onClick={createUserHandler}>
            New User
          </Button>
          <Button type="primary" danger htmlType="button" onClick={onLogout}>
            Log Out
          </Button>
        </Space>
      </div>
      {users.length > 0 && (
        <Table rowKey="id" columns={columns} dataSource={users} />
      )}
    </div>
  );
};

export default Dashboard;
