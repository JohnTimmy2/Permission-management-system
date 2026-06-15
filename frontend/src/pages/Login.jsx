import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const handleLogin =
    async () => {
      if (
        !email ||
        !password
      ) {
        alert(
          "Please fill all fields"
        );
        return;
      }

      try {
        const res =
          await axios.post(
            "http://localhost:5000/login",
            {
              email,
              password,
            }
          );

        const role =
          res.data.role
            .trim()
            .toLowerCase();

        if (
          role ===
          "student"
        ) {
          navigate(
            "/select-group"
          );

        } else if (
          role ===
          "lecturer"
        ) {
          navigate(
            "/lecturer"
          );

        } else if (
          role ===
          "admin"
        ) {
          navigate(
            "/admin"
          );

        } else {
          alert(
            "Unknown role: " +
              role
          );
        }

      } catch (err) {
        console.log(err);

        alert(
          "Invalid Email or Password"
        );
      }
    };

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="left-panel">

        <div className="overlay"></div>

        <div className="brand">
          <h1>
            Permission Request
            <span>.</span>
          </h1>

          <p>
            Smart permission
            management for
            students, lecturers,
            and administrators.
          </p>

          <div className="features">
            <p>
              Student request
              tracking
            </p>

            <p>
              Fast lecturer
              approvals
            </p>

            <p>
              Modern admin
              dashboard
            </p>
          </div>
        </div>

        <div className="big-text">
          ACCESS
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">

        <div className="login-card">

          <h2>
            Sign in.
          </h2>

          <p className="subtitle">
            Enter your credentials
            to continue.
          </p>

          <div className="input-group">
            <label>
              EMAIL
            </label>

            <input
              type="email"
              placeholder="admin@test.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          <div className="input-group">
            <label>
              PASSWORD
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </div>

          <button
            className="login-btn"
            onClick={
              handleLogin
            }
          >
            SIGN IN
          </button>

          <p className="register-text">
            Don’t have an
            account?{" "}
            <span
              onClick={() =>
                navigate(
                  "/register"
                )
              }
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;