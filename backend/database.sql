create table admin (
id bigserial primary key,
email varchar(500) not null unique,
login varchar(500) not null unique,
password varchar(500) not null,
firstname varchar(500),
lastname varchar(500),
brithday DATE,
address varchar(500),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
Parent_Name varchar(500),
profil_url varchar(500),
state BOOLEAN DEFAULT true);
insert into admin (email, login, password, firstname, brithday) values
('erbutayevfarrux@gmail.com','A888270501a','$2b$11$v3NWh1JgI94oJnPztLUiC.pbVLAImcH82X/m23gg9HYurdpePm7VG', 'Farrux', '05-01-2001 ');
-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
create table apealStatus(
id bigserial primary key unique,
	name varchar not null unique
);
insert into apealStatus (name)
values
('seen'), ('notseen'), ('panding'), ('cancel');
-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CREATE TABLE apeal (
    id BIGSERIAL PRIMARY KEY,
    firstname VARCHAR(500) NOT NULL,
    lastname VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(500),
	phone VARCHAR(500),
    status INTEGER DEFAULT 1,
    reseen DATE,
    CONSTRAINT fk_status FOREIGN KEY (status) REFERENCES apealstatus (id),
    CONSTRAINT check_reseen_not_null CHECK (
        (status = 3 AND reseen IS NOT NULL) OR status != 3
    )
);
-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CREATE TABLE calendar (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255),
    title VARCHAR(255),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    description TEXT,
    image VARCHAR(255),
    tags VARCHAR(255),
    location VARCHAR(255)
);
ALTER TABLE calendar
ADD COLUMN active BOOLEAN DEFAULT true;

ALTER TABLE apeal
ADD COLUMN state BOOLEAN DEFAULT true;
-- Seesion
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");

CREATE INDEX "IDX_session_expire" ON "session" ("expire");



Create table pupil(
id bigserial primary key,
firstname varchar(500) not null,
lastname varchar(500) not null,
birth date default '01-01-2004',
course_name varchar(500)
);

Create table teacher(
id bigserial primary key,
firstname varchar(500) not null,
lastname varchar(500) not null,
birth date default '01-01-2004',
course_name varchar(500)
);

Create table schedule(
id bigserial primary key,
id_int varchar(500) not null,
lesson varchar(500) not null,
 
course_name varchar(500)
);


CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- Parol xesh shaklida saqlanadi
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parents (
    id BIGSERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- Parol xavfsizlik uchun xesh shaklida saqlanadi
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('to‘langan', 'qarzdor')),
    payment_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    price INT NOT NULL,
    teacher VARCHAR(255) NOT NULL,
    startDate DATE NOT NULL
);

