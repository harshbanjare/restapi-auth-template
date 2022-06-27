import express from 'express';

import userRouter from './routes/user.js'

const app = express();




app.use('/user',userRouter)


//404 Not Found
app.use((req, res, next)=>{
    const err = new Error("404 Not Found");
    err.status = 404;
    next(err)
})


//Error Handling
app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.json({
        error: err.message
    })
})

export default app;