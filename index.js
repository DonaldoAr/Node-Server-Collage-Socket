const path = require("path");
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const WebSocketServer = require("websocket").server;
const { client } = require("websocket");

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

app.set("port", 3000);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

function originIsAllowed(origin) {
    return true;
}
users = []
wsServer.on("request", (request) =>{
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + ' Conexión del origen ' + request.origin + ' rechazada.');
        return;
    }
    const connection = request.accept(null, request.origin);
    users.push({"ip":request.origin,"socket":connection});
    // console.log(user);
    console.log('conectado',request.origin);
    connection.on("message", (message) => {
        console.log("Mensaje recibido: " + message.utf8Data);
        users.forEach(function(user) {
            user.socket.send("recarga");
        });
    });
    connection.on("close", (reasonCode, description) => {
        console.log("El cliente se desconecto");
    });
});

server.listen(app.get('port'), () =>{
    console.log('Servidor iniciado en el puerto: ' + app.get('port'));
})
