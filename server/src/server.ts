import express from 'express';
import chalk from 'chalk';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes';
import { appRoutes } from './routes/appRoutes';
import cors from 'cors';
import passport, { session } from 'passport';
import { passportConfig } from './strategies/passport';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors())
app.use(morgan('tiny'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(session({ pauseStream: true}));
app.use(passport.initialize());
app.use(passport.session());

passportConfig();

app.use('/api/auth/', authRouter);
app.use('/api/app/', appRoutes);

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.listen(port, () => {
    console.log(`Server running on port: ${chalk.green(port)}`);
});
