import 'dotenv/config'
import bcrypt from 'bcrypt';
import db from '../../firebase.js';
import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';



//POST /user/login

export default async (req,res,next) => {

    const id = req.body.id; // Both Email and Username based logins are supported
    const password = req.body.password;

    const users_ref = db.collection('users');
    const session_ref = db.collection('sessions')

    const invalid_credentials_error = new Error("invalid username or password");
    invalid_credentials_error.status = 400;

    if(!(id && password)) return next(invalid_credentials_error);

    const user_query = EmailValidator.validate(id) ? users_ref.where("email", "==",id) : users_ref.where("username", "==", id);

    const user_query_snapshot = await user_query.get();

    if(user_query_snapshot.size !== 1) return next(invalid_credentials_error);

    let target_user;
    user_query_snapshot.forEach(data => {
        target_user = data.data()
    });

    const valid_password = await bcrypt.compare(password, target_user.password);

    if (!valid_password) return next(invalid_credentials_error);

    const token = jwt.sign({username : target_user.username, email : target_user.email}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.SESSION_MAX_DURATION || "7d"});


    //Storing valid tokens as active sessions in database

    //session object structure
    const session = {
        username : target_user.username,
        token : token,
        creation_timestamp : Date.now(),
        expires_in : process.env.SESSION_MAX_DURATION || "7d"
    }

    try {
        await session_ref.doc().set(session)
    }catch (e) {
        const err = new Error("Internal Server Error");
        err.status = 500;
        return next(err)
    }

    res.status(200).json({
        message:'login success',
        token: token,
        username: target_user.username
    });

    }