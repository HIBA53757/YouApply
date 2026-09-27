import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createOffer, getAllOffers, getOfferById, getOffersByIds } from "./repositories/offreRepository.js";

const __filename = fileURLToPath(import.meta.url); //url of this file to window path
const __dirname = path.dirname(__filename);  //folder path


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/offres", async (req, res) => {
    try {
        const rawIds = String(req.query.ids || "");
        const ids = rawIds.split(",").filter(Boolean).map(Number);
        if (ids.some((id) => !Number.isSafeInteger(id) || id < 1)) {
            return res.status(400).json({ error: "Identifiants d'offres invalides" });
        }
        return res.json(await getOffersByIds([...new Set(ids)]));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Impossible de charger les offres" });
    }
});

app.post("/deposer-offer", async (req, res) => {
    const form = req.body || {};
    const requiredFields = ["company", "location", "job_title", "opp_type", "work_mode",
        "description", "missions", "start_date", "duration", "email"];
    const durationMonths = Number.parseInt(form.duration, 10);

    if (requiredFields.some((field) => typeof form[field] !== "string" || !form[field].trim())
        || !["stage", "alternance"].includes(form.opp_type)
        || !["presentiel", "hybride", "remote"].includes(form.work_mode)
        || ![1, 2, 3, 4, 6, 12, 24].includes(durationMonths)
        || !/^\d{4}-\d{2}-\d{2}$/.test(form.start_date)) {
        return res.status(400).render("pages/deposer-offer", {
            message: "Vérifiez les champs obligatoires du formulaire.",
            messageType: "error",
        });
    }

    const skills = Array.isArray(form.skills) ? form.skills : form.skills ? [form.skills] : [];
    const offer = {
        company: form.company.trim(),
        city: form.location.trim(),
        title: form.job_title.trim(),
        contractType: form.opp_type,
        workMode: form.work_mode,
        workMethod: form.work_method?.trim() || null,
        remotePolicy: form.remote_policy?.trim() || null,
        workAddress: form.work_address?.trim() || null,
        companyDescription: form.description.trim(),
        missions: form.missions.trim(),
        startDate: form.start_date,
        durationMonths,
        email: form.email.trim(),
        skills: [...new Set(skills.map((skill) => skill.trim()).filter(Boolean))],
    };

    try {
        await createOffer(offer);
        return res.redirect(303, "/deposer-offer.html?status=created");
    } catch (error) {
        console.error(error);
        return res.status(500).render("pages/deposer-offer", {
            message: "Impossible d'enregistrer l'offre pour le moment.",
            messageType: "error",
        });
    }
});

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
    res.render("pages/deposer-offer", {
        message: req.query.status === "created" ? "Offre enregistrée avec succès." : null,
        messageType: "success",
    });
});

app.get("/administration.html", (req, res) => {
    res.render("pages/administration");
});

app.get("/offer-details.html", async (req, res) => {
    try {
        const offerId = req.query.id;
        const offer = await getOfferById(offerId);

        if (!offer) {
            return res.status(404).send("Offre introuvable");
        }

        res.render("pages/offer-details", { offer });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
