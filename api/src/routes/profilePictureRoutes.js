import multer from 'multer';
import express from 'express'
const router = express.Router();
const profilePictureController = require('../controller/profilePictureController');
import Multer from '../lib/Multer'

router.post('/profile-picture', multer(Multer).single('file'), profilePictureController.savePicture);
router.delete('/profile-picture', profilePictureController.deletePicture);

module.exports = router;