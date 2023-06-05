import { doc, updateDoc, arrayRemove, arrayUnion, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./config.js";

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
    const mode = req.body.mode;
    var reservationsData = [];

    console.log(req.body);

    if (id === "7JiwkV5dfQO602p5RuGLlOu7Av82"){
        try {
            const data = await getDocs(collection(db, "reservations"));
            data.docs.forEach(docdata => reservationsData.push(docdata.data()));

            // console.log(reservationsData);

            const allowedData = reservationsData[0];
            const deniedData = reservationsData[1];
            const pendingData = reservationsData[2];

            console.log("allowedData",allowedData, "deniedData",deniedData, "pendingData",pendingData);

            // if potu check pannu.. if mode is 0, then currentReqdata, else deniedReqData
            // adhukapro if vechiye dhaan 
            const currentRequestData = pendingData.reservation.filter( reqData => reqData.reserveId === reservationId )[0];
            const deniedRequestData = deniedData.reservation.filter( reqData => reqData.reserveId === reservationId )[0];
            const allowedRequestData = allowedData.reservation.filter( reqData => reqData.reserveId === reservationId )[0];

            console.log("currentRequestData",currentRequestData, "deniedRequestData",deniedRequestData, "allowedRequestData",allowedRequestData);

            const pendingDocRef = doc(db, "reservations", "pending");
            const allowedDocRef = doc(db, "reservations", "allowed");
            const deniedDocRef = doc(db, "reservations", "denied"); // actually deny route la dhane use pannanu

            const userDocRef = doc(db, "user-data", currentRequestData.reservedBy);
            const cardDocRef = doc(db, "card-data", slugify(currentRequestData.reservedHall));

            // await updateDoc(pendingDocRef, {
            //     reservation: arrayRemove(currentRequestData)
            // });
            // console.log("removed from pending");  

            // // denied landhu remove

            // await updateDoc(userDocRef, {
            //     reservations: arrayRemove(currentRequestData)
            // });
            // console.log("userdata removed");

            // currentRequestData.status = "accepted";

            // await updateDoc(allowedDocRef, {
            //     reservation: arrayUnion(currentRequestData)
            // });
            // console.log("added to accepted");

            // await updateDoc(userDocRef, {
            //     reservations: arrayUnion(currentRequestData) 
            // });
            // console.log("updated user doc");

            // delete currentRequestData.reservedHall;

            // // await updateDoc(cardDocRef, {
            // //     reservations: arrayRemove(currentRequestData)
            // // });

            // await updateDoc(cardDocRef, {
            //     reservations: arrayUnion(currentRequestData)
            // });

            // console.log("changed card data");

            reservationsData = [];
            res.status(200).json({
                status: "Successfully accepted"
            });

        } catch(err) {
            console.log(err);
            res.status(400).json({
                status: "Error in accepting"
            });
        }
    }
}

export { acceptRequest }