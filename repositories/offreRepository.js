import db from "../database/connection.js";

export async function getAllOffers() {
    const [offers] = await db.query(`
        SELECT
            offre.id,
            offre.titre,
            offre.type_contrat,
            offre.ville,
            offre.mode_travail,
            offre.methode_travail,
            offre.politique_teletravail,
            offre.adresse_travail,
            offre.presentation_entreprise,
            offre.missions,
            offre.date_debut,
            offre.duree_mois,
            offre.email_contact,
            offre.date_publication,
            entreprise.nom AS entreprise_nom
        FROM offre
        INNER JOIN entreprise
            ON offre.entreprise_id = entreprise.id
        ORDER BY offre.date_publication DESC
    `);

    return offers;
}