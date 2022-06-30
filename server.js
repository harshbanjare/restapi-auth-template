import 'dotenv/config'
import http from 'http';
import app from "./app.js"

const PORT = process.env.PORT || 3001; //Default Port

const server = http.createServer(app);

server.listen(PORT)


