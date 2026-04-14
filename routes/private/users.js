const db = require("../../models/public/db");
const express = require("express");
const bcrypt = require('bcrypt');

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const results = await db.selectUsers(page, limit);

        return res.status(results.status).json(results);
    } catch {
        return response = {
            status: 500,
            message: "erro no servidor, tente novamente"
        }
    }
});

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    try{

        if (isNaN(id) || id <= 0) {
            const response = {
                status: 400,
                message: "id de usuario negativo ou igual a zero, tente outro id"
            }
            return res.status(response.status).json(response);
        }

        const results = await db.selectUser(id);

        return res.status(results.status).json(results);
    } catch (error){
        const response = {
            status: 500,
            message: "erro no servidor, Usuario nao encontrado"
        }
        return res.status(response.status).json(response);
    }
})

router.post("/", async (req, res) => {
    const user = req.body;
    try {
        
        const salt = await bcrypt.genSalt(8);
        const hashPassword = await bcrypt.hash(user.password, salt);

        const newUser = {
            email: user.email,
            cellPhone: user.cellPhone,
            name: user.name,
            role: user.role || 'user',
            roleDescription : user.roleDescription,
            password: hashPassword
        }

        const insertNewUser = await db.insertUser(newUser);

        return res.status(insertNewUser.status).json(insertNewUser);
    } catch {
        const response = {
            status: 500,
            message: "erro no servidor"
        }
        return res.status(response.status).send(response);
    }
});

router.patch("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.body;

    try {
        if (isNaN(id) || id <= 0) {
            const response = {
                status: 400,
                message: "ID de usuário negativo ou igual a zero, tente outro ID"
            };
            return res.status(response.status).json(response);
        }

        // 1. Crie uma cópia do objeto 'user'
        const userToUpdate = { ...user };

        // 2. Criptografe a senha APENAS se ela for fornecida
        if (userToUpdate.password) {
            const salt = await bcrypt.genSalt(8);
            userToUpdate.password = await bcrypt.hash(userToUpdate.password, salt);
        }
        
        // 3. Verifique se o objeto de atualização tem dados para evitar chamadas desnecessárias ao banco de dados
        if (Object.keys(userToUpdate).length === 0) {
             const response = {
                status: 400,
                message: "Nenhum dado para atualização foi fornecido."
            };
            return res.status(response.status).json(response);
        }

        console.log(userToUpdate);

        const update = await db.updateUser(id, userToUpdate);

        return res.status(update.status).json(update);

    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: "Erro no servidor, tente novamente!"
        };
        return res.status(response.status).json(response);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt( req.params.id );

        if (isNaN(id) || id <= 0) {
            const response = {
                status: 400,
                message: "id de usuario negativo ou igual a zero, tente outro id"
            }
            return res.status(response.status).json(response);
        }

        const del = await db.deleteUser(id);

        if ( del.status === 200 ) {
            const response = {message: del.message};
            return res.status(del.status).json(response)

        } else if ( del.status === 404 ) {
            const response = {message: del.message};
            return res.status(del.status).json(response);

        }

    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: "Erro no servidor, tente novamente mais tarde!"
        }
        return res.status(response.status).json(response);
    }
})


module.exports = router;