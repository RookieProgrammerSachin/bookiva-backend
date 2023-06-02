import { getDocs, collection } from "firebase/firestore";
import { db } from "./config.js";

var users = [];

const getUsers = async (req, res) => {
    const dbSnapShot = await getDocs(collection(db, "user-data"));
    dbSnapShot.forEach((snap) => {
        users.push({"id": snap.id, ...snap.data()});
    });
    res.json(users);
    // console.log(users);
    users = [];
}

export { getUsers }