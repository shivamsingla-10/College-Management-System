import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getManager } from "typeorm";
import httpProxy from "http-proxy";
const proxy = httpProxy.createServer({});
import crypto from "crypto";
// const User = require("../models/User");
import SibApiV3Sdk from "sib-api-v3-sdk";
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

export const adminLogin = async (req, res) => {
  const dbms = getManager();
  const { username, password } = req.body;
  console.log(username, password);
  const errors = { usernameError: String, passwordError: String };
  let query = `select * from admin where username="${username}"`;
  try {
    let existingAdmin = await dbms.query(query);
    if (!existingAdmin.length) {
      errors.usernameError = "Admin doesn't exist.";
      console.log("Admin does not exist!!");

      return res.status(404).json(errors);
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin[0].password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingAdmin[0].email,
        id: existingAdmin[0].id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingAdmin[0], token: token });
  } catch (error) {
    console.log(error);
  }
};

export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }
    const dbms = getManager();
    // const admin = await Admin.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    let query1 = `update admin set password="${hashedPassword}" where email="${email}"`;
    let query2 = `update admin set passwordUpdated=1 where email="${email}"`;
    let query3 = `select * from admin where email="${email}"`;
    await dbms.query(query1);

    let admin = await dbms.query(query3);

    if (admin[0].passwordUpdated === 0) {
      await dbms.query(query2);
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: admin[0],
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email } = req.body;
    const dbms = getManager();
    if (name) {
      let query = `update admin set name="${name}" where email="${email}"`;
      await dbms.query(query);
    }
    if (dob) {
      let query = `update admin set dob="${dob}" where email="${email}"`;
      await dbms.query(query);
    }
    if (department) {
      let query = `update admin set department="${department}" where email="${email}"`;
      await dbms.query(query);
    }
    if (contactNumber) {
      let query = `update admin set contactNumber=${contactNumber} where email="${email}"`;
      await dbms.query(query);
    }
    if (avatar) {
      let query = `update admin set avatar="${avatar}" where email="${email}"`;
      await dbms.query(query);
    }
    let updatedAdmin = await dbms.query(
      `select * from admin where email="${email}"`
    );
    res.status(200).json(updatedAdmin[0]);
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addAdmin = async (req, res) => {
  try {
    const dbms = getManager();
    const { name, dob, department, contactNumber, avatar, email, joiningYear } =
      req.body;
    const errors = { emailError: String };
    let query = `select * from admin where email="${email}"`;
    const existingAdmin = await dbms.query(query);
    if (existingAdmin.length !== 0) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }

    let departmentQuery = `select * from department where department="${department}"`;
    const existingDepartment = await dbms.query(departmentQuery);
    let departmentHelper = existingDepartment[0].department;
    let adminQuery = `select * from admin where department="${departmentHelper}"`;
    const admins = await dbms.query(adminQuery);

    let helper;
    if (admins.length < 10) {
      helper = "00" + admins.length.toString();
    } else if (admins.length < 100 && admins.length > 9) {
      helper = "0" + admins.length.toString();
    } else {
      helper = admins.length.toString();
    }
    var date = new Date();
    var components = ["ADM", date.getFullYear(), departmentHelper, helper];

    var username = components.join("");
    let hashedPassword;
    const newDob = dob.split("-").reverse().join("-");

    hashedPassword = await bcrypt.hash(newDob, 10);
    var passwordUpdated = 0;
    let addAdminQuery = `insert into admin (name, email, password, joiningYear, username, department, avatar, contactNumber, dob, passwordUpdated) values("${name}","${email}", "${hashedPassword}", ${joiningYear}, "${username}", "${departmentHelper}", "${avatar}", ${contactNumber}, "${dob}", ${passwordUpdated})`;

    await dbms.query(addAdminQuery);

    let newAdmin = await dbms.query(
      `select * from admin where email="${email}"`
    );

    // const func = async () => {
    //   if (newAdmin.length) {
    //     console.log("sending mail");
    //     sendSmtpEmail = {
    //       to: [
    //         {
    //           email: newAdmin.email,
    //         },
    //       ],
    //       sender: {
    //         email: process.env.ACCOUNT,
    //       },
    //       subject: "ERP Account Details",
    //       htmlContent:
    //         "<h1>Hello " +
    //         newAdmin.name +
    //         "</h1>" +
    //         " Login Details for ERP:</a>" +
    //         "<p>Username: " +
    //         newAdmin.username +
    //         "</p>" +
    //         "<br /><p>Password:" +
    //         newAdmin.dob +
    //         "</p>" +
    //         "<br /></p> Click here to login:  " +
    //         '<a href="https://localhost:3000>Login to ERP</a>',
    //       headers: {
    //         "api-key": process.env.API_KEY,
    //         "content-type": "application/json",
    //         accept: "application/json",
    //       },
    //     };
    //     let data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    //     console.log("mail sent successfully");

    //     res.send(
    //       "Please check your email, a link has been sent to the given email address"
    //     );

    //     // );
    //   } else {
    //     errors.backendError = "Email is not valid! Please enter valid email!";
    //     res.status(500).json(errors);
    //   }
    // };
    // func();
    return res.status(200).json({
      success: true,
      message: "Admin registerd successfully",
      response: newAdmin,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const createNotice = async (req, res) => {
  try {
    const { from, content, topic, date, noticeFor } = req.body;
    const dbms = getManager();
    const errors = { noticeError: String };
    let query = `select * from notice where topic="${topic}" and content="${content}" and date = "${date}"`;
    const exisitingNotice = await dbms.query(query);
    if (exisitingNotice.length) {
      errors.noticeError = "Notice already created";
      return res.status(400).json(errors);
    }

    let createNotice = `insert into notice( noticeFor, topic, content, date, noticeFrom) values ("${noticeFor}","${topic}","${content}","${date}","${from}")`;
    await dbms.query(createNotice);

    let newNotice = await dbms.query(query);
    return res.status(200).json({
      success: true,
      message: "Notice created successfully",
      response: newNotice,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addDepartment = async (req, res) => {
  try {
    const dbms = getManager();
    const errors = { departmentError: String };
    const { department } = req.body;
    let query = `select * from department where department="${department}"`;
    const existingDepartment = await dbms.query(query);
    if (existingDepartment.length) {
      errors.departmentError = "Department already added";
      return res.status(400).json(errors);
    }
    const departments = await dbms.query(`select * from department`);
    let add = departments.length + 1;
    let departmentCode;
    if (add < 9) {
      departmentCode = "0" + add.toString();
    } else {
      departmentCode = add.toString();
    }

    await dbms.query(
      `insert into department(departmentCode,department) values ("${departmentCode}","${department}")`
    );
    let newDepartment = await dbms.query(
      `select * from department where department="${department}"`
    );
    return res.status(200).json({
      success: true,
      message: "Department added successfully",
      response: newDepartment,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addFaculty = async (req, res) => {
  const dbms = getManager();
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      joiningYear,
      gender,
      designation,
    } = req.body;
    const errors = { emailError: String };
    const existingFaculty = await dbms.query(
      `select * from faculty where email="${email}"`
    );
    if (existingFaculty.length) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    const existingDepartment = await dbms.query(
      `select * from department where department="${department}"`
    );
    let departmentName = existingDepartment[0].department;

    const faculties = await dbms.query(
      `select * from faculty where department="${department}"`
    );
    let helper;
    if (faculties.length < 10) {
      helper = "00" + faculties.length.toString();
    } else if (faculties.length < 100 && faculties.length > 9) {
      helper = "0" + faculties.length.toString();
    } else {
      helper = faculties.length.toString();
    }
    var date = new Date();
    var components = ["FAC", date.getFullYear(), departmentName, helper];

    var username = components.join("");
    let hashedPassword;
    const newDob = dob.split("-").reverse().join("-");

    hashedPassword = await bcrypt.hash(newDob, 10);
    var passwordUpdated = 0;

    await dbms.query(
      `insert into faculty (name, email, contactNumber, avatar, username, password, gender, designation, department, dob, joiningYear, passwordUpdated) values("${name}","${email}",${contactNumber},"${avatar}","${username}","${hashedPassword}","${gender}","${designation}","${departmentName}","${dob}",${joiningYear},${passwordUpdated})`
    );

    let newFaculty = await dbms.query(
      `select * from faculty where email="${email}"`
    );
    return res.status(200).json({
      success: true,
      message: "Faculty registerd successfully",
      response: newFaculty,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getFaculty = async (req, res) => {
  try {
    const { department } = req.body;
    const errors = { noFacultyError: String };
    const dbms = getManager();
    const faculties = await dbms.query(
      `select * from faculty where department="${department}"`
    );
    if (faculties.length === 0) {
      errors.noFacultyError = "No Faculty Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: faculties });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const getNotice = async (req, res) => {
  try {
    const dbms = getManager();
    const errors = { noNoticeError: String };
    const notices = await dbms.query(`select * from notice`);
    if (notices.length === 0) {
      errors.noNoticeError = "No Notice Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: notices });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addSubject = async (req, res) => {
  try {
    const dbms = getManager();
    const { totalLectures, department, subjectCode, subjectName, year } =
      req.body;
    const errors = { subjectError: String };
    const subject = await dbms.query(
      `select * from subject where subjectCode="${subjectCode}"`
    );
    if (subject.length) {
      errors.subjectError = "Given Subject is already added";
      return res.status(400).json(errors);
    }

    let addSubject = `insert into subject (totalLectures, department, subjectCode, subjectName, year) values(${totalLectures}, (select department from department where department="${department}"), "${subjectCode}","${subjectName}", ${year})`;
    await dbms.query(addSubject);
    const newSubject = await dbms.query(
      `select * from subject where subjectCode="${subjectCode}"`
    );

    return res.status(200).json({
      success: true,
      message: "Subject added successfully",
      response: newSubject,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getSubject = async (req, res) => {
  try {
    const { department, year } = req.body;
    const dbms = getManager();
    // if (!req.userId) return res.json({ message: "Unauthenticated" });
    const errors = { noSubjectError: String };

    const subjects = await dbms.query(
      `select * from subject where department=(select department from department where department="${department}") and year=${year}`
    );
    if (subjects.length === 0) {
      errors.noSubjectError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: subjects });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getAdmin = async (req, res) => {
  try {
    const dbms = getManager();
    const { department } = req.body;

    const errors = { noAdminError: String };

    const admins = await dbms.query(
      `select * from admin where department=(select department from department where department="${department}")`
    );
    if (admins.length === 0) {
      errors.noAdminError = "No Admin Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: admins });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const dbms = getManager();
    const admins = req.body;
    const errors = { noAdminError: String };
    for (var i = 0; i < admins.length; i++) {
      var admin = admins[i];
      await dbms.query(`delete from admin where username="${admin}"`);
    }
    res.status(200).json({ message: "Admin Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const dbms = getManager();
    const faculties = req.body;
    const errors = { noFacultyError: String };
    for (var i = 0; i < faculties.length; i++) {
      var faculty = faculties[i];

      await dbms.query(`delete from faculty where username="${faculty}"`);
    }
    res.status(200).json({ message: "Faculty Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const dbms = getManager();
    const students = req.body;
    const errors = { noStudentError: String };
    for (var i = 0; i < students.length; i++) {
      var student = students[i];

      await dbms.query(`delete from student where username="${student}"`);
    }
    res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteSubject = async (req, res) => {
  try {
    const subjects = req.body;
    const dbms = getManager();
    const errors = { noSubjectError: String };
    for (var i = 0; i < subjects.length; i++) {
      var subject = subjects[i];

      await dbms.query(`delete from subject where subjectCode="${subject}"`);
    }
    res.status(200).json({ message: "Subject Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { department } = req.body;
    const dbms = getManager();
    await dbms.query(`delete from department where department="${department}"`);

    res.status(200).json({ message: "Department Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addStudent = async (req, res) => {
  try {
    const dbms = getManager();
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      section,
      gender,
      batch,
      fatherName,
      motherName,
      fatherContactNumber,
      motherContactNumber,
      year,
    } = req.body;
    const errors = { emailError: String };
    const existingStudent = await dbms.query(
      `select * from student where email="${email}"`
    );

    const studentCount = await dbms.query(`select * from student`);
    const id = studentCount.length + 1;
    if (existingStudent.length) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    const existingDepartment = await dbms.query(
      `select * from department where department = "${department}"`
    );
    let departmentHelper = existingDepartment[0].department;
    const students = await dbms.query(
      `select * from student where department="${departmentHelper}"`
    );
    let helper;
    if (students.length < 10) {
      helper = "00" + students.length.toString();
    } else if (students.length < 100 && students.length > 9) {
      helper = "0" + students.length.toString();
    } else {
      helper = students.length.toString();
    }
    var date = new Date();
    var components = ["STU", date.getFullYear(), departmentHelper, helper];

    var username = components.join("");
    let hashedPassword;
    const newDob = dob.split("-").reverse().join("-");

    hashedPassword = await bcrypt.hash(newDob, 10);
    var passwordUpdated = 0;

    let addQuery = `insert into student (id,name, dob, password, username, department, phone, avatar, email, section, gender, batch, fatherName, motherName, fatherContactNumber, motherContactNumber, year, passwordUpdated) values (${id},"${name}", "${dob}","${hashedPassword}", "${username}", "${departmentHelper}", ${contactNumber}, "${avatar}", "${email}", "${section}", "${gender}", "${batch}", "${fatherName}", "${motherName}", ${fatherContactNumber}, ${motherContactNumber}, ${year}, ${passwordUpdated})`;
    await dbms.query(addQuery);
    const newStudent = await dbms.query(
      `select * from student where email="${email}"`
    );

    return res.status(200).json({
      success: true,
      message: "Student registerd successfully",
      response: newStudent,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { noStudentError: String };
    const dbms = getManager();
    let query = `select * from student where department="${department}" and year=${year}`;
    const students = await dbms.query(query);
    if (students.length === 0) {
      errors.noStudentError = "No Student Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ result: students });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const getAllStudent = async (req, res) => {
  try {
    const dbms = getManager();
    const students = await dbms.query(`select * from student`);
    res.status(200).json(students);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const dbms = getManager();
    const faculties = await dbms.query(`select * from faculty`);
    res.status(200).json(faculties);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const dbms = getManager();
    const admins = await dbms.query(`select * from admin`);
    res.status(200).json(admins);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
export const getAllDepartment = async (req, res) => {
  try {
    const dbms = getManager();
    const departments = await dbms.query(`select * from department`);
    res.status(200).json(departments);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
export const getAllSubject = async (req, res) => {
  try {
    const dbms = getManager();
    const subjects = await dbms.query(`select * from subject`);
    res.status(200).json(subjects);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
