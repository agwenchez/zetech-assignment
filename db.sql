CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE graduation_list(
 student_id uuid DEFAULT uuid_generate_v4(),
 fullname VARCHAR(255) NOT NULL,
 admission_no VARCHAR(100) NOT NULL UNIQUE,
 phonenumber VARCHAR(10) NOT NULL UNIQUE,
 department VARCHAR(255) NOT NULL,
 email VARCHAR(255) NOT NULL UNIQUE,
 programme VARCHAR(255) NOT NULL,
 id_no VARCHAR(15) NOT NULL UNIQUE,
 year_of_admission VARCHAR(255) NOT NULL,
 PRIMARY KEY(admission_no)
);