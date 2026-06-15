import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [name, setName] =
    useState("");

  const [id, setId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("student");

  const navigate =
    useNavigate();

  const handleRegister =
    async () => {

      // Empty fields
      if (
        !name ||
        !id ||
        !email ||
        !password
      ) {
        alert(
          "Please fill all fields"
        );
        return;
      }

      // Name validation
      const nameRegex =
        /^[A-Za-z\s]+$/;

      if (
        !nameRegex.test(name)
      ) {
        alert(
          "Name can only contain letters"
        );
        return;
      }

      // ID validation
      const idRegex =
        /^[0-9]{6}$/;

      if (
        !idRegex.test(id)
      ) {
        alert(
          "ID must be exactly 6 numbers"
        );
        return;
      }

      // Email validation
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(email)
      ) {
        alert(
          "Invalid email format"
        );
        return;
      }

      // Password validation
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (
        !passwordRegex.test(
          password
        )
      ) {
        alert(
          "Password must be 8+ characters with uppercase, lowercase, and number"
        );
        return;
      }

      try {
        const res =
          await axios.post(
            "http://localhost:5000/register",
            {
              user_id: id,
              name,
              email,
              password,
              role,
            }
          );

        alert(
          "Register Successful!"
        );

        // Clear form
        setName("");
        setId("");
        setEmail("");
        setPassword("");
        setRole(
          "student"
        );

        // Go to Login page
        navigate("/");

      } catch (err) {
        console.log(err);
        alert(
          "Register Failed"
        );
      }
    };

  return (
    <div className="register-container">

      <div className="register-card">

        <h2>
          Register
        </h2>

        <p>
          Create your account
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="6-digit ID"
          value={id}
          onChange={(e) =>
            setId(
              e.target.value
            )
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
        >
          <option value="student">
            Student
          </option>

          <option value="lecturer">
            Lecturer
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <button
          className="register-btn"
          onClick={
            handleRegister
          }
        >
          Register
        </button>

      </div>

    </div>
  );
}

export default Register;