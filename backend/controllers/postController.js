import { db } from "../config/db.js";

export const getPosts = (req, res) => {
  const userId = req.session.user.id;

  db.query(`
    SELECT posts.*, users.username,
    (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) as likes,
    CASE WHEN posts.user_id = ? THEN 1 ELSE 0 END as isOwner
    FROM posts
    JOIN users ON users.id = posts.user_id
    ORDER BY posts.created_at DESC
  `, [userId], (err, r) => {
    res.json(r);
  });
};

export const createPost = (req, res) => {
  const { text } = req.body;
  const userId = req.session.user.id;

  db.query(
    "INSERT INTO posts (user_id,text) VALUES (?,?)",
    [userId, text],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("created");
    }
  );
};
export const getComments = (req, res) => {
  const { postId } = req.params;

  db.query(`
    SELECT comments.*, users.username
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE post_id = ?
    ORDER BY created_at DESC
  `, [postId], (err, r) => {
    res.json(r);
  });
};

export const addComment = (req, res) => {
  const userId = req.session.user.id;
  const { postId, text } = req.body;

  db.query(
    "INSERT INTO comments (user_id, post_id, text) VALUES (?,?,?)",
    [userId, postId, text],
    () => res.json("ok")
  );
};

export const likePost = (req, res) => {
  const userId = req.session.user.id;
  const { postId } = req.body;

  db.query(
    "INSERT INTO likes (user_id,post_id) VALUES (?,?)",
    [userId, postId],
    (err) => {
      if (err) return res.status(400).json("already liked");
      res.json("liked");
    }
  );
};

export const deletePost = (req, res) => {
  const userId = req.session.user.id;
  const { id } = req.params;

  db.query(
    "DELETE FROM posts WHERE id=? AND user_id=?",
    [id, userId],
    () => res.json("deleted")
  );
};

export const updatePost = (req, res) => {
  const userId = req.session.user.id;
  const { id } = req.params;
  const { text } = req.body;

  db.query(
    "UPDATE posts SET text=? WHERE id=? AND user_id=?",
    [text, id, userId],
    () => res.json("updated")
  );
};