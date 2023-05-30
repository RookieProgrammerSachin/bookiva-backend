import { doc, setDoc } from "firebase/firestore";
import { db } from "./config.js";

const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const addHall = async (req, res) => {
    const hallData = req.body;
    try {
        await setDoc(doc(db, "card-data", slugify(req.body.hallName)), hallData);
        res.status(200).json({
            "status": "added hall"
        });
    } catch(err) {
        console.log(err);
        res.status(400).send(err);
    }
}

export { addHall }