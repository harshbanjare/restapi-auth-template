import express from 'express';
import morgan from 'morgan';
import bodyParser from "body-parser";

import userRouter from './routes/user.js'

const app = express();

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Handling CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})


// user ROUTE


app.use('/user', userRouter)


//404 Not Found
app.use((req, res, next) => {
    const err = new Error("404 Not Found");
    err.status = 404;
    next(err)
})

//Error Handling
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: err.message
    })
})

export default app;