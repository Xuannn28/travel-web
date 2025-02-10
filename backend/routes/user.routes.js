import express from 'express';
import User from '../models/user.js';
import authToken from '../middleware/authMiddleware.js';
import Trip from '../models/saved_trip.js';

const userRouter = express.Router();

userRouter.post('/plan-journey', authToken, async (req, res) => {
    try{
        const { departure, destination, start_date, end_date, num_people } = req.body;
        
        // extract JWT sign in id (mongoose id)
        const user = req.user.id;

        // create a new Trip object
        const newPlan = new Trip({departure, destination, start_date, end_date, num_people, user});
        await newPlan.save(); 

        // find user by mongoose id and update saved_trip field with Trip mongoose id
        const planId = newPlan._id;
        await User.findByIdAndUpdate (
            user,
            { $push: { saved_trip: planId }},  // push trip id into array
            { new: true, runValidators: false }  // return updated doc
        );

        return res.status(201).send({message: 'Plan saved successfully'});

    } catch (err) {

        console.log('Error saving plan', err);
        return res.status(400).send({message: 'Error saving plan', err});
    }
})

userRouter.get('/profile', authToken, async (req, res) => {
    try{
        // extract JWT sign in id (mongoose id)
        const userId = req.user.id;

        // find user by mongoose id
        const user = await User.findById(userId).populate('saved_trip');

        if (!user) {
            return res.status(404).send({ message: 'User not found '});

        }
        // user found, send user object back to frontend
        return res.status(200).send(user);
        
    } catch (err) {

        return res.status(500).send({ message: 'Error fetching profile', err});
    }
})

userRouter.delete('/del-plan/:id', async(req, res) => {
    try{
        // find trip and delete trip
        const { id } = req.params;
        const tripToDelete = await Trip.findByIdAndDelete(id);

        if (!tripToDelete){
            return res.status(404).send({ message: 'Trip to delete not found '});
        }

        return res.status(200).send({ message: 'Trip deleted successfully '});

    } catch (err) {
        return res.status(500).send({ message: 'Error deleting plan', err});
    }
})

export default userRouter;