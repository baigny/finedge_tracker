import { loginUser , RegisterUser} from "../controllers/auth.controller";

const express = require("express");
const router = express.Router();

router.post("/users", RegisterUser)

router.post("/login", loginUser)

export default router;