const express = require('express')
const axios = require('axios')
const bcrypt = require('bcrypt');
const pool = require('../db');
const { jwtGenerator } = require('../utils/jwtGenerator');
const router = express.Router()

const sendSMS = async (phoneNumber, msg) => {
    let phone_number;

    console.log("Phone number", phoneNumber)
    phone_number = phoneNumber.replace(/^0+/, "+254")

    try {
        const SMS = await axios.get(`http://cloud.nanodigital.co.ke:13012/cgi-bin/sendsms?user=equitelProd&pass=csms3qu1t3l&text=${msg}&to=${phone_number}&from=NANO&smsc=equitel1&coding=0&mclass=1&dlr-mask=31&priority=3`)
        // console.log("SMS response code==>", SMS.data)
    } catch (error) {
        console.log(`An error occurred:${error}`)
        return `An error occured:${error}`
    }
}



// register hod
router.post('/register_hod', async (req, res) => {
    const { fullname, email, password, department, role = 'hod' } = req.body;

    // const role = req.body.role ='shop_admin'
    console.log("Body", req.body)
    try {
        // find existing
        const checkExisting = await pool.query("SELECT * FROM HOD WHERE email = $1", [email])

        // if already exists throw error
        if (checkExisting.rows.length) {
            return res.status(409).send('HOD already exists')
        }

        // if new admin, encrypt password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt)
        console.log("Bcrypt pass", bcryptPassword)

        // add new admin to the db
        const newHod = await pool.query("INSERT INTO HOD(fullname,email,password,department,role) VALUES($1,$2,$3,$4,$5) RETURNING *", [fullname, email, bcryptPassword, department, role])
        const hod = newHod.rows[0]

        // gemerate jwt token
        const token = jwtGenerator(hod.hod_id)
        // console.log(token)

        return res.status(200).json({ "message": `New admin: ${fullname} added successfully`, token })


    } catch (error) {
        console.log(error);
        res.status(500).send(`An error occured:${error}`)
    }
})


// login an admin
router.post('/login_hod', async (req, res) => {
    const { email, password } = req.body;

    console.log("Body", req.body)
    try {

        const query = await pool.query("SELECT * FROM HOD WHERE EMAIL = $1", [email])

        // check if user is non-existent
        if (!query.rows.length) {
            return res.status(404).json({ msg: 'Password or email is invalid' })
        }

        const hod = query.rows[0]

        // check if passwords match with the encrypted from db
        const validPassword = await bcrypt.compare(password, hod.password)

        if (!validPassword) {
            return res.status(401).json({ msg: 'Password is incorrect' })
        }

        console.log("Admin id", hod.hod_id)
        // generate them a token
        const token = jwtGenerator(hod.hod_id);

        return res.status(200).json({ token: token, user: hod })


    } catch (error) {
        // console.log("error message=>", error.message);
        return res.status(500).send(`An error occured:${error}`)
    }
})


// get all students from graduation list
router.get('/all_students', async (req, res) => {

    try {
        const students = await pool.query('SELECT * FROM graduation_list ORDER BY fullname ASC')
        res.status(200).json({ "data": students.rows })

    } catch (error) {
        console.log((error))
        res.status(500).send(`An error occured: ${error}`)
    }

})

