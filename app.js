import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    createOffer,
    deleteOffer,
    getAllOffers,
    getAllTechnologies,
    getOfferById,
    searchOffers,
    updateOffer
} from "./repositories/offreRepository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// read the data sent by HTML forms (req.body)
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


// Turn the form fields into an offer object
function getOfferFromForm(form) {
    // one checked box = a string, several = an array. We want an array.
    let skills = form.skills;
    if (!skills) {
        skills = [];
    } else if (typeof skills === "string") {
        skills = [skills];
    }

    return {
        company: form.company,
        city: form.location,
        title: form.job_title,
        contractType: form.opp_type,
        workMode: form.work_mode,
        workMethod: form.work_method,
        remotePolicy: form.remote_policy,
        workAddress: form.work_address,
        companyDescription: form.description,
        missions: form.missions,
        startDate: form.start_date,
        durationMonths: form.duration,
        email: form.email,
        skills: skills
    };
}

// list + search + filters + sort
app.get("/", async (req, res) => {
    try {
        const filters = {
            keyword: req.query.keyword,
            city: req.query.city,
            contract: req.query.contract,
            workMode: req.query.workMode,
            technology: req.query.technology,
            sort: req.query.sort
        };

        const offers = await searchOffers(filters);
        const technologies = await getAllTechnologies();

        res.render("pages/index", { offers, technologies, filters });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

// Offer details
app.get("/offer-details.html", async (req, res) => {
    try {
        const offer = await getOfferById(req.query.id);
        if (!offer) {
            return res.status(404).send("Offre introuvable");
        }
        res.render("pages/offer-details", { offer });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

// Followed offers
app.get("/offer-suivies.html", (req, res) => {
    res.render("pages/offer-suivies");
});


// crud

//list all offers
app.get("/administration.html", async (req, res) => {
    try {
        const offers = await getAllOffers();
        res.render("pages/administration", { offers, message: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

// CREATE: show the empty form
app.get("/deposer-offer.html", (req, res) => {
    res.render("pages/deposer-offer", { offer: null, message: null, messageType: "success" });
});

// CREATE: save the form
app.post("/deposer-offer", async (req, res) => {
    try {
        await createOffer(getOfferFromForm(req.body));
        res.redirect("/administration.html");
    } catch (error) {
        console.error(error);
        res.status(500).send("Impossible d'enregistrer l'offre");
    }
});

// UPDATE: show the form filled with the offer
app.get("/offer-edit.html", async (req, res) => {
    try {
        const offer = await getOfferById(req.query.id);
        if (!offer) {
            return res.status(404).send("Offre introuvable");
        }
        res.render("pages/deposer-offer", { offer, message: null, messageType: "success" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

// UPDATE: save the changes
app.post("/offres/:id/update", async (req, res) => {
    try {
        await updateOffer(req.params.id, getOfferFromForm(req.body));
        res.redirect("/administration.html");
    } catch (error) {
        console.error(error);
        res.status(500).send("Impossible de modifier l'offre");
    }
});

// DELETE
app.post("/offres/:id/delete", async (req, res) => {
    try {
        await deleteOffer(req.params.id);
        res.redirect("/administration.html");
    } catch (error) {
        console.error(error);
        res.status(500).send("Impossible de supprimer l'offre");
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});