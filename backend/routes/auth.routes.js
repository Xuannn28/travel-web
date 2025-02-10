import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import dotenv from 'dotenv';

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

        // authorise user login for an hour
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
    console.log('Log out called with body:', req.body);
    return res.status(200).send({ message: 'Logged out successfully' });
})

export default authRouter;