import { doc, updateDoc, arrayRemove, arrayUnion, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./config.js";

const dummyData = [
    {
        "reserveId": "2cf45555363c409983dd",
        "reservedHall": "alpha-hall",
        "reservedBy": "muthuvel.rd@sairam.edu.in",
        "reservedOn": "06-06-2023",
        "startTime": "12:00",
        "status": "pending",
        "endTime": "04:00"
    },
    {
        "reserveId": "a0936b040c5c0b6e7852",
        "reservedBy": "sit21it062@sairamtap.edu.in",
        "reservedOn": "08-06-2023",
        "reservedHall": "beta-hall",
        "startTime": "09:00",
        "status": "pending",
        "endTime": "16:00"
    },
    {
        "reserveId": "e96985234303d0602ae0",
        "reservedOn": "09-06-2023",
        "status": "pending",
        "endTime": "11:45",
        "reservedBy": "hod.it@sairamit.edu.in",
        "reservedHall": "gamma-hall",
        "startTime": "10:00"
    },
    {
        "reservedHall": "beta-hall",
        "status": "pending",
        "startTime": "12:06",
        "endTime": "16:07",
        "reserveId": "f4899edb7506b2b82eec",
        "reservedBy": "hod.it@sairamit.edu.in",
        "reservedOn": "11-06-2023"
    },
    {
        "guest": "Palani Samy principal of SIT",
        "reservedBy": "sit21it063@sairamtap.edu.in",
        "purpose": "Orientation ennamo edho ennam thirlaudhu kanavil. petti erindhurum nodiyil",
        "startTime": "12:00",
        "reserverName": "Sachin",
        "seats": "200",
        "reservedOn": "06-06-2023",
        "reservedHall": "SSR Hall",
        "status": "pending",
        "endTime": "16:00",
        "reserveId": "4628bfd9221a9f29a9de"
    }
];

const slugify = str => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''); 

// const req = {
//     "body":
// }

const acceptRequest = async (req, res) => {
    // fetch reservations data
    // pending, accepted, denied nu vechiko
    // currData = pending la filter and take that alone
    // arrayRemove() that from pending
    // set status of currData to accepted
    // accepted doc la updateDoc
    // user reservation Doc layum update pannu
    // carddata layum update karo
    // change reserveDB to NOT set reservation[] from booking data

    const id = req.body.id;
    const reservationId = req.body.reserveId;
    var reservationsData = [];

    if (id === "7JiwkV5dfQO602p5RuGLlOu7Av82"){
        try {
            const data = await getDocs(collection(db, "reservations"));
            data.docs.forEach(docdata => reservationsData.push(docdata.data()));

            const allowedData = reservationsData[0];
            const deniedData = reservationsData[1];
            const pendingData = reservationsData[2];

            const currentRequestData = pendingData.reservation.filter( reqData => reqData.reserveId === reservationId )[0];

            const pendingDocRef = doc(db, "reservations", "pending");
            const allowedDocRef = doc(db, "reservations", "allowed");
            const deniedDocRef = doc(db, "reservations", "denied"); // actually deny route la dhane use pannanu

            const userDocRef = doc(db, "user-data", currentRequestData.reservedBy);
            const cardDocRef = doc(db, "card-data", slugify(currentRequestData.reservedHall));

            await updateDoc(pendingDocRef, {
                reservation: arrayRemove(currentRequestData)
            });
            console.log("removed from pending");

            await updateDoc(userDocRef, {
                reservations: arrayRemove(currentRequestData)
            });
            console.log("userdata removed");

            currentRequestData.status = "accepted";

            await updateDoc(allowedDocRef, {
                reservation: arrayUnion(currentRequestData)
            });
            console.log("added to accepted");

            await updateDoc(userDocRef, {
                reservations: arrayUnion(currentRequestData) 
            });
            console.log("updated user doc");

            delete currentRequestData.reservedHall;
            currentRequestData.status = "pending";

            await updateDoc(cardDocRef, {
                reservations: arrayRemove(currentRequestData)
            });

            currentRequestData.status = "accepted";

            await updateDoc(cardDocRef, {
                reservations: arrayUnion(currentRequestData)
            });

            console.log("changed card data");

            res.json(currentRequestData);

        } catch(err) {
            console.log(err);
            res.json(err);
        }
    }
}

export { acceptRequest }