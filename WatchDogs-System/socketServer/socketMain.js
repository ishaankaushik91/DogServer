import "./dbConnect.js";
import Machine from "./models/Machine.js";
import JWT from "jsonwebtoken";
import CryptoJS from "crypto-js";
import Tokens from "./models/Token.js";

function socketMain(io, socket) {
    // console.log("Someone pinged me, I am the mainsocket", socket.id);

    socket.on('clientAuth', async(key) => {

        try {
            
            let tokens = await Tokens.find({});
            let isValidUiClient = SearchKey(key, tokens[0].uiClientTokens);
            let isValidDogClient= SearchKey(key, tokens[0].dogClientTokens);

            console.log(isValidUiClient, isValidDogClient);

            if (isValidUiClient == -1 && isValidDogClient == -1)
            {
                 socket.emit('error', "Unauthorized Client");
                 socket.disconnect();
            }
            
            else
            {
                if (isValidUiClient != -1)
                {
                    socket.join("ui");
                }
                else
                {
                    socket.join("clients");
                }
            }

        } catch (error) {
            socket.disconnect(true);
            console.log(error);
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

function SearchKey(key, array)
{
    for (let i = 0; i < array.length; i++)
    {
        if (array[i].key == key)
        {
            return i;
        }
    }

    return -1;
}

export default socketMain;