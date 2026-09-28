import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        required: true 
    },
    lastname: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String,
        enum: ["user", "admin", "manager"], 
        default: "user" 
    }
},
{timestamps: true});

export const UserModel = mongoose.model("users", userSchema);