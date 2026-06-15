import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import "../styles/LecturerDashboard.css";

function LecturerDashboard() {
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
     UPDATE STATUS
  ====================== */
  const updateStatus =
    async (
      id,
      status
    ) => {
      try {
        await axios.put(
          "http://localhost:5000/request-status",
          {
            id,
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
     GROUP REQUESTS
  ====================== */
  const groupedRequests =
    requests.reduce(
      (
        groups,
        request
      ) => {
        const group =
          request.group_name ||
          "No Group";

        if (
          !groups[group]
        ) {
          groups[group] =
            [];
        }

        groups[group].push(
          request
        );

        return groups;
      },
      {}
    );

  return (
    <div className="lecturer-container">

      {/* Sidebar */}
      <div className="lecturer-sidebar">
        <div>
          <h2 className="lecturer-logo">
            Lecturer Panel
          </h2>

          <ul className="lecturer-menu">
            <li className="active">
              Dashboard
            </li>

            <li>
              Permission Requests
            </li>

            <li>
              Groups
            </li>

            <li>
              Profile
            </li>
          </ul>
        </div>

        <button className="logout-btn">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="lecturer-main">

        {/* Header */}
        <div className="lecturer-header">
          <h1>
            Welcome Lecturer 👋
          </h1>

          <p>
            Manage student
            permission requests
          </p>
        </div>

        {/* Request Section */}
        <div className="requests-wrapper">
          <h2>
            Permission Requests
          </h2>

          <div className="group-grid">

            {Object.keys(
              groupedRequests
            ).map((group) => (
              <div
                key={group}
                className="group-card"
              >
                {/* Group Header */}
                <div className="group-header">
                  {group}
                </div>

                <div className="group-body">

                  <p className="total-text">
                    Total Requests:
                    {" "}
                    <b>
                      {
                        groupedRequests[
                          group
                        ].length
                      }
                    </b>
                  </p>

                  {groupedRequests[
                    group
                  ].map(
                    (
                      request
                    ) => (
                      <div
                        key={
                          request.request_id
                        }
                        className="request-card"
                      >
                        <p>
                          <b>ID:</b>{" "}
                          {
                            request.student_id
                          }
                        </p>

                        <p>
                          <b>Name:</b>{" "}
                          {
                            request.student_name
                          }
                        </p>

                        <p>
                          <b>Subject:</b>{" "}
                          {
                            request.subject_name
                          }
                        </p>

                        <p>
                          <b>Class Time:</b>{" "}
                          {
                            request.class_time
                          }
                        </p>

                        <p>
                          <b>Reason:</b>{" "}
                          {
                            request.reason
                          }
                        </p>

                        <p>
                          <b>Date:</b>{" "}
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
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LecturerDashboard;