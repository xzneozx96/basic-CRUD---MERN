import { Table, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "../models/index";

import api from "../api/users";
import moment from "moment";

const Dashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);

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
    const fetchUsers = async () => {
      try {
        const all_users = await await api.get("/users");
        if (all_users) setUsers(all_users.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  // delete a user
  const removeUserHandler = async (id: string | undefined) => {
    try {
      await api.delete(`users/${id}`);
      const updated_list = users.filter((user: User) => user.id !== id);
      setUsers(updated_list);
    } catch (err) {
      console.log(err);
    }
  };

  // create new user
  const createUserHandler = () => {
    navigate("/new-user");
  };

  // update a user
  const editUserHandler = (id: string | undefined) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className="table-wrapper">
      <div className="table-heading">
        <h1>Users List</h1>
        <Button type="primary" htmlType="button" onClick={createUserHandler}>
          New User
        </Button>
      </div>
      {users.length > 0 && (
        <Table rowKey="id" columns={columns} dataSource={users} />
      )}
    </div>
  );
};

export default Dashboard;
