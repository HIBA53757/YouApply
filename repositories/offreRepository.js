
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
export async function updateOffer(id, offer) {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const [companyResult] = await connection.query(
            `INSERT INTO entreprise (nom) VALUES (?)
             ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
            [offer.company]
        );

        await connection.query(
            `UPDATE offre SET
                entreprise_id = ?, titre = ?, type_contrat = ?, ville = ?, mode_travail = ?,
                methode_travail = ?, politique_teletravail = ?, adresse_travail = ?,
                presentation_entreprise = ?, missions = ?, date_debut = ?, duree_mois = ?, email_contact = ?
             WHERE id = ?`,
            [
                companyResult.insertId, offer.title, offer.contractType, offer.city, offer.workMode,
                offer.workMethod || null, offer.remotePolicy || null, offer.workAddress || null,
                offer.companyDescription, offer.missions, offer.startDate, offer.durationMonths,
                offer.email, id,
            ]
        );

        await connection.query("DELETE FROM offre_technologie WHERE offre_id = ?", [id]);
        for (const skill of offer.skills) {
            const [technologyResult] = await connection.query(
                `INSERT INTO technologie (nom) VALUES (?)
                 ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
                [skill]
            );
            await connection.query(
                "INSERT INTO offre_technologie (offre_id, technologie_id) VALUES (?, ?)",
                [id, technologyResult.insertId]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
export async function deleteOffer(id) {
    const [result] = await db.query("DELETE FROM offre WHERE id = ?", [id]);
    return result.affectedRows > 0;
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
export async function searchOffers(filters) {
    const conditions = [];
    const values = [];

    if (filters.keyword) {
        conditions.push(`(
            offre.titre LIKE ? OR entreprise.nom LIKE ?
            OR offre.presentation_entreprise LIKE ? OR offre.missions LIKE ?
        )`);
        const keyword = `%${filters.keyword}%`;
        values.push(keyword, keyword, keyword, keyword);
    }

    if (filters.city) {
        conditions.push("offre.ville LIKE ?");
        values.push(`%${filters.city}%`);
    }

    if (filters.contract !== "all") {
        conditions.push("offre.type_contrat = ?");
        values.push(filters.contract);
    }

    if (filters.workModes.length) {
        conditions.push(`offre.mode_travail IN (${filters.workModes.map(() => "?").join(",")})`);
        values.push(...filters.workModes);
    }

    filters.technologies.forEach((technology) => {
        conditions.push(`EXISTS (
            SELECT 1 FROM offre_technologie ot
            INNER JOIN technologie t ON t.id = ot.technologie_id
            WHERE ot.offre_id = offre.id AND t.nom = ?
        )`);
        values.push(technology);
    });

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const order = filters.sort === "oldest" ? "ASC" : "DESC";
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
        INNER JOIN entreprise ON offre.entreprise_id = entreprise.id
        LEFT JOIN offre_technologie ON offre.id = offre_technologie.offre_id
        LEFT JOIN technologie ON technologie.id = offre_technologie.technologie_id
        ${where}
        GROUP BY offre.id
        ORDER BY offre.date_publication ${order}
    `, values);

    return offers;
}
export async function getAllTechnologies() {
    const [technologies] = await db.query("SELECT nom FROM technologie ORDER BY nom");
    return technologies.map((technology) => technology.nom);
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
