import { useState } from "react";
import axios from "axios";
import "../styles/StudentDashboard.css";

function StudentDashboard() {
  const [studentId, setStudentId] =
    useState("");

  const [studentName, setStudentName] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [requestDate, setRequestDate] =
    useState("");

  const [subjectName, setSubjectName] =
    useState("");

  const [classTime, setClassTime] =
    useState("");

  const [requests, setRequests] =
    useState([]);

  /* ======================
     SUBMIT REQUEST
  ====================== */
  const handleSubmit =
    async () => {
      if (
        !studentId ||
        !studentName ||
        !reason ||
        !requestDate ||
        !subjectName ||
        !classTime
      ) {
        alert(
          "Please fill all fields"
        );
        return;
      }

      const groupName =
        localStorage.getItem(
          "group_name"
        );

      try {
        const res =
          await axios.post(
            "http://localhost:5000/request",
            {
              student_id:
                studentId.trim(),
              student_name:
                studentName,
              group_name:
                groupName,
              reason,
              request_date:
                requestDate,
              subject_name:
                subjectName,
              class_time:
                classTime,
            }
          );

        alert(res.data);

        setStudentName("");
        setReason("");
        setRequestDate("");
        setSubjectName("");
        setClassTime("");

      } catch (err) {
        console.log(err);
        alert(
          "Request Failed"
        );
      }
    };

  /* ======================
     VIEW STATUS
  ====================== */
  const viewStatus =
    async () => {
      if (!studentId) {
        alert(
          "Enter Student ID first"
        );
        return;
      }

      try {
        const res =
          await axios.get(
            `http://localhost:5000/student-requests/${studentId.trim()}`
          );

        console.log(
          "REQUEST DATA:",
          res.data
        );

        setRequests(
          res.data || []
        );

      } catch (err) {
        console.log(err);
        alert(
          "Failed to load status"
        );
      }
    };

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">

        <div>
          <h2 className="logo">
            Student Panel
          </h2>

          <ul className="menu">
            <li className="active">
              Dashboard
            </li>

            <li>
              New Request
            </li>

            <li>
              My Requests
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
      <div className="main-content">

        {/* Header */}
        <div className="top-header">
          <div>
            <h1>
              Welcome Student 👋
            </h1>

            <p>
              Group:{" "}
              <span>
                {localStorage.getItem(
                  "group_name"
                )}
              </span>
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="form-card">

          <h2>
            Request Permission
          </h2>

          <div className="input-grid">

            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) =>
                setStudentId(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={(e) =>
                setStudentName(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) =>
                setSubjectName(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Class Time"
              value={classTime}
              onChange={(e) =>
                setClassTime(
                  e.target.value
                )
              }
            />
          </div>

          <textarea
            placeholder="Reason"
            value={reason}
            onChange={(e) =>
              setReason(
                e.target.value
              )
            }
          />

          <input
            type="date"
            value={requestDate}
            onChange={(e) =>
              setRequestDate(
                e.target.value
              )
            }
          />

          <div className="btn-group">

            <button
              className="submit-btn"
              onClick={
                handleSubmit
              }
            >
              Request Permission
            </button>

            <button
              className="status-btn"
              onClick={
                viewStatus
              }
            >
              View Status
            </button>

          </div>
        </div>

        {/* Requests */}
        <div className="requests-section">

          <h2>
            Your Requests
          </h2>

          {requests.length > 0 ? (

            requests.map(
              (request) => (

                <div
                  key={
                    request.request_id
                  }
                  className="request-card"
                >

                  <h3>
                    {
                      request.subject_name
                    }
                  </h3>

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

                </div>
              )
            )

          ) : (

            <p>
              No requests found
            </p>

          )}

        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;