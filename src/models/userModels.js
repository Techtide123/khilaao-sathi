// models/Food.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    uid : { type: String, required: true },
    profileImage : { type: String},
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
