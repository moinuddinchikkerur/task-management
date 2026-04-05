





import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../index.css";

const AdminTasks = () => {

  /* ================= NAVIGATION ================= */
  const location = useLocation();
  const navigate = useNavigate();

  /* ================= GET USER ID ================= */
  const query = new URLSearchParams(location.search);
  const userId = query.get("userId"); // from AdminUsers


  /* ================= STATES ================= */

  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  /* VIEW MODAL */
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  /* EDIT MODAL */
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const itemsPerPage = 6;

  const token = localStorage.getItem("token");


  /* ================= FETCH TASKS ================= */

  const getTasks = async () => {
    try {

      let url = "http://localhost:4000/api/task/admin/all";

      // If userId exists → filter
      if (userId) {
        url = `http://localhost:4000/api/task/admin/all?userId=${userId}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTaskList(res.data.tasks || []);

    } catch (err) {
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, [userId]);


  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/task/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getTasks();

    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };


  /* ================= VIEW ================= */

  const openModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setShowModal(false);
  };


  /* ================= EDIT ================= */

  const openEdit = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
  };

  const closeEdit = () => {
    setEditTask(null);
    setEditTitle("");
    setEditDesc("");
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/task/admin/${editTask._id}`,
        {
          title: editTitle,
          description: editDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      closeEdit();
      getTasks();

    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };


  /* ================= SEARCH ================= */

  const filtered = taskList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.owner?.name?.toLowerCase().includes(searchText.toLowerCase())
  );


  /* ================= PAGINATION ================= */

  const last = page * itemsPerPage;
  const first = last - itemsPerPage;

  const currentData = filtered.slice(first, last);
  const pages = Math.ceil(filtered.length / itemsPerPage);


  if (loading) {
    return <h3 className="admin-loader">Loading...</h3>;
  }


  /* ================= UI ================= */

  return (
    <div className="admin-container">


      {/* BACK BUTTON */}
      {userId && (
        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/admin/users")}
        >
          ← Back to Users
        </button>
      )}


      {/* HEADER */}
      <div className="admin-top">

        <h2 className="admin-heading">
          {userId ? "User Tasks" : "Task Management"}
        </h2>

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
              <th>Title</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>


          <tbody>

            {currentData.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-result">
                  No Tasks Found
                </td>
              </tr>
            ) : (
              currentData.map((task) => (
                <tr key={task._id}>

                  <td className="task-name">
                    {task.title}
                  </td>

                  <td className="task-user">
                    {task.owner?.name || "N/A"}
                  </td>

                  <td>
                    {task.completed ? (
                      <span className="badge done">
                        Completed
                      </span>
                    ) : (
                      <span className="badge pending">
                        Pending
                      </span>
                    )}
                  </td>


                  {/* ACTIONS */}
                  <td>

                    <div className="action-group">

                      <button
                        className="btn-action view"
                        onClick={() => openModal(task)}
                      >
                        👁 View
                      </button>

                      <button
                        className="btn-action edit"
                        onClick={() => openEdit(task)}
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="btn-action delete"
                        onClick={() => handleDelete(task._id)}
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

          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              className={
                page === i + 1
                  ? "page-btn active"
                  : "page-btn"
              }
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

        </div>
      )}


      {/* ================= VIEW MODAL ================= */}

      {showModal && selectedTask && (

        <div className="modal-overlay">

          <div className="modal-box">

            <div className="modal-header">

              <h3>Task Details</h3>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ✖
              </button>

            </div>


            <div className="modal-body">

              <div className="modal-row">
                <span>Title:</span>
                <p>{selectedTask.title}</p>
              </div>

              <div className="modal-row">
                <span>Owner:</span>
                <p>{selectedTask.owner?.name || "N/A"}</p>
              </div>

              <div className="modal-row">
                <span>Status:</span>
                <p>
                  {selectedTask.completed
                    ? "Completed"
                    : "Pending"}
                </p>
              </div>

              <div className="modal-row">
                <span>Description:</span>
                <p>
                  {selectedTask.description || "No Description"}
                </p>
              </div>

            </div>


            <div className="modal-footer">

              <button
                className="modal-btn"
                onClick={closeModal}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}


      {/* ================= EDIT MODAL ================= */}

      {editTask && (

        <div className="modal-overlay">

          <div className="modal-box">

            <div className="modal-header">

              <h3>Edit Task</h3>

              <button
                className="modal-close"
                onClick={closeEdit}
              >
                ✖
              </button>

            </div>


            <div className="modal-body">

              <input
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                placeholder="Task Title"
              />

              <textarea
                value={editDesc}
                onChange={(e) =>
                  setEditDesc(e.target.value)
                }
                placeholder="Task Description"
                rows="4"
              />

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
                onClick={closeEdit}
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

export default AdminTasks;
