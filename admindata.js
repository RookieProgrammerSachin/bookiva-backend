import { collection, getDocs } from "firebase/firestore";
import { db } from "./config.js";

var reservationData = []

const getAdminData = async (req, res) => {
    const id = req.body.id;
    if (id === "7JiwkV5dfQO602p5RuGLlOu7Av82"){
        
        const data = await getDocs(collection(db, "reservations"));
        data.docs.forEach(docdata => reservationData.push(docdata.data()));

        res.json(reservationData);
        reservationData = [];
    }
}

export { getAdminData }