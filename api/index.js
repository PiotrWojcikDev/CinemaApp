const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const movieRoute = require('./routes/movie');
const employeeRoute = require('./routes/employee');
const workScheduleEntryRoute = require('./routes/workScheduleEntry');
const seanceRoute = require('./routes/seance');
const reservationRoute = require('./routes/reservation');
const statisticRoute = require('./routes/statistic');
const app = express();

dotenv.config();

app.use(cors({
    origin:'http://localhost:5050',
    credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/movies', movieRoute);
app.use('/api/employees', employeeRoute);
app.use('/api/scheduleEntries', workScheduleEntryRoute);
app.use('/api/seances', seanceRoute);
app.use('/api/reservations', reservationRoute);
app.use('/api/statistics', statisticRoute);

app.use('/uploads', express.static('uploads'));

//Response Handler Middleware
app.use((obj, req, res, next) => {
    const statusCode = obj.status;
    const message = obj.message;
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a === obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data
    });
})

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to the database!');
    } catch (error) {
        throw error;
    }
}

connectMongoDB();

if(process.env.NODE_ENV !== 'test') {
    app.listen(process.env.SERVER_PORT, ()=> {
        console.log(`Server is listening on PORT ${process.env.SERVER_PORT}`);
    });
}

module.exports = app;