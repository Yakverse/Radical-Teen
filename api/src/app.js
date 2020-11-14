import 'dotenv/config';
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import BullBoard from 'bull-board'
import Queue from './lib/Queue'

const app = express();
BullBoard.setQueues(Queue.queues.map(queue => queue.bull));

//Middleware CORS
app.use((req, res, next) => {
    var allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080', "https://lucasmodolo22.github.io", "https://radical.com.br"];
    var origin = req.headers.origin;
    // if(allowedOrigins.indexOf(origin) > -1){
    //     res.setHeader('Access-Control-Allow-Origin', origin);
    // }
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin");
    res.header("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    app.use(cors({
        origin: origin,
        credentials: true
    }));
    next();
});

const router = express.Router();

// Connect DB
mongoose.set('useCreateIndex', true);
if (!process.env.NODE_ENV) mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

//Models
const User = require('./models/userModel');
const Camp = require('./models/campModel');

//Rotes
const userRoute = require('./routes/userRoutes');
const campRoute = require('./routes/campRoutes');
const profilePictureRoute = require('./routes/profilePictureRoutes');

app.use('/queues', BullBoard.UI);
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.unsubscribe(bodyParser.urlencoded({ extended: false }));

app.use('/', userRoute);
app.use('/', campRoute);
app.use('/', profilePictureRoute);

module.exports = app;