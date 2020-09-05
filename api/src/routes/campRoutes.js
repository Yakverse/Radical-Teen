const express = require('express');
const router = express.Router();
const campController = require('../controller/campController');

router.get('/camps', campController.allCamps)

router.post('/create-camp', campController.createCamp);
router.post('/inscrever', campController.inscriçãoCamp);

router.put('/edit-camp', campController.editCamp);

module.exports = router;