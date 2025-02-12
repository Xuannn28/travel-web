
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// load .env file
dotenv.config();

const authToken = (req, res, next) => {
    // extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // token undefined
    if (!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // token exist
    try {

        // verify token
        const user = jwt.verify(token, process.env.JWT_SECRET );
        
        // attach user info to req
        req.user = user;

        console.log('Authorized by authToken');
        next();

    } catch (err) {
        console.log('Forbidden error', err)
        return res.status(403).json({ message: 'Forbidden '})
    }
}

export default authToken;