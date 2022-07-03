import React from "react";
import socketio from "socket.io-client";
import { env } from "../env";
// import { env } from "../env";

export const socket = socketio.connect(env.socketUrl);
export const SocketContext = React.createContext();