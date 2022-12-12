import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getManager } from "typeorm";
export const facultyLogin = async (req, res) => {
  const manager = getManager();
  const { username, password } = req.body;
  console.log(username, password);
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingStudent = await manager.query(
      `select * from faculty where username="${username}"`
    );
    if (!existingStudent.length) {
      errors.usernameError = "Faculty doesn't exist.";
      return res.status(404).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingStudent[0].password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingStudent[0].email,
        id: existingStudent[0]._id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingStudent[0], token: token });
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
    const manager = getManager();

    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    await manager.query(
      `update faculty set password="${hashedPassword}" where email="${email}"`
    );
    const faculty = await manager.query(
      `select * from faculty where email="${email}"`
    );
    if (faculty[0].passwordUpdated === 0) {
      await manager.query(
        `update faculty set passwordUpdated=1 where email="${email}"`
      );
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: faculty[0],
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, designation } =
      req.body;
    const manager = getManager();

    if (name) {
      await manager.query(
        `update faculty set name="${name}" where email="${email}"`
      );
    }
    // console.log(dob);
    if (dob) {
      await manager.query(
        `update faculty set dob="${dob}" where email="${email}"`
      );
    }
    if (department) {
      await manager.query(
        `update faculty set department="${department}" where email="${email}"`
      );
    }
    if (contactNumber) {
      await manager.query(
        `update faculty set contactNumber=${contactNumber} where email="${email}"`
      );
    }
    if (designation) {
      await manager.query(
        `update faculty set designation="${designation}" where email="${email}"`
      );
    }

    if (avatar) {
      await manager.query(
        `update student set avatar="${avatar}" where email="${email}"`
      );
    }
    const updatedStudent = await manager.query(
      `select * from student where email="${email}"`
    );
    res.status(200).json(updatedStudent[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createTest = async (req, res) => {
  const manager = getManager();
  try {
    const { subjectCode, department, year, section, date, test, totalMarks } = req.body;
    console.log(req.body);
    const errors = { testError: String };
    const existingTest = await manager.query(
      `SELECT * from test where subjectCode="${subjectCode}" AND year=${year} AND section="${section}" AND test="${test}" AND department="${department}"`
    );
    if (existingTest.length) {
      errors.testError = "Given Test is already created";
      return res.status(400).json(errors);
    }
    console.log(req.body);

    const isSubjectExist = await manager.query(
      `select * from subject where subjectCode="${subjectCode}"`
    );

    if (!isSubjectExist.length) {
      errors.testError = `Subject with subject code ${subjectCode} does not exist!`;
      return res.status(400).json(errors);
    }

    const newTest = await manager.query(
      `insert into test (totalMarks,section,test,date,department,subjectCode,year) values (${totalMarks},"${section}","${test}","${date}","${department}","${subjectCode}",${year})`
    );
    console.log(newTest);

    console.log(req.body);

    const students = await manager.query(
      `SELECT * from student where department="${department}" AND year=${year} AND section="${section}"`
    );
    console.log(req.body);

    return res.status(200).json({
      success: true,
      message: "Test added successfully",
      response: newTest,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getTest = async (req, res) => {
  const manager = getManager();
  try {
    const { department, year, section } = req.body;

    const tests = await manager.query(
      `SELECT * from Test where department="${department}" AND year=${year} AND section="${section}"`
    );

    res.status(200).json({ result: tests });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getStudent = async (req, res) => {
  const manager = getManager();
  try {
    const { department, year, section } = req.body;
    const errors = { noStudentError: String };
    const students = await manager.query(
      `SELECT * from student where department="${department}" AND year=${year} AND section="${section}"`
    );
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

export const uploadGraceMarks = async (req, res) => {
  const manager = getManager();
  try {
    const { department, year, section, test, graceMarks } = req.body;
    const errors = { examError: String };
    const existingTest = await manager.query(
      `SELECT * from Test where year=${year} AND section="${section}" AND test="${test}" AND department="${department}"`
    );

    const isAlready = await manager.query(
      `SELECT * from Marks where testId="${existingTest[0].test}"`
    );
      console.log(1);
    if (isAlready.length == 0) {
      errors.examError = "You have not uploaded marks of given exam";
      return res.status(400).json(errors);
    }
    console.log(2);
      await manager.query(
        `
        CALL incrMarks("${test}",${year},"${section}",${graceMarks});
        `
      );
    
    console.log(3);

    res.status(200).json({ message: "Marks uploaded successfully" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const uploadMarks = async (req, res) => {
  const manager = getManager();
  try {
    console.log(req.body);
    const { department, year, section, test, marks } = req.body;
    const errors = { examError: String };
    const existingTest = await manager.query(
      `SELECT * from Test where year=${year} AND section="${section}" AND test="${test}" AND department="${department}"`
    );
      console.log(1);
    const isAlready = await manager.query(
      `SELECT * from Marks where testId="${existingTest[0].test}"`
    );
console.log(2);
    if (isAlready.length !== 0) {
      errors.examError = "You have already uploaded marks of given exam";
      return res.status(400).json(errors);
    }
    console.log(3);
    const marksCount = await manager.query(`select * from marks`);
    console.log(4);


    var id = marksCount.length + 1;
    for (var i = 0; i < marks.length; i++) {
      id = id + 1;
      console.log(id);
      const newMarks = await manager.query(
        `insert into Marks(id,studentId,testID,marks) values(${id},${marks[i]._id},"${existingTest[0].test}",${marks[i].value})`
      );
    }

    console.log(5);

    res.status(200).json({ message: "Marks uploaded successfully" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const markAttendance = async (req, res) => {
  const manager = getManager();
  try {
    const { selectedStudents, subjectName, department, year, section } =
      req.body;

    const sub = await manager.query(
      `SELECT * from Subject where subjectName="${subjectName}"`
    );
    console.log("1");

    console.log(selectedStudents);
    for (var a = 0; a < selectedStudents.length; a++) {
      const pre = await manager.query(
        `SELECT * from attendance where sid=${selectedStudents[a]} AND subCode="${sub[0].subjectCode}"`
      );
      if (!pre.length) {
        const attendence = await manager.query(
          `insert into attendance (sid,subCode) values (${selectedStudents[a]},"${sub[0].subjectCode}")`
        );

        await manager.query(
          `update attendance set lecAttended=1 where sid=${selectedStudents[a]} AND subCode="${sub[0].subjectCode}"`
        );
      } else {
        await manager.query(
          `update attendance set lecAttended=lecAttended+1 where sid=${selectedStudents[a]} AND subCode="${sub[0].subjectCode}"`
        );
      }
    }
    res.status(200).json({ message: "Attendance Marked successfully" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
