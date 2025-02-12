
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    departure:{
        type: String,
        required: [true, 'Departure is required'],

    },

    destination: {
        type: String,
        required: [true, 'Destination is required'],
    },

    start_date: {
        type: Date,
        get: function(date) {
            return date.toLocaleDateString('en-AU'); // Format: day/month/year
        },
        required: [true, 'Start date is required'],
    },

    end_date: {
        type: Date,
        required: [true, 'End date is required'],
        get: function(date) {
            return date.toLocaleDateString('en-AU'); // Format: day/month/year
        },


    },

    num_people: {
        type: Number,
        required: [true, 'Number of people is required']
    },

    user: [{  // an array of users references (IDs)
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
});

export default mongoose.model('Trip', tripSchema);