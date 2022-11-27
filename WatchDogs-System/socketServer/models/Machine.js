import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
    osType: {
        type: String
    },
    upTime: {
        type: Number
    },
    freeMem: {
        type: Number
    },
    totalMem: {
        type: Number
    },
    usedMem: {
        type: Number
    },
    memUsage: {
        type: Number
    },
    cpuModel: {
        type: String
    },
    cpuSpeed: {
        type: Number
    },
    numCores: {
        type: Number
    },
    cpuLoad: {
        type: Number
    },
    macA: {
        type: String,
        unique: true
    }
});

export default mongoose.model("Machine", machineSchema, "machines");