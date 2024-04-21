import { Router } from "express";
const router = Router();
router.post("/login", (req, res) => res.send("Ha entrado al login"));
export default router;
