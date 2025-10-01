import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket'],
    auth: {
        token: localStorage.getItem("accessToken")
    }
});

export default socket;