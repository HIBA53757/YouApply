import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createOffer, deleteOffer, getAllOffers, getAllTechnologies, getOfferById, getOffersByIds, searchOffers, updateOffer } from "./repositories/offreRepository.js";

const __filename = fileURLToPath(import.meta.url); //url of this file to window path
const __dirname = path.dirname(__filename);  //folder path


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

function getOfferFromForm(form) {
    const requiredFields = ["company", "location", "job_title", "opp_type", "work_mode",
        "description", "missions", "start_date", "duration", "email"];
    const durationMonths = Number.parseInt(form.duration, 10);

    if (requiredFields.some((field) => typeof form[field] !== "string" || !form[field].trim())
        || !["stage", "alternance"].includes(form.opp_type)
        || !["presentiel", "hybride", "remote"].includes(form.work_mode)
        || ![1, 2, 3, 4, 6, 12, 24].includes(durationMonths)
        || !/^\d{4}-\d{2}-\d{2}$/.test(form.start_date)) {
        return null;
    }

    const skills = Array.isArray(form.skills) ? form.skills : form.skills ? [form.skills] : [];
    return {
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
}

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
    const offer = getOfferFromForm(req.body || {});
    if (!offer) {
        return res.status(400).render("pages/deposer-offer", {
            message: "Vérifiez les champs obligatoires du formulaire.",
            messageType: "error",
            offer: null,
        });
    }

    try {
        await createOffer(offer);
        return res.redirect(303, "/deposer-offer.html?status=created");
    } catch (error) {
        console.error(error);
        return res.status(500).render("pages/deposer-offer", {
            message: "Impossible d'enregistrer l'offre pour le moment.",
            messageType: "error",
            offer: null,
        });
    }
});

app.get("/offer-edit.html", async (req, res) => {
    try {
        const id = Number(req.query.id);
        if (!Number.isSafeInteger(id) || id < 1) return res.status(400).send("Identifiant invalide");
        const offer = await getOfferById(id);
        if (!offer) return res.status(404).send("Offre introuvable");
        return res.render("pages/deposer-offer", { offer, message: null, messageType: "success" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur serveur");
    }
});

app.post("/offres/:id/update", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).send("Identifiant invalide");
    const offer = getOfferFromForm(req.body || {});
    if (!offer) {
        return res.status(400).render("pages/deposer-offer", {
            offer: await getOfferById(id),
            message: "Vérifiez les champs obligatoires du formulaire.",
            messageType: "error",
        });
    }

    try {
        if (!await getOfferById(id)) return res.status(404).send("Offre introuvable");
        await updateOffer(id, offer);
        return res.redirect(303, "/administration.html?status=updated");
    } catch (error) {
        console.error(error);
        return res.status(500).render("pages/deposer-offer", {
            offer: await getOfferById(id),
            message: "Impossible de modifier l'offre pour le moment.",
            messageType: "error",
        });
    }
});

app.post("/offres/:id/delete", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isSafeInteger(id) || id < 1) return res.status(400).send("Identifiant invalide");
        const deleted = await deleteOffer(id);
        if (!deleted) return res.status(404).send("Offre introuvable");
        return res.redirect(303, "/administration.html?status=deleted");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Impossible de supprimer l'offre");
    }
});

app.get("/", async (req, res) => {
    try {
        const list = (value) => (Array.isArray(value) ? value : value ? [value] : [])
            .filter((item) => typeof item === "string");
        const validModes = ["hybride", "remote", "presentiel"];
        const filters = {
            keyword: typeof req.query.keyword === "string" ? req.query.keyword.trim().slice(0, 100) : "",
            city: typeof req.query.city === "string" ? req.query.city.trim().slice(0, 100) : "",
            contract: typeof req.query.contract === "string"
                && ["stage", "alternance"].includes(req.query.contract) ? req.query.contract : "all",
            workModes: list(req.query.workMode).filter((mode) => validModes.includes(mode)),
            technologies: list(req.query.technology).filter((technology) => technology.length <= 100),
            sort: req.query.sort === "oldest" ? "oldest" : "recent",
        };
        const [offers, technologies] = await Promise.all([
            searchOffers(filters),
            getAllTechnologies(),
        ]);

        res.render("pages/index", {
            offers,
            technologies,
            filters,
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
        offer: null,
    });
});

app.get("/administration.html", async (req, res) => {
    try {
        const offers = await getAllOffers();
        const messages = {
            updated: "Offre modifiée.",
            deleted: "Offre supprimée.",
        };
        res.render("pages/administration", { offers, message: messages[req.query.status] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
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
