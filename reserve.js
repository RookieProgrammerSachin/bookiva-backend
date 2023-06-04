import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { randomBytes, } from "crypto";
import { db } from "./config.js";

const slugify = str => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''); 

// {
//     "reservedHall": "beta-hall",
//     "reservedBy": "hod.it@sairamit.edu.in",
//     "reservedOn": "11-06-2023",
//     "endTime": "16:07",
//     "status": "pending",
//     "startTime": "12:06",
//     "reserveId": "f4899edb7506b2b82eec"
//   }

const reserveHall = async (req, res) => {
    // console.log(req.body);
    const hallName = req.body.hall;

    const reservationData = {
        "reserveId": randomBytes(10).toString("hex"),
        "reservedBy": req.body.id,
        "reservedOn": req.body.date,
        "startTime": req.body.start,
        "endTime": req.body.end,
        "reserverName": req.body.name,
        "purpose": req.body.purpose,
        "seats": req.body.seats,
        "guest": (req.body.guest || "None"),
        "status": "pending"
    }

    try {
        await updateDoc(doc(db, "card-data", slugify(hallName)), {
            reservations: arrayUnion(reservationData)
        });
        await updateDoc(doc(db, "reservations", "pending"), {
            reservation: arrayUnion({
                "reservedHall": hallName, 
                ...reservationData
            })
        });
        await setDoc(doc(db, "user-data", reservationData.reservedBy), {
            hasResetPwd: true,
            hasReserved: false,
            reservations: arrayUnion({
                "reservedHall": hallName,
                ...reservationData
            })
        }, { merge: true });
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