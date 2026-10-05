import db from "../database/connection.js";

async function getCompanyId(name) {
    const [rows] = await db.query("SELECT id FROM entreprise WHERE nom = ?", [name]);
    if (rows.length > 0) {
        return rows[0].id;
    }
    const [result] = await db.query("INSERT INTO entreprise (nom) VALUES (?)", [name]);
    return result.insertId;
}

async function getTechnologyId(name) {
    const [rows] = await db.query("SELECT id FROM technologie WHERE nom = ?", [name]);
    if (rows.length > 0) {
        return rows[0].id;
    }
    const [result] = await db.query("INSERT INTO technologie (nom) VALUES (?)", [name]);
    return result.insertId;
}

async function saveSkills(offerId, skills) {
    for (const skill of skills) {
        const technologyId = await getTechnologyId(skill);
        await db.query(
            "INSERT INTO offre_technologie (offre_id, technologie_id) VALUES (?, ?)",
            [offerId, technologyId]
        );
    }
}

async function addSkills(offers) {
    for (const offer of offers) {
        const [rows] = await db.query(
            `SELECT technologie.nom
             FROM technologie
             JOIN offre_technologie ON technologie.id = offre_technologie.technologie_id
             WHERE offre_technologie.offre_id = ?`,
            [offer.id]
        );

        const names = [];
        for (const row of rows) {
            names.push(row.nom);
        }
        offer.skills = names.join(",");
    }
    return offers;
}

export async function getAllOffers() {
    const [offers] = await db.query(
        `SELECT offre.*, entreprise.nom AS entreprise_nom
         FROM offre
         JOIN entreprise ON offre.entreprise_id = entreprise.id
         ORDER BY offre.date_publication DESC`
    );
    return await addSkills(offers);
}

export async function getOfferById(id) {
    const [offers] = await db.query(
        `SELECT offre.*, entreprise.nom AS entreprise_nom
         FROM offre
         JOIN entreprise ON offre.entreprise_id = entreprise.id
         WHERE offre.id = ?`,
        [id]
    );
    await addSkills(offers);
    return offers[0];
}

export async function getAllTechnologies() {
    const [rows] = await db.query("SELECT nom FROM technologie ORDER BY nom");
    const names = [];
    for (const row of rows) {
        names.push(row.nom);
    }
    return names;
}

export async function searchOffers(filters) {
    const keyword = filters.keyword || "";
    const city = filters.city || "";
    const contract = filters.contract || "";
    const workMode = filters.workMode || "";
    const technology = filters.technology || "";

    let sql = `
        SELECT DISTINCT offre.*, entreprise.nom AS entreprise_nom
        FROM offre
        JOIN entreprise ON offre.entreprise_id = entreprise.id
        LEFT JOIN offre_technologie ON offre.id = offre_technologie.offre_id
        LEFT JOIN technologie ON technologie.id = offre_technologie.technologie_id
        WHERE (? = '' OR offre.titre LIKE ? OR entreprise.nom LIKE ? OR offre.missions LIKE ?)
          AND (? = '' OR offre.ville LIKE ?)
          AND (? = '' OR offre.type_contrat = ?)
          AND (? = '' OR offre.mode_travail = ?)
          AND (? = '' OR technologie.nom = ?)
    `;

    if (filters.sort === "oldest") {
        sql += " ORDER BY offre.date_publication ASC";
    } else {
        sql += " ORDER BY offre.date_publication DESC";
    }

    const values = [
        keyword, "%" + keyword + "%", "%" + keyword + "%", "%" + keyword + "%",
        city, "%" + city + "%",
        contract, contract,
        workMode, workMode,
        technology, technology
    ];

    const [offers] = await db.query(sql, values);
    return await addSkills(offers);
}

export async function createOffer(offer) {
    const companyId = await getCompanyId(offer.company);

    const [result] = await db.query(
        `INSERT INTO offre (
            entreprise_id, titre, type_contrat, ville, mode_travail,
            methode_travail, politique_teletravail, adresse_travail,
            presentation_entreprise, missions, date_debut, duree_mois, email_contact
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            companyId,
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
            offer.email
        ]
    );

    await saveSkills(result.insertId, offer.skills);
}

export async function updateOffer(id, offer) {
    const companyId = await getCompanyId(offer.company);

    await db.query(
        `UPDATE offre SET
            entreprise_id = ?, titre = ?, type_contrat = ?, ville = ?, mode_travail = ?,
            methode_travail = ?, politique_teletravail = ?, adresse_travail = ?,
            presentation_entreprise = ?, missions = ?, date_debut = ?, duree_mois = ?,
            email_contact = ?
         WHERE id = ?`,
        [
            companyId,
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
            id
        ]
    );

    await db.query("DELETE FROM offre_technologie WHERE offre_id = ?", [id]);
    await saveSkills(id, offer.skills);
}

export async function deleteOffer(id) {
    await db.query("DELETE FROM offre WHERE id = ?", [id]);
}