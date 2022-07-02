import 'dotenv/config';
import sqlite3 from 'sqlite3';

export default class Database {

    /**
     * Initializes the database.
     * @constructor
     * **/
    constructor() {
        console.log("Database: Sqlite")
        this.db = new sqlite3.Database(process.env.PATH_TO_DATABASE_SQLITE)
        //create table users
        this.db.exec(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(255),
                email VARCHAR(255),
                password VARCHAR(255),
                pfp VARCHAR(512)
                )`);

        // create table sessions
        this.db.exec(`CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(255),
                token VARCHAR(512),
                creation_timestamp INTEGER,
                expires_in INTEGER
                )`);

    }

    /**
     * Creates a new user in the database.
     * @method
     * @param {Object} user_object - The user object which contains username, email, password and pfp by default.
     * @return {Promise}
     * **/

    async create_user(user_object) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO users (username, email, password, pfp) VALUES ('${user_object.username}', '${user_object.email}', '${user_object.password}', '${user_object.pfp}')`, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        })
    }

    /**
     * Retrieves a user from a given username.
     * @method
     * @param {String} username - The username of the user.
     * @return {Promise} - Resolves to an array with the user as the element.
     * **/
    async get_user_by_username(username) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM users WHERE username='${username}'`, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        })
    }

    /**
     * Retrieves a user from a given email.
     * @method
     * @param email
     * @return {Promise} - Resolves to an array with the user as the element.
     */
    async get_user_by_email(email) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM users WHERE email='${email}'`, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        })

    }

    /**
     * Retrieves a user from a given token.
     * @method
     * @param session_object - The session object which contains username, token, creation_timestamp and expires_in by default.
     * @return {Promise<unknown>} - Resolves to an array with the user as the element.
     */
    async store_active_session(session_object) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO sessions (username, token, creation_timestamp, expires_in) VALUES ('${session_object.username}', '${session_object.token}', '${session_object.creation_timestamp}', '${session_object.expires_in}')`, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
    }



    /**
     * Retrieves active session from a given token
     * @param {String} token - The JWT token.
     * @return {Promise}  - Resolves to an array containing the session object.
     * **/
    async get_active_session(token) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM sessions WHERE token='${token}'`, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        })

    }


    /**
     * Deletes Active Session from the database based on the given token
     * @param {String} token - The JWT token.
     * @return {Promise} - A Promise resolved with the write time of this delete operation.
     * **/

    async delete_active_session(token) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM sessions WHERE token='${token}'`, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
    }

}




