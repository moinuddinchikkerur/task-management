






import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../index.css";

const AdminUsers = () => {
  /* ================= NAVIGATE ================= */
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  /* EDIT MODAL */
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");

  const usersPerPage = 6;
  const token = localStorage.getItem("token");

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://task-management-l8em.onrender.com/api/user/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= SEARCH ================= */
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const last = page * usersPerPage;
  const first = last - usersPerPage;

  const currentData = filtered.slice(first, last);
  const pages = Math.ceil(filtered.length / usersPerPage);

  /* ================= BLOCK USER ================= */
  const toggleBlock = async (id) => {
    try {
      await axios.put(
        `https://task-management-l8em.onrender.com/api/user/admin/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User status updated");
      fetchUsers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(
        `https://task-management-l8em.onrender.com/api/user/admin/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  /* ================= EDIT USER ================= */
  const openEdit = (user) => {
    setEditUser(user);

    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `https://task-management-l8em.onrender.com/api/user/admin/update/${editUser._id}`,
        {
          name: editName,
          email: editEmail,
          role: editRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User updated successfully");

      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    }
  };

  /* ================= LOADING ================= */
  if (loading)
    return <h3 className="admin-loader">Loading...</h3>;

  /* ================= UI ================= */
  return (
    <div className="admin-container">
      {/* TOAST */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* HEADER */}
      <div className="admin-top">
        <h2 className="admin-heading">User Management</h2>

        <input
          type="text"
          placeholder="Search..."
          className="admin-searchbox"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="admin-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-result">
                  No Users Found
                </td>
              </tr>
            ) : (
              currentData.map((u) => (
                <tr key={u._id}>
                  <td className="task-name">{u.name}</td>

                  <td className="task-user">{u.email}</td>

                  <td>
                    <span className="role-badge">
                      {u.role}
                    </span>
                  </td>

                  <td>
                    {u.isBlocked ? (
                      <span className="badge pending">
                        Blocked
                      </span>
                    ) : (
                      <span className="badge done">
                        Active
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="action-group">
                      {/* ANALYTICS */}
                      <button
                        className="btn-action view"
                        onClick={() =>
                          navigate(
                            `/admin/dashboard?userId=${u._id}`
                          )
                        }
                      >
                        📊 Analytics
                      </button>

                      {/* TASKS */}
                      <button
                        className="btn-action view"
                        onClick={() =>
                          navigate(
                            `/admin/tasks?userId=${u._id}`
                          )
                        }
                      >
                        📋 Tasks
                      </button>

                      {/* EDIT */}
                      <button
                        className="btn-action edit"
                        onClick={() => openEdit(u)}
                      >
                        ✏ Edit
                      </button>

                      {/* BLOCK */}
                      <button
                        className="btn-action view"
                        onClick={() =>
                          toggleBlock(u._id)
                        }
                      >
                        {u.isBlocked
                          ? "Unblock"
                          : "Block"}
                      </button>

                      {/* DELETE */}
                      <button
                        className="btn-action delete"
                        onClick={() =>
                          deleteUser(u._id)
                        }
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="page-area">
          {Array.from({ length: pages }).map(
            (_, i) => (
              <button
                key={i}
                className={
                  page === i + 1
                    ? "page-btn active"
                    : "page-btn"
                }
                onClick={() =>
                  setPage(i + 1)
                }
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      {editUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit User</h3>

              <button
                className="modal-close"
                onClick={() =>
                  setEditUser(null)
                }
              >
                ✖
              </button>
            </div>

            <div className="modal-body">
              <input
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
                placeholder="Name"
              />

              <input
                value={editEmail}
                onChange={(e) =>
                  setEditEmail(e.target.value)
                }
                placeholder="Email"
              />

              <select
                value={editRole}
                onChange={(e) =>
                  setEditRole(e.target.value)
                }
              >
                <option value="user">
                  User
                </option>
                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn"
                onClick={saveEdit}
              >
                Save
              </button>

              <button
                className="modal-btn cancel"
                onClick={() =>
                  setEditUser(null)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
