const express = require("express");
const db = require("../../db/public/db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        //paginação
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const results = await db.selectCategories(page, limit);

        return res.json(results);
    } catch {
        return response = {
            status: 500,
            message: "Erro no servidor, tente novamente"
        }
    }
});

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    try{
        if (isNaN(id) || id <= 0) {
            const response = {
                status: 400,
                message: "Id da categoria negativo ou igual a zero, tente outro id"
            }
            return res.status(response.status).json(response);
        }
        
        const results = await db.selectCategory(id);

        return res.status(results.status).json(results);
    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: "Erro no servidor, categoria nao encontrada"
        }
        return res.status(response.status).json(response);
    }
})

router.post("/", async (req, res) => {
    const category = req.body;
    try {

        const newCategory = {
            category_id: category.category_id,
            name: category.name,
            descriptions: category.descriptions
        }
        const insertNewCategory = await db.insertCategory(newCategory);

        return res.status(insertNewCategory.status).json(insertNewCategory);
    } catch (e) {
        console.log(e);
        const response = {
            status: 500,
            message: "Erro no servidor"
        }
        return res.status(response.status).send(response);
    }
});

router.patch("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const category = req.body;

    try {

        if (isNaN(id) || id <= 0) {
            const response = {
                status: 400,
                message: "Id da categoria negativo ou igual a zero, tente outro id"
            }
            return res.status(response.status).json(response);
        }

        const updateCategory = {
            category_id: category.category_id,
            name: category.name,
            descriptions: category.descriptions
        }

        const update = await db.updateCategory(id, updateCategory);

        return res.status(update.status).json(update);
        
    } catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: "Erro no servidor, tente novamente!"
        }
        return res.status(response.status).json(response);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt( req.params.id );

        if (isNaN(id) || id <= 0) {
            const response = {
                status: 400,
                message: "id da categoria negativo ou igual a zero, tente outro id"
            }
            return res.status(response.status).json(response);
        }

        const del = await db.deleteCategory(id);

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