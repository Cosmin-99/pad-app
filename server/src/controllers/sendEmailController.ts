import { Request, Response } from "express";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { QueryResult } from "pg";
import { pool } from "../database/database";

export const sendEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user: QueryResult = await pool.query("SELECT * FROM Users WHERE email LIKE $1", [email]); //get user data
        const resetPasswordRequest = await pool.query(` 
    INSERT INTO ResetPassword ("firstname", "lastname", "email") VALUES ($1, $2, $3)
    `,
            [
                user.rows[0].firstname,
                user.rows[0].lastname,
                email
            ]); //and save his request for reset password into database

        //create reusable transporter object using the default SMPT transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            debug: false,
            logger: true
        })

        //send email with defined transport object
        const info: Promise<Mail> = await transporter.sendMail({
            from: '"Tech Store support team" <support@techstore.com>',
            to: email,
            subject: "Reset Password",
            text: "Click the follow link to reset your password . This URL is avaliable 24hrs and can be accessed only once !!!",
            html: "<p>Click the follow link to reset your password . This URL is avaliable 24hrs and can be accessed only once !!!</p>"
        })

        return res.status(200).json({
            message: "Email Sent!"
        })

    } catch (err) {
        return res.status(400).json(err)
    }
}