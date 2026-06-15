import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend Running");
});

/* =========================
   REGISTER
========================= */
app.post("/register", (req, res) => {
  const {
    user_id,
    name,
    email,
    password,
    role,
  } = req.body;

  const sql =
    "INSERT INTO users (user_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [
      user_id,
      name,
      email,
      password,
      role,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json("Database Error");
      }

      res.json(
        "User Registered Successfully"
      );
    }
  );
});

/* =========================
   LOGIN
========================= */
app.post("/login", (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ?";

  db.query(
    sql,
    [email],
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json("Database Error");
      }

      if (result.length === 0) {
        return res
          .status(401)
          .json(
            "Email not found"
          );
      }

      if (
        result[0].password !==
        password
      ) {
        return res
          .status(401)
          .json(
            "Wrong Password"
          );
      }

      res.json({
        message:
          "Login Success",
        role:
          result[0].role,
      });
    }
  );
});

/* =========================
   SUBMIT REQUEST
========================= */
app.post("/request", (req, res) => {
  const {
    student_id,
    student_name,
    group_name,
    reason,
    request_date,
    subject_name,
    class_time,
  } = req.body;

  const sql = `
    INSERT INTO requests
    (
      student_id,
      student_name,
      group_name,
      reason,
      request_date,
      subject_name,
      class_time,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      student_id,
      student_name,
      group_name,
      reason,
      request_date,
      subject_name,
      class_time,
      "Pending",
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json("Database Error");
      }

      res.json(
        "Request Submitted Successfully"
      );
    }
  );
});

/* =========================
   GET ALL REQUESTS
========================= */
app.get("/requests", (req, res) => {
  const sql =
    "SELECT * FROM requests";

  db.query(
    sql,
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json(
            "Database Error"
          );
      }

      res.json(result);
    }
  );
});

/* =========================
   UPDATE STATUS
========================= */
app.put(
  "/request-status",
  (req, res) => {
    const {
      id,
      status,
    } = req.body;

    const sql =
      "UPDATE requests SET status = ? WHERE request_id = ?";

    db.query(
      sql,
      [status, id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json(
              "Database Error"
            );
        }

        res.json(
          "Status Updated Successfully"
        );
      }
    );
  }
);

/* =========================
   STUDENT REQUESTS
========================= */
app.get(
  "/student-requests/:studentId",
  (req, res) => {
    const {
      studentId,
    } = req.params;

    const sql =
      "SELECT * FROM requests WHERE student_id = ?";

    db.query(
      sql,
      [studentId],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json(
              "Database Error"
            );
        }

        res.json(result);
      }
    );
  }
);

/* =========================
   DELETE REQUEST
========================= */
app.delete(
  "/delete-request/:id",
  (req, res) => {
    const id =
      req.params.id;

    const sql =
      "DELETE FROM requests WHERE request_id = ?";

    db.query(
      sql,
      [id],
      (err, result) => {
        if (err) {
          console.log(
            "Delete Error:",
            err
          );

          return res
            .status(500)
            .json(
              "Delete Failed"
            );
        }

        if (
          result.affectedRows === 0
        ) {
          return res
            .status(404)
            .json(
              "Request Not Found"
            );
        }

        res.json(
          "Request Deleted Successfully"
        );
      }
    );
  }
);

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});