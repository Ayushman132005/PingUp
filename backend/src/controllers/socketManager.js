// import { connections } from "mongoose";
import { Server } from "socket.io";

let connections = [];
let messages = [];
let timeOnline = [];

export const connectToSocket = (server) => {

    const io = new Server(server);

    io.on("connection", (socket) => {

        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();
            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id);
            }
            if (messages[path] !== undefined ) {
                for (let m = 0; m < messages[path].length; m++) {
                io.to(socket.id).emit("chat-message", messages[path][m][data],
                    messages[path][m][sender],messages[path][m]['socket-id-sender'] );
                }
            }
        });

        socket.on("signal", (toId, message) => {
           io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom,found ] = Object.entries(connections)
            .reduce(([room,isFound],[roomKey,roomValue])=>{
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey,true];
                }
                return [room,isFound];
            },['',false]);

            if(found === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }
                messages[matchingRoom].push({"sender":sender,"data":data,'socket-id-sender':socket.id});
                console.log("message", key,":",sender,data);
                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender,socket.id);
                });
            }     
        });

        socket.on("disconnect", () => {
           var diffTime = Math.abs(new Date() - timeOnline[socket.id]);
           var key ;

           for (const [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
               for(let a=0; a < v.length; a++) {
                    if(v[a] === socket.id){
                         key = k;
                        for(let b=0;b<connections[key].length;b++){
                            io.to(connections[key][b]).emit("user-left", socket.id);
                        }
                        var index = connections[key].indexOf(socket.id);
                        connections[key].splice(index, 1);
                        if(connections[key].length === 0){
                            delete connections[key];
                            // delete messages[key];
                        }
                    }
               }
           }
            
        });
    });

  return io;
};
