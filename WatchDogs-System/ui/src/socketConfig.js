import io from "socket.io-client";

const socket = io.connect("http://localhost:8000");
socket.emit('clientAuth', "sdjfsdklfksdgldskgj");

// console.log(socket);
export default socket;