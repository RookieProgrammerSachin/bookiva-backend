import express from "express";
import cors from "cors";

import { db } from "./config.js";
import { getHalls } from "./carddata.js";
import { getUsers } from "./userdata.js";
import { reserveHall } from "./reserve.js";
import { addHall } from "./addhall.js";
import { getAdminData } from "./admindata.js";
import { acceptRequest } from "./adminaccept.js";
import { denyRequest } from "./admindeny.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/", (req, res) => {
    console.log("Base API called");
    res.json(db.app.automaticDataCollectionEnabled);
});

// const d = {
//     "reservations": [{ "endTime": "4:00", "reservedOn": "6-6-2023", "reservedBy": "sit21it063@sairamtap.edu.in", "startTime": "11:00", "status": "pending" }],
//     "campus": "Sairam Engineering College",
//     "seatingCapacity": 100, 
//     "imgUrl": "https://picsum.photos/400",
//     "projectorAvailable": true,
//     "hallName": "Alpha Hall",
//     "hasAC": true, 
//     "rating": 4.6,
//     "distFromGate": 600,
//     "isAvailable": false,
//     "carouselPics": ["https://www.dbsindia.com/images/conference-room/conference-room1.jpg", "https://www.inspireofficespaces.com/web/image/4393-b63cd18f/Conference-room-in-chennai.png"]
// }

app.post("/api/admin-data", getAdminData);

app.post("/api/admin-accept", acceptRequest);

app.post("/api/admin-deny", denyRequest);

app.post("/api/add-hall", addHall);

app.get("/api/halls/", getHalls);

app.get("/api/users/", getUsers);

app.post("/api/book/", reserveHall);

app.listen(3000, () => {
    console.log("Up and running");
});