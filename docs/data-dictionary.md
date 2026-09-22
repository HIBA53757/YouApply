# YouApply - Data Dictionary

## Company

| Field | Type | Size | Null | Constraint | Description |
| --- | --- | --- | --- | --- | --- |
| id | INT | — | No | PK, AUTO_INCREMENT | Company identifier. |
| name | VARCHAR | 150 | No | — | Company name. |
| description | TEXT | — | No | — | Short company presentation. |

## Offer

| Field | Type | Size | Null | Constraint | Description |
| --- | --- | --- | --- | --- | --- |
| id | INT | — | No | PK, AUTO_INCREMENT | Offer identifier. |
| company_id | INT | — | No | FK → company.id | Company that posted the offer. |
| job_title | VARCHAR | 150 | No | — | Position title. |
| opp_type | ENUM('stage', 'alternance') | — | No | — | Type of opportunity. |
| location | VARCHAR | 150 | No | — | Job location. |
| missions | TEXT | — | No | — | Main tasks. |
| profile | TEXT | — | No | — | Expected candidate profile. |
| start_date | DATE | — | No | — | Planned start date. |
| duration | VARCHAR | 30 | No | — | Contract duration, such as `6 mois`. |
| work_mode | ENUM('presentiel', 'hybride', 'remote') | — | No | — | On-site or remote arrangement. |
| salary | VARCHAR | 100 | Yes | — | Salary or stipend as displayed. |
| email | VARCHAR | 255 | No | — | Address receiving applications. |
| published_at | DATE | — | Yes | — | Publication date, when published. |
| status | VARCHAR | 20 | No | — | Offer status, such as `published`. |

## Technology

| Field | Type | Size | Null | Constraint | Description |
| --- | --- | --- | --- | --- | --- |
| id | INT | — | No | PK, AUTO_INCREMENT | Technology identifier. |
| name | VARCHAR | 100 | No | UNIQUE | Technology name. |

## Offre_Technologie

| Field | Type | Size | Null | Constraint | Description |
| --- | --- | --- | --- | --- | --- |
| offer_id | INT | — | No | Composite PK, FK → offer.id | Linked offer. |
| technology_id | INT | — | No | Composite PK, FK → technology.id | Linked technology. |

## Relationships

- One company can have many offers. Every offer belongs to exactly one company through `offer.company_id`.
- Each offer has one or more technologies; a technology can belong to zero or many offers. `offre_technologie` stores each offer–technology link.

## Notes

- `AUTO_INCREMENT` assigns IDs to new company, offer, and technology rows. The link table uses the two existing IDs instead.
- `technology.name` is `UNIQUE`, so the same technology name cannot be stored twice.
- The pair (`offer_id`, `technology_id`) is the composite primary key of `offre_technologie`; it prevents duplicate links.
- All foreign keys are required (`Null: No`) and use the same `INT` type as their referenced IDs.
- Foreign keys alone do not ensure that every offer has at least one technology. The application must check that when creating an offer.
- Current project difference: `data/offers.json` stores `company` and company `description` inside each offer and stores technologies as a `skills` array. It has no `company_id` or link rows yet. The current form and JSON also use `schedule`, `mission_duration`, `reference`, `company_verified`, `team_size`, `work_method`, `remote_policy`, `soft_skills`, `health_insurance`, `transport_and_meals`, `applications_count`, `response_time`, `recruiter_name`, `recruiter_role`, `work_address`, and `access_info`. These fields are not in the proposed four-table model and need a decision before data migration.
