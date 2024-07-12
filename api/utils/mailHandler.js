const nodemailer = require('nodemailer');
const CreateSuccess = require('./success');
const CreateError = require('./error');
const User = require('../models/User')
const formatDate = require('./formatDate');

const sendResetPasswordEmail = (email, newToken, user, next) => {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    });
    
    const mailDetails = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: "Resetowanie hasła!",
        html: `
        <html>
        <head>
            <title>Resetowanie hasła</title>
        </head>
        <body>
            <h1>Prośba o zresetowanie hasła</h1>
            <p>Szanowny ${user.firstName},</p>
            <p>Otrzymaliśmy prośbę o zresetowanie hasła, aby to zrobić kliknij przycisk znajdujący się poniżej.</p>
            <a href="${process.env.LIVE_URL}/resetPassword/${newToken.token}" style="text-decoration: none;">
                <button style="background-color: #32a852; color: white; padding: 14px 20px; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);">
                    Zresetuj hasło
                </button>
            </a>
            <p>Link jest ważny tylko przez 5 minut. Jeżeli nie żądałeś zresetowania hasła, zignoruj tę wiadomość.</p>
            <p>Dziękujemy,</p>
            <p>Neo Cinema</p>
        </body>
        </html>
        `
    };

    mailTransporter.sendMail(mailDetails, async (err, data) => {
        if (err) {
            console.log(err);
            return next(CreateError(500, "Something went wrong while sending the email!"));
        } else {
            try {
                await newToken.save();
                return next(CreateSuccess(200, "Email Sent Successfully!"));
            } catch (error) {
                console.log(error);
                return next(CreateError(500, "Error while sending the email!"));
            }
            
        }
    });
};

const sendDeleteReservationConfirmation = async (reservation, next) => {

    const { email } = await User.findById(reservation.user._id);
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    });
    
    const mailDetails = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: "Anulowanie rezerwacji",
        html: `
        <html>
        <head>
            <title>Potwierdzenie anulowania rezerwacji</title>
        </head>
        <body>
            <h1>Potwierdzenie anulowania rezerwacji</h1>
            <p>Szanowny ${reservation.user.firstName},</p>
            <p>Informujemy o anulowaniu rezerwacji na seans: </p>
            <p>„${ reservation.seance.movie.title }” ${ formatDate(reservation.seance.dateOfSeance) } (miejsce ${ reservation.seatNumber })
            </p>
            <p>Z pozdrowieniami,</p>
            <p>Neo Cinema</p>
        </body>
        </html>
        `
    };
    mailTransporter.sendMail(mailDetails, (err, data) => {
        if (err) 
            reject(err); 
        else 
            resolve(data); 
    });
};



module.exports = {
    sendResetPasswordEmail,
    sendDeleteReservationConfirmation
}