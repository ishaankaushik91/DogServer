import "./dbConnect.js";
import Machine from "./models/Machine.js";
import JWT from "jsonwebtoken";

function socketMain(io, socket) {
    // console.log("Someone pinged me, I am the mainsocket", socket.id);

    socket.on('clientAuth', (key) => {

        let token = JWT.verify(key, 'TOKEN');

        if (key === "dog") {
            //A Valid dogServer client has joined
            socket.join("clients");
        } else if (key === "UI") {
            //A valid react UI client has joined
            socket.join("ui");
            console.log("A new React Client has joined");
        } else {
            //Its invalid socket client
            socket.disconnect(true);
        }
    });

    //When a machine connects, check if its new or already in DB
    socket.on("initPerfData", async (data) => {
        try {
            let machine = await Machine.findOne({ macA: data.macA });
            if (!machine) {
                let newMachine = new Machine(data);
                await newMachine.save()
                return console.log("Added");
            }
            console.log("Found already! So no adding");
        } catch (error) {
            console.log(error);
        }
    });


    socket.on('perfData', (data) => {
        //Broadcast to React UI App
        console.log("Tick is hapening finally...",data);
        io.to("ui").emit("data", data);
    });
}

export default socketMain;