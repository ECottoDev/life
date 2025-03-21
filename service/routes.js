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
const budgetDB = require('./budgetDatabase');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

//Resume Database Routes
//Education database connections
router.post('/resume/addEducationData', async (req, res) => {
    const { schoolName, schoolYear, concentration, graduated } = req.body;
    try {
        const result = await resumeDB.addEducationData(schoolName, schoolYear, concentration, graduated);
        res.json({ success: true, result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/resume/getEducationData', async (req, res) => {
    try {
        const result = await resumeDB.getEducationData();
        res.json({ data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
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

//Experience database connections
router.post('/resume/addExperienceData', (req, res) => {
    const { company, position, duties, timeWorked } = req.body;
    const result = resumeDB.addExperienceData(company, position, duties, timeWorked);
    result
        .then(data => res.json({ success: true }))
        .catch(err => console.log(err));
});
router.get('/resume/getExperienceData', (req, res) => {
    const result = resumeDB.getExperienceData();
    result
        .then(data => res.json({ data: data }))
        .catch(err => console.log(err));
}
);
router.patch('/resume/updateExperienceData', (request, response) => {
    const { id, company, position, duties, timeWorked } = request.body;
    const result = resumeDB.updateExperienceData(id, company, position, duties, timeWorked);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});
router.delete('/resume/deleteExperienceData', (req, res) => {
    const { id } = req.body;
    const result = resumeDB.deleteExperienceData(id);
    result
        .then(data => res.json({ success: data }))
        .catch(err => console.log(err));
});

//Skills database connections
router.post('/resume/addSkillsData', (req, res) => {
    const { name, skillLevel } = req.body;
    const result = resumeDB.addSkillsData(name, skillLevel);
    result
        .then(data => res.json({ success: true }))
        .catch(err => console.log(err));
});
router.get('/resume/getSkillsData', (req, res) => {
    const result = resumeDB.getSkillsData();
    result
        .then(data => res.json({ data: data }))
        .catch(err => console.log(err));
});
router.patch('/resume/updateSkillsData', (request, response) => {
    const { id, name, skillLevel } = request.body;
    const result = resumeDB.updateSkillsData(id, name, skillLevel);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});
router.delete('/resume/deleteSkillsData', (req, res) => {
    const { id } = req.body;
    const result = resumeDB.deleteSkillsData(id);
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
            return res.json({ success: true });
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

/************************* 
* Budget Database Routes
**************************/

router.get('/budget/getAllCardData', (req, res) => {
    const result = budgetDB.getAllCardData();
    result
        //console log result
        .then(data => console.log(res.json({ data: data })))
        .catch(err => console.log(err));
}
);

router.post('/budget/insertNewCard', (req, res) => {
    const { cardName, billing, amountDue, amountMinDue, loan } = req.body;
    // console.log('name:', cardName, 'billing:', billing, 'amountDue:', amountDue, 'amountMinDue:', amountMinDue, 'loan:', loan);

    const result = budgetDB.insertNewName(cardName, billing, amountDue, amountMinDue, loan);
    result
        .then(data => res.json({ success: true }))
        .catch(err => console.log(err));
});

//read


router.get('/budget/getBudget', (req, res) => {
    const result = budgetDB.getBudget();

    result
        .then(data => res.json({ data: data }))
        .catch(err => console.log(err));
}
);

router.get('/budget/getBank', (req, res) => {
    const result = budgetDB.getBank();

    result
        .then(data => res.json({ data: data }))
        .catch(err => console.log(err));
}
);

//update
router.patch('/budget/updateCard', (request, response) => {
    const { CardID, amountDue } = request.body;
    const result = budgetDB.updateCard(CardID, amountDue);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

router.patch('/updateBudget', (request, response) => {
    const { amount } = request.body;
    const result = budgetDB.updateBudget(amount);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

router.patch('/updateBank', (request, response) => {
    const { amount } = request.body;
    const result = budgetDB.updateBank(amount);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});


module.exports = router;
