import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllOffers } from "./repositories/offreRepository.js";

const __filename = fileURLToPath(import.meta.url); //url of this file to window path
const __dirname = path.dirname(__filename);  //folder path


const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
    try {
        const offers = await getAllOffers();

        const technologiesSet = new Set();
        offers.forEach((offer) => {
            const skills = Array.isArray(offer.skills)
                ? offer.skills
                : offer.skills
                    ? String(offer.skills).split(",").map((s) => s.trim()).filter(Boolean)
                    : [];
            skills.forEach((skill) => technologiesSet.add(skill));
        });

        res.render("pages/index", {
            offers,
             technologies: Array.from(technologiesSet),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

app.get("/offer-suivies.html", (req, res) => {
    res.render("pages/offer-suivies");
});

app.get("/deposer-offer.html", (req, res) => {
    res.render("pages/deposer-offer");
});

app.get("/administration.html", (req, res) => {
    res.render("pages/administration");
});

app.get("/offer-details.html", (req, res) => {
    res.render("pages/offer-details");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});