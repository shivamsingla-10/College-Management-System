import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getManager } from "typeorm";

export const studentLogin = async (req, res) => {
  const manager = getManager();

  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingStudent = await manager.query(
      `select * from student where username="${username}"`
    );
    if (!existingStudent.length) {
      errors.usernameError = "Student doesn't exist.";
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
        id: existingStudent[0].id,
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
      `update student set password="${hashedPassword}" where email="${email}"`
    );
    const student = await manager.query(
      `select * from student where email="${email}"`
    );
    if (student[0].passwordUpdated === 0) {
      await manager.query(
        `update student set passwordUpdated=1 where email="${email}"`
      );
    }
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: student[0],
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      batch,
      section,
      year,
      fatherName,
      motherName,
      fatherContactNumber,
    } = req.body;
    const manager = getManager();
    if (name) {
      await manager.query(
        `update student set name="${name}" where email="${email}"`
      );
    }
    if (dob) {
      await manager.query(
        `update student set dob="${dob}" where email="${email}"`
      );
    }
    if (department) {
      await manager.query(
        `update student set department="${department}" where email="${email}"`
      );
    }
    if (contactNumber) {
      await manager.query(
        `update student set phone=${contactNumber} where email="${email}"`
      );
    }
    if (batch) {
      await manager.query(
        `update student set batch="${batch}" where email="${email}"`
      );
    }
    if (section) {
      await manager.query(
        `update student set section="${section}" where email="${email}"`
      );
    }
    if (year) {
      await manager.query(
        `update student set year=${year} where email="${email}"`
      );
    }
    if (motherName) {
      await manager.query(
        `update student set motherName="${motherName}" where email="${email}"`
      );
    }
    if (fatherName) {
      await manager.query(
        `update student set fatherName="${fatherName}" where email="${email}"`
      );
    }
    if (fatherContactNumber) {
      await manager.query(
        `update student set fatherContactNumber=${fatherContactNumber} where email="${email}"`
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

export const testResult = async (req, res) => {
  const manager = getManager();

  try {
    const { department, year, section } = req.body;
    const errors = { notestError: String };
    const student = await manager.query(
      `select * from student where department="${department}" and year=${year} and section="${section}"`
    );

    const test = await manager.query(
      `select * from test where department="${department}" and year=${year} and section="${section}"`
    );

    if (test.length === 0) {
      errors.notestError = "No Test Found";
      return res.status(404).json(errors);
    }
    var result = [];
    for (var i = 0; i < test.length; i++) {
      var subjectCode = test[i].subjectCode;
      var subject = await manager.query(
        `select * from subject where subjectCode="${subjectCode}"`
      );
      var marks = await manager.query(
        `select * from marks where studentId=${student[0].id} and testId="${test[i].test}"`
      );
      if (marks.length) {
        var temp = {
          marks: marks[0].marks,
          totalMarks: test[i].totalMarks,
          subjectName: subject[0].subjectName,
          subjectCode: subjectCode,
          test: test[i].test,
        };

        result.push(temp);
      }
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const attendance = async (req, res) => {
  const manager = getManager();
  try {
    const { id,department, year, section } = req.body;
    const errors = { notestError: String };
    console.log(req.body);
    const student = await manager.query(
      `select * from student where department="${department}" and year=${year} and section="${section}"`
    );
    const attendance = await manager.query(
      `select * from subject t INNER JOIN attendance a on a.sid=${id} and t.subjectCode=a.subCode`
    );
    if (!attendance.length) {
      res.status(400).json({ message: "Attendance not found" });
    }
    console.log(attendance);

    res.status(200).json({
      result: attendance.map((att) => {
        let res = {};
        console.log(att.lecAttended);
        res.percentage = ((att.lecAttended / att.totalLectures) * 100).toFixed(2);
        res.subjectCode = att.subjectCode;
        res.subjectName = att.subjectName;
        res.attended = att.lecAttended;
        res.total = att.totalLectures;
        console.log(res);
        return res;
      }),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
