import { getDocs, collection } from "firebase/firestore";
import { db } from "./config.js";

var halls = [];

const getHalls = async (req, res) => {
    const dbSnapShot = await getDocs(collection(db, "card-data"));
    dbSnapShot.forEach((snap) => {
        halls.push(snap.data());
    });
    res.json(halls);
    // console.log(halls);
    halls = [];
}

export { getHalls }