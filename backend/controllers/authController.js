import bcrypt from "bcrypt";
import { db } from "../config/db.js";

// REGISTER
export const register = async (req, res) => {
  const { username, password, age } = req.body;

  if (age < 13) return res.status(400).json("Too young");

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password_hash, age) VALUES (?, ?, ?)",
    [username, hash, age],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json("error");
      }
      res.json("ok");
    }
  );
};

// LOGIN
export const login = (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, r) => {
    if (err || r.length === 0) return res.status(400).json("fail");

    const user = r[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) return res.status(400).json("fail");

    req.session.user = {
      id: user.id,
      username: user.username
    };

    console.log("SESSION SET:", req.session.user);

    res.json("logged");
  });
};