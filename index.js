require("dotenv").config();

const express = require("express");

const app = express();

const cors = require("cors");

const auth = require("./middlewares/auth");

//module public
const routerProducts = require("./routes/public/products");
const routerLogin = require("./routes/public/login");

//module private
const routerUser = require("./routes/private/users");
const routerCategories = require("./routes/private/categories");

app.use(express.json());
app.use(cors());

//routes public
app.use("/login", routerLogin);
app.use("/products", routerProducts);

//routes private
app.use("/user", auth, routerUser);
app.use("/categories", auth, routerCategories);

app.get("/", (req, res) => {
    res.json({
        message: "It's alive!"
    })
});

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
