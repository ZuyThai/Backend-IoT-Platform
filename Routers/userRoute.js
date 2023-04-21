const express = require('express');
const upload = require("../cloudinary/multer");
const { getProfile, updateProfile} = require('../Controllers/userController');
const { verifyToken } = require('../Middlewares/verifyToken');
const Router = express.Router();

Router.get('/myprofile', verifyToken, getProfile);
Router.put('/update', upload.single('avatar'), verifyToken, updateProfile);

module.exports = Router;