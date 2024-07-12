const User = require('../models/User');
const UserToken = require('../models/UserToken');
const CreateSuccess = require('../utils/success');
const CreateError = require('../utils/error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendResetPasswordEmail } = require('../utils/mailHandler');

class AuthController {
    async register(req, res, next) {
        try {
            const salt = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hashedPassword,
            })
            await newUser.save();
            return next(CreateSuccess(200, "Zarejestrowano!"));
        } catch (error) {
            if (error.code === 11000) { //błąd unikalności
                return next(CreateError(400, "Użytkownik o podanym mailu już istnieje!"));
            } else {
                return next(CreateError(500, "Wewnętrzny błąd serwera!"));
            }
        }
    };
    
    async login(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if(!user)
                return next(CreateError(404, "Użytkownik o podanym emailu nie został znaleziony!"));
    
            const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
            if(!isPasswordCorrect) 
                return next(CreateError(400, "Błędne hasło!"));
            
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            )
            res.header("Access-Control-Expose-Headers", "Authorization");
            res.setHeader("Authorization", `Bearer ${token}`); // Dodaj token do nagłówka
    
            return res.status(200).json({ 
                status: 200, 
                message: "Zalogowano!",
                data: user
            });
    
        } catch (error) {
            return next(CreateError(500, "Wewnętrzny błąd serwera!"));
        }
    }

    async forgotPassword(req, res, next) {
        const email = req.body.email;
        const user = await User.findOne({ email: { $regex: '^' + email + '$', $options: 'i' } });
        if (!user) {
            return next(CreateError(404, "User not found to reset the email!"));
        }
    
        const newToken = new UserToken({
            userId: user._id,
        });

        sendResetPasswordEmail(email, newToken, user, next);
    };

    async resetPassword(req, res, next) {
        const token = req.body.token;
        const newPassword = req.body.password;
    
        
        const userToken = await UserToken.findOne({ token });
    
        if (!userToken) {
            return next(CreateError(500, "Reset Link is Expired!"));
        }
    
        const user = await User.findById(userToken.userId);
        if (!user) {
            return next(CreateError(500, "User not found!"));
        }
    
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(newPassword, salt);
    
        user.password = encryptedPassword;
    
        try {
            await user.save();
            await UserToken.deleteOne({ _id: userToken._id });
    
            return next(CreateSuccess(200, "Password Reset success!"));
        } catch (error) {
            return next(CreateError(500, "Something went wrong!"));
        }
    };
}

module.exports = AuthController;