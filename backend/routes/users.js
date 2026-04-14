const router = require("express").Router();
const db = require("../db");

router.get("/", (req, res) => {
    db.query(`
        SELECT users.*, COUNT(posts.id) as post_count
        FROM users
        LEFT JOIN posts ON users.id = posts.user_id
        GROUP BY users.id
        ORDER BY last_name
    `, (err, result) => {
        res.send(result);
    });
});

module.exports = router;