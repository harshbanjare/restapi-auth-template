import express from "express";

import create from './user/create.js'
import login from './user/login.js'
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/", checkAuth, async (req, res, next)=>{
    res.status(200).json({response:"ok"});
})

router.post("/create",create);

router.post("/login",login);


export default router;