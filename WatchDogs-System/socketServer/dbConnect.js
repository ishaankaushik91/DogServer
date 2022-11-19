import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect("UR DB");
        console.log(`Mongo DB Connected`);
    } catch (error) {
        console.error(error);
    }
}

connectDB();