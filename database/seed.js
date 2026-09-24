import db from "./connection.js";

const entreprises = [
    ["H2C Development"],
    ["Highness"],
    ["YouCode"],
    ["Tech Solutions"],
    ["Digital Factory"],
];

const technologies = [
    ["HTML"],
    ["CSS"],
    ["JavaScript"],
    ["PHP"],
    ["MySQL"],
    ["React"],
    ["Figma"],
    ["Git / GitHub"],
];

const offres = [
    [
        1,
        "Développeur Web Full Stack",
        "stage",
        "Nador",
        "hybride",
        "Agile / Scrum",
        "2 jours par semaine",
        "Nador",
        "Entreprise spécialisée dans le développement web.",
        "Développer des fonctionnalités web et participer aux projets de l'équipe.",
        "2026-10-01",
        3,
        "contact@h2c-development.com",
    ],
    [
        1,
        "Développeur Front-End",
        "stage",
        "Nador",
        "presentiel",
        "Scrum",
        null,
        "Nador",
        "Entreprise spécialisée dans les solutions digitales.",
        "Créer des interfaces web responsives.",
        "2026-10-15",
        3,
        "recrutement@h2c-development.com",
    ],
    [
        1,
        "Développeur JavaScript",
        "alternance",
        "Nador",
        "remote",
        "Agile",
        "100% télétravail",
        null,
        "Équipe spécialisée dans le développement d'applications web.",
        "Développer des fonctionnalités JavaScript et améliorer l'expérience utilisateur.",
        "2026-11-01",
        12,
        "jobs@h2c-development.com",
    ],
    [
        2,
        "Développeur Laravel",
        "stage",
        "Kénitra",
        "presentiel",
        "Agile / Scrum",
        null,
        "Kénitra",
        "Agence spécialisée en branding et expérience utilisateur.",
        "Développer des fonctionnalités avec Laravel et JavaScript.",
        "2026-10-05",
        3,
        "contact@highness.ma",
    ],
    [
        2,
        "Développeur Full Stack",
        "alternance",
        "Kénitra",
        "hybride",
        "Scrum",
        "2 jours par semaine",
        "Kénitra",
        "Agence digitale spécialisée dans les produits SaaS.",
        "Participer au développement de produits web SaaS.",
        "2026-10-20",
        12,
        "jobs@highness.ma",
    ],
    [
        3,
        "Développeur Web Junior",
        "stage",
        "Nador",
        "presentiel",
        "Agile",
        null,
        "Nador",
        "École spécialisée dans la formation aux métiers du numérique.",
        "Participer au développement de projets web pédagogiques.",
        "2026-10-10",
        2,
        "contact@youcode.ma",
    ],
    [
        3,
        "Développeur JavaScript",
        "alternance",
        "Nador",
        "remote",
        "Scrum",
        "100% télétravail",
        null,
        "Équipe spécialisée dans la formation et les projets numériques.",
        "Développer des interfaces web interactives.",
        "2026-11-15",
        12,
        "jobs@youcode.ma",
    ],
    [
        3,
        "Assistant UI/UX Designer",
        "stage",
        "Nador",
        "hybride",
        "Design Thinking",
        "1 jour par semaine",
        "Nador",
        "Équipe dédiée à la conception d'expériences numériques.",
        "Créer des maquettes et participer aux ateliers UX.",
        "2026-10-25",
        2,
        "design@youcode.ma",
    ],
    [
        4,
        "Développeur PHP",
        "stage",
        "Casablanca",
        "presentiel",
        "Agile",
        null,
        "Casablanca",
        "Entreprise spécialisée dans les applications métiers.",
        "Développer et maintenir des applications PHP.",
        "2026-10-01",
        4,
        "recrutement@techsolutions.ma",
    ],
    [
        4,
        "Développeur React",
        "alternance",
        "Casablanca",
        "hybride",
        "Scrum",
        "2 jours par semaine",
        "Casablanca",
        "Entreprise spécialisée dans les solutions web modernes.",
        "Développer des interfaces avec React.",
        "2026-11-01",
        12,
        "jobs@techsolutions.ma",
    ],
    [
        5,
        "Développeur Web",
        "stage",
        "Rabat",
        "remote",
        "Agile",
        "100% télétravail",
        null,
        "Studio spécialisé dans les produits digitaux.",
        "Participer au développement de sites et applications web.",
        "2026-10-15",
        6,
        "contact@digitalfactory.ma",
    ],
    [
        5,
        "Assistant Product Designer",
        "alternance",
        "Rabat",
        "hybride",
        "Design Thinking",
        "2 jours par semaine",
        "Rabat",
        "Studio spécialisé dans la conception de produits numériques.",
        "Créer des maquettes et améliorer les parcours utilisateurs.",
        "2026-12-01",
        12,
        "jobs@digitalfactory.ma",
    ],
];

const offresTechnologies = [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 5],
    [1, 8],

    [2, 1],
    [2, 2],
    [2, 3],
    [2, 8],

    [3, 1],
    [3, 2],
    [3, 3],
    [3, 6],
    [3, 8],

    [4, 4],
    [4, 5],
    [4, 3],
    [4, 8],

    [5, 4],
    [5, 3],
    [5, 5],
    [5, 6],
    [5, 8],

    [6, 1],
    [6, 2],
    [6, 3],
    [6, 8],

    [7, 3],
    [7, 6],
    [7, 8],

    [8, 1],
    [8, 2],
    [8, 7],
    [8, 8],

    [9, 4],
    [9, 5],
    [9, 1],
    [9, 2],
    [9, 8],

    [10, 3],
    [10, 6],
    [10, 2],
    [10, 8],

    [11, 1],
    [11, 2],
    [11, 3],
    [11, 8],

    [12, 1],
    [12, 2],
    [12, 7],
    [12, 8],
];

async function seed() {
    try {
        console.log("Starting database seed...");

        // Delete existing data
        await db.query("DELETE FROM offre_technologie");
        await db.query("DELETE FROM offre");
        await db.query("DELETE FROM technologie");
        await db.query("DELETE FROM entreprise");

        // Reset AUTO_INCREMENT
        await db.query("ALTER TABLE entreprise AUTO_INCREMENT = 1");
        await db.query("ALTER TABLE technologie AUTO_INCREMENT = 1");
        await db.query("ALTER TABLE offre AUTO_INCREMENT = 1");

        // Insert companies
        await db.query(
            "INSERT INTO entreprise (nom) VALUES ?",
            [entreprises]
        );

        console.log("5 entreprises inserted.");

        // Insert technologies
        await db.query(
            "INSERT INTO technologie (nom) VALUES ?",
            [technologies]
        );

        console.log("8 technologies inserted.");

        // Insert offers
        await db.query(
            `INSERT INTO offre (
                entreprise_id,
                titre,
                type_contrat,
                ville,
                mode_travail,
                methode_travail,
                politique_teletravail,
                adresse_travail,
                presentation_entreprise,
                missions,
                date_debut,
                duree_mois,
                email_contact
            ) VALUES ?`,
            [offres]
        );

        console.log("12 offres inserted.");

        // Insert offer/technology relationships
        await db.query(
            `INSERT INTO offre_technologie (
                offre_id,
                technologie_id
            ) VALUES ?`,
            [offresTechnologies]
        );

        console.log("Offer/technology associations inserted.");
        console.log("Database seed completed successfully.");

    } catch (error) {
        console.error("Seed failed:", error.message);
    } finally {
        await db.end();
    }
}

seed();