
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userScheme = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
    },

    saved_trip: [{  // an array of saved trip references (IDs)
        type: mongoose.Schema.ObjectId,
        ref: 'Trip'
    }],

    reviews: [{  // an array of reviews references (IDs)
        type: mongoose.Schema.ObjectId,
        ref: 'Review'
    }],
    
});

// hash password to add extra layer of protection
userScheme.pre('save', async function (next) {
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
})

export default mongoose.model('User', userScheme);