const express = require('express')
const axios = require('axios')
const pool = require('../db')
const router = express.Router()

// get all students from orders of names
router.get('/all', async (req, res) => {

  try {
    const students = await pool.query('SELECT * FROM order_of_names ORDER BY fullname ASC')
    res.status(200).json({ "data": students.rows })

  } catch (error) {
    console.log((error))
    res.status(500).send(`An error occured: ${error}`)
  }

})

// Fill order of names form
router.post('/create_new', async (req, res) => {
  const stage = 1
  const { fullname, admission_no, year_of_admission, department, programme, phonenumber, email, id_no, guardian_phoneno } = req.body;

  try {
    // check existing
    const existingStudent = await pool.query("SELECT * FROM order_of_names WHERE admission_no = $1", [admission_no])
    if (existingStudent.rows.length) {
      res.status(409).json({ "response": 'A student with that admission number already exists' })
    }

    const newStudent = await pool.query('INSERT INTO order_of_names(fullname, admission_no, year_of_admission, department, programme, phonenumber, email, id_no, guardian_phoneno ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [fullname, admission_no, year_of_admission, department, programme, phonenumber, email, id_no, guardian_phoneno])
    if (newStudent.rows.length) {
      const updateStage = await pool.query('INSERT INTO stages(admission_no, stage) VALUES($1,$2) RETURNING *', [admission_no, stage])
      updateStage.rows.length && res.status(201).json({ "response": `${fullname}; You have successfully submitted your order of names to the HOD` });
    }

  } catch (error) {
    // console.log((error))
    res.status(500).json({ "error": `An error occured: ${error}` })
  }
})



// update order of names by admission no
router.put('/update', async (req, res) => {
  const { fullname, year_of_admission, department, programme, phonenumber, email, id_no, admission_no } = req.body;

  try {
    const updateStudent = await pool.query('UPDATE order_of_names SET FULLNAME = $1, YEAR_OF_ADMISSION = $2, DEPARTMENT = $3, PROGRAMME = $4, PHONENUMBER= $5, EMAIL = $6, ID_NO = $7 WHERE ADMISSION_NO = $8 RETURNING *', [fullname, year_of_admission, department, programme, phonenumber, email, id_no, admission_no]);
    res.status(201).json({ msg: `Student: ${updateStudent.rows[0].fullname} updated successfully`, data: updateStudent.rows[0] });

  } catch (error) {
    return res.status(500).send(`An error occured:${error}`)
  }

})



// delete a student by admission_no
router.delete('/delete', async (req, res) => {
  const { admission_no } = req.body

  try {
    const deleteStudent = await pool.query('DELETE FROM order_of_names WHERE ADMISSION_NO = $1 RETURNING *', [admission_no]);
    res.status(200).send(`Student:${deleteStudent.rows[0].fullname} deleted successfully`);
  } catch (error) {
    return res.status(500).send(`An error occured:${error}`)
  }
})




module.exports = router