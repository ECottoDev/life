/**
* routes.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-04 initial version
*/
const express = require('express');
const router = express.Router();
const resumeDB = require('./resumeDatabase');
const loginDB = require('./loginDatabase');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

//Resume Database Routes
//Education database connections

router.get('/resume/getEducationData', async (req, res) => {
    try {
        const result = await resumeDB.getEducationData();
        res.json({ data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/resume/addEducationData', async (req, res) => {
    const { schoolName, schoolYear, concentration, graduated } = req.body;
    const result = await resumeDB.addEducationData(schoolName, schoolYear, concentration, graduated);

    result
        .then(data => res.json({ success: data }))
        .catch(err => console.log(err));
});

router.patch('/resume/updateEducationData', (request, response) => {
    const { id, schoolName, schoolYear, concentration, graduated } = request.body;
    const result = resumeDB.updateEducationData(id, schoolName, schoolYear, concentration, graduated);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});
router.delete('/resume/deleteEducationData', (req, res) => {
    const { id } = req.body;
    const result = resumeDB.deleteEducationData(id);
    result
        .then(data => res.json({ success: data }))
        .catch(err => console.log(err));
});
//session routes
router.post('/session/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ error: 'Username or password missing in request body' });
    }
    try {
        const isValid = await loginDB.isValidUser(username, password);
        if (isValid) {
            const result = await loginDB.logIntoSystem(username, password);
            return res.json(result);
        }
        else console.log('invalid user');
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/session/logout', async (req, res) => {
    const { username } = req.body;
    try {
        const result = await loginDB.sessionDestroyer(username);
        return res.json(result);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/session/verify', async (req, res) => {
    const { username } = req.body;
    try {
        const result = await loginDB.sessionVerify(username);
        res.json({ success: true });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/session/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await loginDB.registerUser(username, password);
        console.log('result:', result);
        res.json(result);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


module.exports = router;
