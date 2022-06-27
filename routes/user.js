import express from "express";
import bcrypt from 'bcrypt';
import db from '../firebase.js'
import * as EmailValidator from 'email-validator';

const router = express.Router();

router.get("/",async (req, res, next)=>{
    res.status(200).json({response:"ok"})
})

router.post("/create",async (req, res, next)=>{
    const body = req.body;

    //placeholder profile picture
    body.pfp = body.pfp || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";



    //password validator
    if(!body.password || body.password.length < 8){
        const error = new Error("password must contain at least 8 characters")
        error.status = 400
        return next(error)
    }
    bcrypt.hash(body.password, 10, function(err, hash) {
        if (err){
            const error = new Error(err);
            error.status = 500
            return next(error)
        }
        body.hashed_password = hash
    });

    //email validator
    if (!EmailValidator.validate(body.email)){
        const err = new Error("Invalid Email")
        err.status = 400
        return next(err)
    }


    //username validator
    const username = body.username.toLowerCase();
    if (!username.match(/^[a-z0-9]+$/i)){
        const err = new Error("invalid username")
        err.status = 400
        return next(err)
    }
    const users_ref = db.collection('users')
    const username_query_ref = users_ref.where("username","==", username)
    const get_username = await username_query_ref.get()
    if(!get_username.empty){
        const err = new Error("username taken")
        err.status = 400
        return next(err)
    }
    body.finalUsername = username



    //final user object structure

    const user = {
        username: body.finalUsername,
        password: body.hashed_password,
        email: body.email,
        pfp : body.pfp
    }

    try{
        console.log(user)
        await db.collection('users').doc().set(user)
      }  catch (e){
        const err = new Error(e);
        err.status = 500
        return next(err)
    }

    res.status(200).json({
        message: "user created successfully"
    })

})


export default router;