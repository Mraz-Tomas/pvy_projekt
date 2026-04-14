const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
    const { username, password, first_name, last_name, age, gender } = req.body;

    if (age < 13) return res.status(400).send("Too young");

    const hash = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (username, password, first_name, last_name, age, gender) VALUES (?, ?, ?, ?, ?, ?)",
        [username, hash, first_name, last_name, age, gender],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("OK");
        }
    );
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) => {
        if (result.length === 0) return res.status(400).send("User not found");

        const user = result[0];
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) return res.status(400).send("Wrong password");

        res.send(user);
    });
});

module.exports = router;