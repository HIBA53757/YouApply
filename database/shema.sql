CREATE DATABASE IF NOT EXISTS YouApply
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE YouApply;

DROP TABLE IF EXISTS offre_technologie;
DROP TABLE IF EXISTS offre;
DROP TABLE IF EXISTS technologie;
DROP TABLE IF EXISTS entreprise;

CREATE TABLE entreprise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE technologie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE offre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entreprise_id INT NOT NULL,
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
    duree_mois INT NOT NULL,
    email_contact VARCHAR(255) NOT NULL,
    date_publication DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entreprise_id) REFERENCES entreprise(id)
);

CREATE TABLE offre_technologie (
    offre_id INT NOT NULL,
    technologie_id INT NOT NULL,
    PRIMARY KEY (offre_id, technologie_id),
    FOREIGN KEY (offre_id) REFERENCES offre(id) ON DELETE CASCADE,
    FOREIGN KEY (technologie_id) REFERENCES technologie(id) ON DELETE CASCADE
);