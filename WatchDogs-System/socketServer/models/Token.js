import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
    uiClientTokens : {
        type : [{key : {type : String}, macA : {type : String}}]
    },
    dogClientTokens: {
        type : [{key : {type : String}, macA : {type : String}}]
    }
});

export default mongoose.model("AccessTokens", machineSchema, "tokens");