import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [requests, setRequests] =
    useState([]);

  /* ======================
     LOAD REQUESTS
  ====================== */
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests =
    async () => {
      try {
        const res =
          await axios.get(
            "http://localhost:5000/requests"
          );

        setRequests(
          res.data
        );

      } catch (err) {
        console.log(err);

        alert(
          "Failed to load requests"
        );
      }
    };

  /* ======================
     ACCEPT / REJECT
  ====================== */
  const updateStatus =
    async (
      requestId,
      status
    ) => {
      try {
        await axios.put(
          "http://localhost:5000/request-status",
          {
            id: requestId,
            status,
          }
        );

        alert(
          `Request ${status}`
        );

        fetchRequests();

      } catch (err) {
        console.log(err);

        alert(
          "Update Failed"
        );
      }
    };

  /* ======================
     DELETE REQUEST
  ====================== */
  const deleteRequest =
    async (
      requestId
    ) => {
      try {
        await axios.delete(
          `http://localhost:5000/delete-request/${requestId}`
        );

        alert(
          "Request Deleted Successfully"
        );

        fetchRequests();

      } catch (err) {
        console.log(err);

        alert(
          "Delete Failed"
        );
      }
    };

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className="admin-sidebar">

        <div>
          <h2 className="admin-logo">
            Admin Panel
          </h2>

          <ul className="admin-menu">
            <li className="active">
              Dashboard
            </li>

            <li>
              All Requests
            </li>

            <li>
              Manage Users
            </li>

            <li>
              Settings
            </li>
          </ul>
        </div>

        <button className="logout-btn">
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="admin-main">

        {/* Header */}
        <div className="admin-header">
          <h1>
            Welcome Admin 👋
          </h1>

          <p>
            Manage all student
            permission requests
          </p>
        </div>

        {/* Requests */}
        <div className="requests-wrapper">

          <h2>
            All Permission Requests
          </h2>

          <div className="request-grid">

            {requests.map(
              (request) => (
                <div
                  key={
                    request.request_id
                  }
                  className="request-card"
                >
                  <p>
                    <b>
                      Student ID:
                    </b>{" "}
                    {
                      request.student_id
                    }
                  </p>

                  <p>
                    <b>
                      Student Name:
                    </b>{" "}
                    {
                      request.student_name
                    }
                  </p>

                  <p>
                    <b>
                      Group:
                    </b>{" "}
                    {
                      request.group_name
                    }
                  </p>

                  <p>
                    <b>
                      Subject:
                    </b>{" "}
                    {
                      request.subject_name
                    }
                  </p>

                  <p>
                    <b>
                      Class Time:
                    </b>{" "}
                    {
                      request.class_time
                    }
                  </p>

                  <p>
                    <b>
                      Reason:
                    </b>{" "}
                    {
                      request.reason
                    }
                  </p>

                  <p>
                    <b>
                      Date:
                    </b>{" "}
                    {new Date(
                      request.request_date
                    ).toLocaleDateString()}
                  </p>

                  <span className="status">
                    {
                      request.status
                    }
                  </span>

                  <div className="button-group">

                    <button
                      className="accept-btn"
                      onClick={() =>
                        updateStatus(
                          request.request_id,
                          "Accepted"
                        )
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(
                          request.request_id,
                          "Rejected"
                        )
                      }
                    >
                      Reject
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteRequest(
                          request.request_id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>
                </div>
              )
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;