import express from "express";
import db from '../firebase.js'
import create from './user/create.js'
import login from './user/login.js'

const router = express.Router();

router.get("/",async (req, res, next)=>{
    res.status(200).json({response:"ok"});
})

router.post("/create",create);

router.post("/login",login);


export default router;