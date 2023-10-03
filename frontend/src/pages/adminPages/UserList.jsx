import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const UserList = () => {
  const { data: users, refetch, isLoading, isError } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: deleteUserLoading }] =
    useDeleteUserMutation();

  const deleteUserHandler = async (id) => {
    if (window.confirm("Bir kullanıcıyı silmek üzeresiniz!")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("Kullanıcı başarılı bir şekilde silindi.");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <h1>Kullanıcılar</h1>
      {deleteUserLoading && <Loader />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{isError}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>İsim</th>
              <th>E-Posta</th>
              <th>Admin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>

                <td>
                  <LinkContainer to={`/admin/userEdit/${user._id}`}>
                    <Button variant="light" className="btn-sm mx-2">
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteUserHandler(user._id)}
                  >
                    <FaTrash style={{ color: "white" }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserList;
