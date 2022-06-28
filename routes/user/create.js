import db from '../../firebase.js'
import * as EmailValidator from 'email-validator';
import bcrypt from "bcrypt";


// POST /user/create

export default async (req,res,next) =>{
    const body = req.body;
    const users_ref = db.collection('users');

    //placeholder profile picture
    body.pfp = body.pfp || process.env.PLACEHOLDER_PROFILE_PIC;


    //password validator
    if(!body.password || body.password.length < 8){
        const error = new Error("password must contain at least 8 characters");
        error.status = 400;
        return next(error)
    }

    bcrypt.hash(body.password, 10, function(err, hash) {
        if (err){
            const error = new Error(err);
            error.status = 500;
            return next(error)
        }
        body.hashed_password = hash;
    });



    //email validator
    if (!EmailValidator.validate(body.email)){
        const err = new Error("Invalid Email");
        err.status = 400;
        return next(err)
    }
    const email_existing_query_ref = users_ref.where("email","==", body.email);
    const email_existing_query_snapshot = await email_existing_query_ref.get();

    if(!email_existing_query_snapshot.empty){
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

    const username_existing_query_ref = users_ref.where("username","==", username)
    const username_existing_query_snapshot = await username_existing_query_ref.get()
    if(!username_existing_query_snapshot.empty){
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
        await users_ref.doc().set(user);
    }  catch (e){
        const err = new Error(e);
        err.status = 500;
        return next(err)
    }

    res.status(200).json({
        message: "user created successfully"
    });

}
