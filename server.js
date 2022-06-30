import 'dotenv/config'
import http from 'http';
import app from "./app.js"

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const server = http.createServer(app);

console.log(`Starting server on ${HOST}:${PORT}`);
server.listen(PORT, HOST);


