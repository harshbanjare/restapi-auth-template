import "dotenv/config";
import * as EmailValidator from 'email-validator';
import bcrypt from "bcrypt";
import {database} from "../../handler/database.js";

// POST /user/create

export default async (req,res,next) =>{
    const body = req.body;
    console.log("req body",body)

    //placeholder profile picture
    body.pfp = body.pfp || process.env.PLACEHOLDER_PROFILE_PIC;


    //password validator
    if(!body.password || body.password.length < 8){
        const error = new Error("password must contain at least 8 characters");
        error.status = 400;
        return next(error)
    }

    body.hashed_password = await bcrypt.hash(body.password, 10);

    //email validator
    if (!EmailValidator.validate(body.email)){
        const err = new Error("Invalid Email");
        err.status = 400;
        return next(err)
    }

    const email_check = await database.get_user_by_email(body.email);

    if(email_check.length > 0){
        const err = new Error("Email Already In Use");
        err.status = 400;
        return next(err)
    }



    //username validator
    if (!body.username) {
        const err = new Error("missing username");
        err.status = 400;
        return next(err)
    }

    const username = body.username.toLowerCase();
    if (!username.match(/^[a-z\d]+$/i)){
        const err = new Error("invalid username");
        err.status = 400;
        return next(err)
    }

    const username_check = await database.get_user_by_username(username);
    if(username_check.length > 0){
        const err = new Error("Username taken");
        err.status = 400;
        return next(err)
    }


    body.finalUsername = username;


    //final user object structure

    const user = {
        username: body.finalUsername,
        password: body.hashed_password,
        email: body.email,
        pfp : body.pfp
    }
    try{
        console.log(user);
        const result = await database.create_user(user);
        console.log(result)
    }  catch (e){
        const err = new Error(e);
        err.status = 500;
        return next(err)
    }

    res.status(200).json({
        message: "user created successfully"
    });

}
