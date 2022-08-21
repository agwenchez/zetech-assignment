const express = require('express')
const axios = require('axios')
const pool = require('../db')
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
// get names submitted
router.get('/all_students', async (req, res) => {

    try {
        let students = await pool.query('SELECT * FROM records INNER JOIN stages ON records.admission_no=stages.admission_no ORDER BY records.id ASC')
        students = students.rows
        .filter(student => student.stage  === '2')
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

// update finance approval by admission no
router.put('/approval', async (req, res) => {
    const { admission_no, remarks, processed_by, approved} = req.body;
    const stage = 5;
    // console.log("Student", req.body)

    try {
        // check existing
        const existingStudent = await pool.query("SELECT * FROM records WHERE admission_no = $1", [admission_no])
        if (existingStudent.rows.length) {
          res.status(409).json({ "response": 'A student with that admission number already exists' })
        }
    
        student_info = await pool.query('SELECT * FROM graduation_list WHERE admission_no = $1', [admission_no])
        // console.log("Student info",student_info.rows[0])
        const newStudent = await pool.query('INSERT INTO records(admission_no, remarks, processed_by, approved) VALUES($1,$2,$3,$4) RETURNING *', [admission_no, remarks, processed_by, approved])
        if (newStudent.rows.length) {
          const updateStage = await pool.query('UPDATE stages SET  stage = $1 WHERE ADMISSION_NO=$2 RETURNING *', [stage, admission_no])
          updateStage.rows.length && res.status(201).json({ "response": `Student: ${student_info.rows[0].fullname} has been aprroved successfully` });
          sendSMS(student_info.rows[0].phonenumber, `Dear "${student_info.rows[0].fullname}, you have been issued with your certificates.Thank you Zetech University`)
        }
    
      } catch (error) {
        // console.log((error))
        res.status(500).json({ "error": `An error occured: ${error}` })
      }
  })
module.exports = router