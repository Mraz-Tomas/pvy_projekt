import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json("Not logged");
  }

  res.json(req.session.user);
});
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json("logged out");
});
export default router;