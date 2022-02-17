import { Table, Space, Button, Row, Col, Modal, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "../models/index";

import moment from "moment";

import { useSelector } from "react-redux";
import { RootState } from "../redux/app-redux";
import { getAllUsersAction, deleteUserAction } from "../redux/users-slice";
import { useStoreDispatch } from "../redux/app-redux";
import { logout } from "../redux/auth-slice";

export const DashboardPage = () => {
  const dispatch = useStoreDispatch();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteUserLoading, setUserLoading] = useState(false);

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
              showModal(record.id);
            }}
          />
        </Space>
      ),
    },
  ];

  // get users data from JSON server
  useEffect(() => {
    setLoading(true);

    dispatch(getAllUsersAction())
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [dispatch]);

  const showModal = (user_id: string) => {
    setIsModalVisible(true);
    setDeleteUserId(user_id);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    removeUserHandler(deleteUserId);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // delete a user
  const removeUserHandler = (id: string | undefined) => {
    setUserLoading(true);

    dispatch(deleteUserAction(id))
      .then(() => {
        setUserLoading(false);
      })
      .catch(() => {
        setUserLoading(false);
      });
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
    <Fragment>
      <Row>
        <Col>
          <div className="table-wrapper">
            <div className="table-heading">
              <h1>Users List</h1>
              <Space>
                <Button
                  type="primary"
                  htmlType="button"
                  onClick={createUserHandler}
                >
                  New User
                </Button>
                <Button
                  type="primary"
                  danger
                  htmlType="button"
                  onClick={onLogout}
                >
                  Log Out
                </Button>
              </Space>
            </div>
            {loading && <Spin className="dashboard-spin" size="large" />}
            {!loading && (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={users}
                pagination={{ pageSize: 5 }}
              />
            )}
          </div>
        </Col>
      </Row>

      <Modal
        title="Delete User"
        visible={isModalVisible}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            loading={deleteUserLoading}
            onClick={handleOk}
          >
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure to delete this user ?</p>
      </Modal>
    </Fragment>
  );
};
