import { db } from "../config/db.js";

export const getUsers = (req, res) => {
  db.query(`
    SELECT users.*,
    COUNT(posts.id) as post_count
    FROM users
    LEFT JOIN posts ON posts.user_id = users.id
    GROUP BY users.id
    ORDER BY users.last_name
  `, (err, r) => res.json(r));
};