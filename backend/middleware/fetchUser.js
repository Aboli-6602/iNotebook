const jwt = require("jsonwebtoken");
const JWT_SECRET = "this is a secret.";

const fetchUser = (req, res, next)=>{
    const token = req.header("auth-token");
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        res.send("Authenticate using a valid token");
    }

    
}

module.exports = fetchUser;