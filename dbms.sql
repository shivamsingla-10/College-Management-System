create database erp;

use erp;

create table department(
    departmentCode varchar(255),
    department varchar(255),
    constraint pk1 primary key(department)
);

create table subject(
    subjectCode varchar(255),
    subjectName varchar(255),
    totalLectures int,
    year int,
    department varchar(255),
    constraint pk2 primary key(subjectCode),
    constraint fk1 foreign key(department) references department(department)
);

create table admin(
    name varchar(255),
    email varchar(255),
    password varchar(255),
    username varchar(255),
    department varchar(255),
    dob date,
    joiningYear int,
    avatar varchar(10000),
    contactNumber bigint,
    passwordUpdated tinyint,
    constraint pk3 primary key(username),
    constraint fk2 foreign key(department) references department(department) on delete
    set
        null on update cascade
);

create table faculty(
    name varchar(255),
    email varchar(255),
    contactNumber bigint,
    avatar varchar(10000),
    username varchar(255),
    password varchar(255),
    gender varchar(255),
    designation varchar(255),
    department varchar(255),
    dob date,
    joiningYear int,
    passwordUpdated tinyint,
    constraint pk4 primary key(username),
    constraint fk3 foreign key(department) references department(department)
);

create table student(
    email varchar(255),
    phone bigint,
    id int,
    name varchar(255),
    avatar varchar(10000),
    password varchar(255),
    year int,
    username varchar(255) unique,
    gender varchar(255),
    fatherName varchar(255),
    motherName varchar(255),
    department varchar(255),
    section varchar(45),
    batch varchar(45),
    dob date,
    motherContactNumber bigint,
    fatherContactNumber bigint,
    passwordUpdated tinyint,
    constraint pk5 primary key(id),
    constraint fk4 foreign key (department) references department(department)
);

create table attendance(
    sid int,
    subCode varchar(255),
    lecAttended int,
    constraint pk6 primary key (sid, subCode),
    constraint fk5 foreign key(sid) references student(id),
    constraint fk6 foreign key(subCode) references subject(subjectCode)
);

create table test(
    test varchar(255),
    subjectCode varchar(255),
    department varchar(255),
    totalMarks int default 10,
    year int,
    section varchar(45),
    date date,
    constraint pk7 primary key(test),
    constraint fk7 foreign key (subjectCode) references subject(subjectCode),
    constraint fk8 foreign key (department) references department(department)
);

create table marks(
    marks int,
    id int,
    studentId int,
    testId varchar(255),
    constraint pk8 primary key(id),
    constraint fk9 foreign key (studentId) references student(id),
    constraint fk10 foreign key (testId) references test(test)
);

create table notice(
    topic varchar(255),
    date date,
    content varchar(255),
    noticeFrom varchar(255),
    noticeFor varchar(255),
    constraint pk9 primary key(topic, date, content)
);




DELIMITER //
CREATE PROCEDURE incrMarks (IN v_testID varchar(255),IN v_year int,IN v_section varchar(45),IN addMarks int)
BEGIN
    DECLARE finished integer default 0;
    DECLARE v_stuId int; 
    DECLARE sidCursor CURSOR FOR SELECT id from student where year=v_year AND section=v_section;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished=1;
    OPEN sidCursor;
    L1: LOOP

        FETCH sidCursor into v_stuId;
        if finished=1 then 
            LEAVE L1;
        END if;
        UPDATE marks SET marks=marks+addMarks where studentId=v_stuId AND testId=v_testId;

    END LOOP L1;

END;
//


create table STUDENTARCHIVE(
    email varchar(255),
    phone bigint,
    id int,
    name varchar(255),
    avatar varchar(10000),
    year int,
    username varchar(255) unique,
    gender varchar(255),
    fatherName varchar(255),
    motherName varchar(255),
    department varchar(255),
    section varchar(45),
    batch varchar(45),
    dob date,
    motherContactNumber bigint,
    fatherContactNumber bigint,
    constraint pk00 primary key(id),
    constraint fk00 foreign key (department) references department(department)
);

DELIMITER //
CREATE TRIGGER ARCHIVE_STU
BEFORE DELETE ON STUDENT
FOR EACH ROW
BEGIN
        INSERT INTO STUDENTARCHIVE (ID, NAME, EMAIL, PHONE, AVATAR, YEAR,USERNAME, BATCH, SECTION, FATHERNAME, MOTHERNAME, FATHERCONTACTNUMBER, MOTHERCONTACTNUMBER, GENDER, DOB, DEPARTMENT)
        VALUES (OLD.ID, OLD.NAME, OLD.EMAIL, OLD.PHONE, OLD.AVATAR, OLD.YEAR, OLD.USERNAME, OLD.BATCH, OLD.SECTION, OLD.FATHERNAME, OLD.MOTHERNAME, OLD.FATHERCONTACTNUMBER, OLD.MOTHERCONTACTNUMBER, OLD.GENDER, OLD.DOB, OLD.DEPARTMENT);
        
END
//

delimiter;


-- faculty
create table FacultyARCHIVE(
    email varchar(255),
    contactNumber bigint,
    name varchar(255),
    avatar varchar(10000),
    username varchar(255) unique,
    gender varchar(255),
    department varchar(255),
    designation varchar(255),
    dob date,
    joiningYear int,
    constraint pk00 primary key(username),
    constraint fk01 foreign key (department) references department(department)
);

DELIMITER //
CREATE TRIGGER ARCHIVE_FAC
BEFORE DELETE ON faculty
FOR EACH ROW
BEGIN
        INSERT INTO FacultyARCHIVE (NAME, EMAIL, contactNumber, AVATAR, USERNAME,  GENDER, DOB, DEPARTMENT,joiningYear,designation)
        VALUES (OLD.NAME, OLD.EMAIL, OLD.contactNumber, OLD.AVATAR,  OLD.USERNAME,  OLD.GENDER, OLD.DOB, OLD.DEPARTMENT,OLD.joiningYear,OLD.designation);
        
END
//

delimiter;



-- admin
create table adminARCHIVE(
    email varchar(255),
    contactNumber bigint,
    name varchar(255),
    avatar varchar(10000),
    username varchar(255) unique,
    department varchar(255),
    dob date,
    joiningYear int,
    constraint pk00 primary key(username),
    constraint fk02 foreign key (department) references department(department)
);

DELIMITER //
CREATE TRIGGER ARCHIVE_adm
BEFORE DELETE ON admin
FOR EACH ROW
BEGIN
        INSERT INTO adminARCHIVE (NAME, EMAIL, contactNumber, AVATAR, USERNAME,  DOB, DEPARTMENT,joiningYear)
        VALUES (OLD.NAME, OLD.EMAIL, OLD.contactNumber, OLD.AVATAR,  OLD.USERNAME, OLD.DOB, OLD.DEPARTMENT,OLD.joiningYear);
        
END
//

delimiter;
