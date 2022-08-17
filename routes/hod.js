const express = require('express')
const axios = require('axios')
const pool = require('../db')
const router = express.Router()

const sendSMS = async (phoneNumber, msg) => {

    console.log("Phone number", phoneNumber)
    let phone_number = phoneNumber.replace(/^0+/, "+254")

    try {
        const SMS = await axios.get(`http://cloud.nanodigital.co.ke:13012/cgi-bin/sendsms?user=equitelProd&pass=csms3qu1t3l&text=${msg}&to=${phoneNumber}&from=NANO&smsc=equitel1&coding=0&mclass=1&dlr-mask=31&priority=3`)
        // console.log("SMS response code==>", SMS.data)
    } catch (error) {
        console.log(`An error occurred:${error}`)
        return `An error occured:${error}`
    }
}


// get all students from graduation list
router.get('/all', async (req, res) => {

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
            sendSMS(phonenumber, `Dear ${fullname}, you have been added to the graduation list. Kindly login to the portal with your username as admission number and password below: ${newStudent.rows[0].password}. First you will be prompted to reset your password as desired and then fill the orders of names form to be verified by the HOD. Kindly do NOT SHARE your password. Thank you. Courtesy of Zetech University`)
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
        students = students.rows.filter(student => student.stage  === '1')
        res.status(200).json({ "data": students })

    } catch (error) {
        console.log((error))
        res.status(500).send(`An error occured: ${error}`)
    }

})

module.exports = router