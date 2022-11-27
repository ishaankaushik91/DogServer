import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(`mongodb+srv://ishaan:Ishaan123@cluster0.wucwolj.mongodb.net/watchdog-system`);
        console.log(`Mongo DB Connected`);
    } catch (error) {
        console.error(error);
    }
}

connectDB();