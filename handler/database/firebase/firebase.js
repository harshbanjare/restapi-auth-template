import {cert, initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';

import serviceAccount from './serviceAccount.js';


export default class Database {

    /**
     * Initializes the database.
     * @constructor
     */

    constructor() {
        console.log("Database: Firebase");
        initializeApp({credential: cert(serviceAccount)});
        this.db = getFirestore();
        this.users = this.db.collection("users");
        this.sessions = this.db.collection("sessions")
    }

    /**
     * Creates a new user in the database.
     * @method
     * @param {Object} user_object - The user object which contains username, email, password and pfp by default.
     * @return {WriteResult}
     * **/

    async create_user(user_object) {
        try {
            return await this.users.doc().set(user_object);
        } catch (e) {
            throw e;
        }

    }

    /**
     * Retrieves a user from a given username
     * @method
     * @param {String} username - The username of the user.
     * @return {Promise} - Resolves to an array with the user as the only element.
     * **/
    async get_user_by_username(username) {

        const user_retrieval_query = this.users.where("username", "==", username)
        const user_retrieval_query_snapshot = await user_retrieval_query.get()

        let user = [];

        user_retrieval_query_snapshot.forEach(data => user.push(data.data()))

        return user;


    }

    /**
     * Retrieves a user from a given email
     * @method
     * @param {String} email - The email of the user.
     * @return {Promise} - Resolves to an array with the user as the only element.
     * **/
    async get_user_by_email(email) {

        const user_retrieval_query = this.users.where("email", "==", email)
        const user_retrieval_query_snapshot = await user_retrieval_query.get()

        let user = [];

        user_retrieval_query_snapshot.forEach(data => user.push(data.data()))

        return user;


    }

    /**
     * Stores the given active session in database;
     * @method
     * @param {Object} session - The token object which contains the actual token along with other data.
     * @return {WriteResult}
     * **/

    async store_active_session(session) {
        try {
            return await this.sessions.doc().set(session);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Retrieves active session from a given token
     * @param {String} token - The JWT token.
     * @return {Promise}  - Resolves to an array containing the session object.
     * **/
    async get_active_session(token) {
        const query = this.sessions.where("token", "==", token);
        const query_snapshot = await query.get();
        let document_id = [];
        query_snapshot.forEach(data => {
            document_id.push({id: data.id, ...data.data()})
        })
        return document_id;
    }

    /**
     * Deletes Active Session from the database based on the given token
     * @param {String} token - The JWT token.
     * @return {Promise} - A Promise resolved with the write time of this delete operation.
     * **/
    async delete_active_session(token) {
        try {
            const session = await this.get_active_session(token);
            return await this.sessions.doc(String(session[0].id)).delete();
        } catch (e) {
            console.log(e)
            throw e;
        }
    }
}



