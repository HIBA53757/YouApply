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
            entreprise.nom AS entreprise_nom,
            GROUP_CONCAT(technologie.nom SEPARATOR ',') AS skills
        FROM offre
        INNER JOIN entreprise
            ON offre.entreprise_id = entreprise.id
        LEFT JOIN offre_technologie
            ON offre_technologie.offre_id = offre.id
        LEFT JOIN technologie
            ON technologie.id = offre_technologie.technologie_id
        GROUP BY offre.id
        ORDER BY offre.date_publication DESC
    `);

    return offers;
}