import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

// load .env file
dotenv.config();

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// sign in
authRouter.post('/sign-up', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = new User({email, password});
        await user.save();
        return res.status(201).send({message: 'Registered successfully'});

    } catch (err) {
        return res.status(400).send({message: 'Error registering user', err});
    }
});

// login
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'User not found '});
        }

        // check if user entered correct password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).send({ message: 'Invalid password'});
        }

        // authorise user login 
        const token = jwt.sign({ id: user._id}, JWT_SECRET, { expiresIn: '5h'});
        console.log('Authorised login!')
        return res.send({ email: user.email, token})

    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).send({ message: 'Error logging in:', err});
    }
});

authRouter.post('/log-out', (req, res) => {
    console.log('Log out called with headers:', req.headers);
    return res.status(200).send({ message: 'Logged out successfully' });
});

authRouter.post('/forgot-password', async (req, res, next) => {
    const { email } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'User not found '});
        }

        // generate a password reset token
        const secret = JWT_SECRET + user.password;
        const token = jwt.sign({ id: user._id}, secret, { expiresIn: '1h'});
        const resetURL = `http://localhost:8080/reset-password?id=${user._id}&token=${token}`;

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // mailing content send to user
        const mailOptions = {
            to: user.email,
            from: process.env.USER_EMAIL,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n
            Please click on the following link, or paste this into your browser to complete the process: \n\n
            ${resetURL}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,

        };

        // send email
        await sgMail.send(mailOptions);

        return res.status(200).json({ message: 'Password reset link sent'});
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Something went wrong on request reset password', err});
    }
});


authRouter.post('/reset-password', async (req, res, next) => {
    const { id, token } = req.query;
    const { password } = req.body;

    try {

        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({ message: 'User not exists! '});
        }

        const secret = JWT_SECRET + user.password;
        const verify = jwt.verify(token, secret);
        const encryptedPwd = await bcrypt.hash(password, 10);
        
        await User.updateOne(
            { _id: id },
            { $set: { password: encryptedPwd }},
        );

        await user.save();

        return res.status(200).json({ message: 'Password has been reset'});

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong on reset password', err});
    }
});

export default authRouter;