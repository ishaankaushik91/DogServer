import express from "express";
import cluster from "cluster";
import net from "net";
import { Server } from "socket.io";
import os from "os";
import farmhash from "farmhash";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import JWT from "jsonwebtoken";
import socketMain from "./socketMain.js";

const port = 8000;

const num_cores = os.cpus().length;


if (cluster.isPrimary) {
    /*
        Reason behind workers = []
        workers Array stores all the worker cpu threads in an array. We need to keep them to be able to reference them based on
        Source IP Addres. It is also useful to auto-restart the respective worker if any worker thread is dead.

    */
    let workers = [];
    let spawn = function (i) {
        workers[i] = cluster.fork();

        workers[i].on("exit", (code, signal) => {
            //log if you want to some file that this is dead worker.
            spawn(i);
        });
    }
    //Spawn Worker threads
    for (let i = 0; i < num_cores; i++) {
        spawn(i);
    }

    const worker_index = function (ip, len) {
        return farmhash.fingerprint32(ip) % len;
    }

    const server = net.createServer({ pauseOnConnect: true }, (connection) => {
        let worker = workers[worker_index(connection.remoteAddress, num_cores)];
        worker.send('sticky-session:connection', connection);
    });
    server.listen(port);
    console.log(`Master listening at ${port}`);
} else {
    /*
    Note : We do not use a port in this block because the master listens for all the worker threads.
     */
    let app = express();
    const server = app.listen(0, "localhost");     // Don't expose our internal server to the outside world.
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        }
    });
    const pubClient = createClient({ url: "redis://localhost:6379" });
    const subClient = pubClient.duplicate();


    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient));
    });

    // API for token based on wether the client is UI or a dog server
    app.get("/genTok", async (req, res) => {
        try {
            
            let token;
            
            if (req.body.clientType == "UI")
            {
                token = JWT.sign({
                    data: 'UI'
                  }, 'secret', { expiresIn: 60 * 60 });
            }
            else
            {
                token = JWT.sign({
                    data: 'dog'
                  }, 'secret', { expiresIn: 60 * 60 });
            }

            res.send(token);

        } catch (error) {
            console.log(error);
        }
    });

  

    io.on("connection", (socket) => {
        socketMain(io, socket);
        console.log("Connected to Worker Thread : ", cluster.worker.id);
    });

    // Listen to messages sent from the master. Ignore everything else.
    process.on('message', function (message, connection) {
        if (message !== 'sticky-session:connection') {
            return;
        }

        // Emulate a connection event on the server by emitting the
        // event with the connection the master sent us.
        server.emit('connection', connection);

        connection.resume();
    });
}
