CREATE DATABASE IF NOT EXISTS youapply;

use youapply;

--@block 
CREATE TABLE company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT
);


--@block

CREATE TABLE offer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    opp_type ENUM('stage', 'alternance') NOT NULL,
    location VARCHAR(150) NOT NULL,
    missions TEXT NOT NULL,
    profile TEXT NOT NULL,
    start_date DATE NOT NULL,
    duration VARCHAR(50) NOT NULL,
    work_mode ENUM('presentiel', 'hybride', 'remote') NOT NULL,
    salary VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL,

    CONSTRAINT fk_offer_company
        FOREIGN KEY (company_id)
        REFERENCES company(id)
);


--@block
CREATE TABLE technology (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);




--@block
CREATE TABLE offre_technologie (
    offer_id INT NOT NULL,
    technology_id INT NOT NULL,

    PRIMARY KEY (offer_id, technology_id),

    CONSTRAINT fk_offre_technologie_offer
        FOREIGN KEY (offer_id)
        REFERENCES offer(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_offre_technologie_technology
        FOREIGN KEY (technology_id)
        REFERENCES technology(id)
        ON DELETE CASCADE
);

