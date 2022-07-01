import sqlite3 from 'sqlite3';
import { open } from "sqlite";


class Database {
    constructor () {
        return (async () => {
            this.database_name = "sqlite";
            this.db = await open({ filename: "./database.db", driver: sqlite3.Database });
            return this;
        })();
    }

}



export default Database;





