CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE graduation_list(
 fullname VARCHAR(255) NOT NULL,
 admission_no VARCHAR(100) NOT NULL UNIQUE,
 phonenumber VARCHAR(10) NOT NULL UNIQUE,
 department VARCHAR(255) NOT NULL,
 email VARCHAR(255) NOT NULL UNIQUE,
 programme VARCHAR(255) NOT NULL,
 id_no VARCHAR(15) NOT NULL UNIQUE,
 year_of_admission VARCHAR(255) NOT NULL,
 password uuid DEFAULT uuid_generate_v4(),
 role VARCHAR(255) NOT NULL,
 PRIMARY KEY(admission_no)
);

CREATE TABLE library(
admission_no VARCHAR(100) NOT NULL UNIQUE REFERENCES graduation_list ON DELETE CASCADE ON UPDATE CASCADE,
remarks varchar(255) NULL,
processed_by  varchar(255) NOT NULL,
approved VARCHAR(100) NOT NULL,
id uuid DEFAULT uuid_generate_v4(),
PRIMARY KEY(id)
);

CREATE TABLE finance(
admission_no VARCHAR(100) NOT NULL UNIQUE REFERENCES graduation_list ON DELETE CASCADE ON UPDATE CASCADE,
remarks varchar(255) NULL,
processed_by  varchar(255) NOT NULL,
approved VARCHAR(100) NOT NULL,
id uuid DEFAULT uuid_generate_v4(),
PRIMARY KEY(id)
);

CREATE TABLE records(
id uuid DEFAULT uuid_generate_v4(),
admission_no VARCHAR(100) NOT NULL UNIQUE REFERENCES graduation_list ON DELETE CASCADE ON UPDATE CASCADE,
remarks varchar(255) NULL,
processed_by  varchar(255) NOT NULL,
approved VARCHAR(100) NOT NULL,
PRIMARY KEY(id)
);
CREATE TABLE order_of_names(
 fullname VARCHAR(255) NOT NULL,
 admission_no VARCHAR(100) NOT NULL UNIQUE REFERENCES graduation_list ON DELETE CASCADE ON UPDATE CASCADE,
 year_of_admission VARCHAR(255) NOT NULL,
 department VARCHAR(255) NOT NULL,
 programme VARCHAR(255) NOT NULL,
 phonenumber VARCHAR(10) NOT NULL UNIQUE,
 email VARCHAR(255) NOT NULL UNIQUE,
 id_no VARCHAR(15) NOT NULL UNIQUE,
 guardian_phoneno VARCHAR(255) NOT NULL,
 processed_by  varchar(255),
 approved VARCHAR(100) NOT NULL,
 id uuid DEFAULT uuid_generate_v4(),
 date timestamp NOT NULL DEFAULT NOW(),
 PRIMARY KEY(id)
);
CREATE TABLE stages(
 stage VARCHAR(255) NOT NULL,
 admission_no VARCHAR(100) NOT NULL UNIQUE REFERENCES graduation_list ON DELETE CASCADE ON UPDATE CASCADE,
 id uuid DEFAULT uuid_generate_v4(),
 PRIMARY KEY(id)
);


CREATE TABLE hod(
hod_id uuid DEFAULT uuid_generate_v4(),
fullname VARCHAR(255) NOT NULL,
email varchar(255) NULL UNIQUE,
password  varchar(255) NOT NULL UNIQUE,
department VARCHAR(255) NOT NULL,
role VARCHAR(255) NOT NULL,
PRIMARY KEY(hod_id)
);

-- INSERT INTO HOD(fullname,email,password,department) VALUES('Ashley Shisoka','ashisoka@gmail.com','$2b$10$bdy195cpZXBheaYuzMapWuzirk08dKuL29kBivAzgqnrTx6U0nszG','SCAI');