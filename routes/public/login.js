const express = require("express");
const db = require("../../models/public/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

//router login
router.post("/", async (req, res) => {
    try {
        const userInfo = req.body;
        const loginResults = await db.loginUser(userInfo);
        return res.status(loginResults.status).json(loginResults);
        
    } catch (error) {
        console.log(error);
        
        const response = {
            status: 500,
            message: "Verifique seus dados e tente realizar o login novamente!"
        }
        return res.status(response.status).json(response);
    }
})

module.exports = router;

