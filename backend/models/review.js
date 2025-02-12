
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    rating : {
        type: Number,
        required: [true, 'Rating is required'],
    },

    review : {
        type: String,
    },

    user: [{  // an array of users references (IDs)
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],

});

export default mongoose.model('Review', reviewSchema);