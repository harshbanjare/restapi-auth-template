import bcrypt from 'bcrypt';
import db from '../../firebase.js'



//POST /user/login

export default async (req,res,next) => {
    res.status(200).json({message:"login route"})
}