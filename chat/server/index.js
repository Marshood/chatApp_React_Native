var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var mongojs = require('mongojs');
const { Socket } = require('dgram');

var ObjectID = mongojs.ObjectID;
var db = mongojs(process.env.MONGO_URL || 'mongodb://localhost:27017/local');
var app = express();
var server = http.Server(app);
var websocket = socketio(server);

server.listen(3000, () => console.log('server listen on : 3000'));

var clients = {};
var users = {};
var chatID = 1;

websocket.on('connection', (socket) => {
    clients(socket.id) = socket;
    socket.on('userJoined', (userID) => onUserJoimed(userID, socket));
    socket.on('message', (message) => onMessageRecevied(message, socket));
})

function onUserJoimed(userID, socket) {
    try {
        if (!userID) {
            var user = db.collection('user').insert({}, (err, user) => {
                socket.emit('userJoined', user._id);
                users[socket.id] = user._id;
                _sendExsitMessage(socket);
            });
        } else {
            user[socket.id] = userID;
            _sendExsitMessage(socket);

        }

    } catch (err) {
        console.error(err);

    }

}

function onMessageRecevied(message, socket){
    var userID=users[senderSocket.id];
    if(!userID){
        return;
    }
    _sendAndSaveMessage(message,senderSocket);

}

function   _sendExsitMessage(socket){
    var message = db.collection('message')
    .find({chatID})
    .sort({createdAt:1})
    .toArray((err,message)=>{
        if(!message.length) return;
        socket.emit('message',message.reverse());
    })
}

function  _sendAndSaveMessage(message,socket,fromServer){

    var messageData={
        text:message.text,
        user:message.user,
        createdAt:new Date(message.createdAt),
        chatID:chatID

    };
    db.collection('message').insert(messageData,(err,message)=>{
        var emitter=fromServer ? websocket: socket.broadcast;
        emitter.emit('message',[message]);
    })

    var stdin =process.openStdin();
    stdin.addListener('data',function(d){

        _sendAndSaveMessage({
            test: d.toSting().trim(),
            createdAt: new Date(),
            user:{id:'root'}
        })
    },null,true);

}