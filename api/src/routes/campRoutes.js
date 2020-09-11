const express = require('express');
const router = express.Router();
const campController = require('../controller/campController');

router.get('/camps', campController.allCamps)

router.post('/camp-admin', campController.getCamp)
router.post('/create-camp', campController.createCamp);
router.post('/inscrever', campController.inscriçãoCamp);

router.put('/edit-camp', campController.editCamp);
router.put('/change-status', campController.editStatus);

router.delete('/delete-camp', campController.deleteCamp);
router.delete('/delete-user', campController.deleteUser);

module.exports = router;