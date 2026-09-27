
import db from "../database/connection.js";

export async function createOffer(offer) {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [companyResult] = await connection.query(
            `INSERT INTO entreprise (nom) VALUES (?)
             ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
            [offer.company]
        );

        const [offerResult] = await connection.query(
            `INSERT INTO offre (
                entreprise_id, titre, type_contrat, ville, mode_travail,
                methode_travail, politique_teletravail, adresse_travail,
                presentation_entreprise, missions, date_debut, duree_mois, email_contact
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                companyResult.insertId,
                offer.title,
                offer.contractType,
                offer.city,
                offer.workMode,
                offer.workMethod || null,
                offer.remotePolicy || null,
                offer.workAddress || null,
                offer.companyDescription,
                offer.missions,
                offer.startDate,
                offer.durationMonths,
                offer.email,
            ]
        );

        for (const skill of offer.skills) {
            const [technologyResult] = await connection.query(
                `INSERT INTO technologie (nom) VALUES (?)
                 ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
                [skill]
            );
            await connection.query(
                "INSERT IGNORE INTO offre_technologie (offre_id, technologie_id) VALUES (?, ?)",
                [offerResult.insertId, technologyResult.insertId]
            );
        }

        await connection.commit();
        return offerResult.insertId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

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
            ON offre.id = offre_technologie.offre_id
        LEFT JOIN technologie
            ON technologie.id = offre_technologie.technologie_id
        GROUP BY offre.id
        ORDER BY offre.date_publication DESC
    `);

    return offers;
}

export async function getOfferById(id) {
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
            ON offre.id = offre_technologie.offre_id
        LEFT JOIN technologie
            ON technologie.id = offre_technologie.technologie_id
        WHERE offre.id = ?
        GROUP BY offre.id
    `, [id]);

    return offers[0];
}
export async function getOffersByIds(ids) {
    if (!ids.length) {
        return [];
    }

    const placeholders = ids.map(() => "?").join(",");

    const [offers] = await db.query(
        `
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
            ON offre.id = offre_technologie.offre_id
        LEFT JOIN technologie
            ON technologie.id = offre_technologie.technologie_id
        WHERE offre.id IN (${placeholders})
        GROUP BY offre.id
        ORDER BY offre.date_publication DESC
        `,
        ids
    );

    return offers;
}
