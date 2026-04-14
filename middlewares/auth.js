const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;

        if (!bearerToken.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: "Formato de token inválido. Use: Bearer <token>"
            });
        }

        const token = bearerToken.replace("Bearer ", "");

        if (!token) {
            const response = {
                status: 401,
                message: "Acesso negado"
            }
            return res.status(response.status).json(response);
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded.user_id;
        req.Email = decoded.email;
        req.Name = decoded.name;
        req.role =decoded.role;


        next();
    } catch {
        const response = {
            status: 401,
            message: "token invalido"
        }
        return res.status(response.status).json(response);
    }
}

module.exports = auth;