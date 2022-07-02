import 'dotenv/config';

export let database;

if (process.env.DEFAULT_DATABASE === "sqlite") {
    import("./database/sqlite/sqlite.js").then(module => {
        database = new module.default();

    });
} else if (process.env.DEFAULT_DATABASE === "firebase") {
    import("./database/firebase/firebase.js").then(module => {
        database = new module.default();
    });
}


