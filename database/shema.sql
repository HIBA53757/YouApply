CREATE DATABASE IF NOT EXISTS YouApply
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE YouApply;


CREATE TABLE entreprise (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL UNIQUE
);


CREATE TABLE offre (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    entreprise_id INT UNSIGNED NOT NULL,
    titre VARCHAR(200) NOT NULL,
    type_contrat ENUM('stage', 'alternance') NOT NULL,
    ville VARCHAR(150) NOT NULL,
    mode_travail ENUM('presentiel', 'hybride', 'remote') NOT NULL,
    methode_travail VARCHAR(100),
    politique_teletravail VARCHAR(150),
    adresse_travail VARCHAR(255),
    presentation_entreprise TEXT NOT NULL,
    missions TEXT NOT NULL,
    date_debut DATE NOT NULL,
    duree_mois TINYINT UNSIGNED NOT NULL,
    email_contact VARCHAR(255) NOT NULL,
    date_publication DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_offre_entreprise
        FOREIGN KEY (entreprise_id)
        REFERENCES entreprise(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_duree
        CHECK (duree_mois IN (1, 2, 3, 4, 6, 12, 24))
);



CREATE TABLE technologie (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nom VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE offre_technologie (
    offre_id INT UNSIGNED NOT NULL,

    technologie_id INT UNSIGNED NOT NULL,

    PRIMARY KEY (offre_id, technologie_id),

    CONSTRAINT fk_offre_technologie_offre
        FOREIGN KEY (offre_id)
        REFERENCES offre(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_offre_technologie_technologie
        FOREIGN KEY (technologie_id)
        REFERENCES technologie(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);