import React from "react";
import socketio from "socket.io-client";
import { env } from "../env";
export const socket = socketio.connect(env.SocketUrl);
export const SocketContext = React.createContext();