// add new student to graduation list
router.post('/add_student', async (req, res) => {

    const { fullname, admission_no, year_of_admission, department, programme, phonenumber, email, id_no } = req.body;
    try {

        // check existing
        const existingStudent = await pool.query("SELECT * FROM GRADUATION_LIST WHERE admission_no = $1", [admission_no])
        // console.log("Student", existingStudent)

        if (existingStudent.rows.length !== 0) {
            res.status(409).json({ "response": 'A student with that admission number already exists' })
        }
        const newStudent = await pool.query('INSERT INTO GRADUATION_LIST(fullname, admission_no, year_of_admission, department, programme, phonenumber, email, id_no ) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [fullname, admission_no, year_of_admission, department, programme, phonenumber, email, id_no])
        
        if(newStudent.rows[0]){
            sendSMS(phonenumber, `Dear ${fullname}, you have been added to the graduation list.First you will be have to reset your password as desired and then fill then login to be able to fill in orders of names form to be verified by the HOD. Kindly do NOT SHARE your password. Thank you. Courtesy of Zetech University`)
            res.status(201).json({ "response": `Student:${fullname} successfully added to graduation list` });
        }

    } catch (error) {
        console.log((error))
        res.status(500).json({ "error": `An error occured: ${error}` })
    }
})

// update a student by admission no
router.put('/update', async (req, res) => {

    try {
        const { fullname, year_of_admission, department, programme, phonenumber, email, id_no, admission_no } = req.body;
        const updateStudent = await pool.query('UPDATE GRADUATION_LIST SET FULLNAME = $1, YEAR_OF_ADMISSION = $2, DEPARTMENT = $3, PROGRAMME = $4, PHONENUMBER= $5, EMAIL = $6, ID_NO = $7 WHERE ADMISSION_NO = $8 RETURNING *', [fullname, year_of_admission, department, programme, phonenumber, email, id_no, admission_no]);
        res.status(201).json({ msg: `Student: ${updateStudent.rows[0].fullname} updated successfully`, data: updateStudent.rows[0] });
    } catch (error) {
        return res.status(500).send(`An error occured:${error}`)
    }
})

// delete a student by admission_no
router.delete('/delete', async (req, res) => {
    const { admission_no } = req.body

    try {
        const deleteStudent = await pool.query('DELETE FROM GRADUATION_LIST WHERE ADMISSION_NO = $1 RETURNING *', [admission_no]);
        res.status(200).send(`Student:${deleteStudent.rows[0].fullname} deleted successfully`);
    } catch (error) {
        return res.status(500).send(`An error occured:${error}`)
    }
})

// get order of names submitted
router.get('/order_of_names', async (req, res) => {

    try {
        let students = await pool.query('SELECT * FROM order_of_names INNER JOIN stages ON order_of_names.admission_no=stages.admission_no ORDER BY fullname ASC')
        students = students.rows
        .filter(student => student.stage  === '1')
        .map( student => {
            console.log("Student", student)
            return {...student, date: student.date.toUTCString()}
        })
        console.log("Students", students)
        res.status(200).json({ "data": students })

    } catch (error) {
        console.log((error))
        res.status(500).send(`An error occured: ${error}`)
    }

})

// update order of names by admission no
router.put('/order_of_names/approval', async (req, res) => {
    const { fullname, year_of_admission, department, programme, phonenumber, email, id_no, approved , admission_no, guardian_phoneno, processed_by } = req.body;
    const stage = 2;
    
    try {
      const updateStage = await pool.query('UPDATE stages SET  stage = $1 WHERE ADMISSION_NO=$2 RETURNING *', [stage, admission_no])
      const updateStudent = await pool.query('UPDATE order_of_names SET FULLNAME = $1, YEAR_OF_ADMISSION = $2, DEPARTMENT = $3, PROGRAMME = $4, PHONENUMBER= $5, EMAIL = $6, ID_NO = $7, APPROVED = $8, GUARDIAN_PHONENO = $9, PROCESSED_BY = $10 WHERE ADMISSION_NO = $11 RETURNING *', [fullname, year_of_admission, department, programme, phonenumber, email, id_no, approved, guardian_phoneno, processed_by, admission_no]);
      
      if(updateStage.rows.length && updateStudent.rows.length){
         sendSMS(phonenumber, `Dear ${fullname}, your order of names has been successfully approved. Proceeded to the library`)
         return res.status(201).json({ msg: `Student: ${updateStudent.rows[0].fullname} updated successfully`, data: updateStudent.rows[0] });
      }
      
    } catch (error) {
      return res.status(500).send(`An error occured:${error}`)
    }
  
  })

module.exports = router