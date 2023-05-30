import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { randomBytes } from "crypto";
import { db } from "./config.js";

const reserveHall = async (req, res) => {
    const hallName = req.body.hall;

    const reservationData = {
        "reserveId": randomBytes(10).toString("hex"),
        "reservedBy": req.body.id,
        "reservedOn": req.body.date,
        "startTime": req.body.start,
        "endTime": req.body.end,
        "status": "pending"
    }

    try {
        await updateDoc(doc(db, "card-data", hallName), {
            reservations: arrayUnion(reservationData)
        });
        await updateDoc(doc(db, "reservations", "pending"), {
            reservation: arrayUnion({
                "reservedHall": hallName, 
                ...reservationData
            })
        });
        await updateDoc(doc(db, "user-data", reservationData.reservedBy), {
            reservations: arrayUnion({
                "reservedHall": hallName,
                ...reservationData
            })
        });
        res.status(200).json({
            "result": "Success"
        });

    } catch(err) {
        console.log(err);
        res.status(400).json({
            "result": "There was an unexpected error. Please try again"
        });
    }
    
}

export { reserveHall };