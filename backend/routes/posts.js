const router = require("express").Router();
const db = require("../db");

router.get("/", (req, res) => {
    db.query(`
        SELECT posts.*, users.username 
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY created_at DESC
    `, (err, result) => {
        res.send(result);
    });
});

router.post("/", (req, res) => {
    const { user_id, title, content } = req.body;

    db.query(
        "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
        [user_id, title, content],
        () => res.send("Post added")
    );
});

module.exports = router;