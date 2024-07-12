const jwt = require("jsonwebtoken");
const CreateError = require("./error");

const checkToken = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    let token = "";
    if(authorizationHeader) 
        token = authorizationHeader.replace("Bearer ", "");

    if(!token)
        return next(CreateError(401, "Błąd autoryzacji - brak tokenu."));

    try {
        const decodedToken =  jwt.verify(token, process.env.JWT_SECRET_KEY);       
        next();
    } catch (error) {
        return next(CreateError(401, "Brak autoryzacji - token wygasł lub jest niepoprawny."));
    }
};

module.exports = checkToken;