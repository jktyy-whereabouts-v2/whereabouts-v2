const http = require("http");
// initialize Server instance of socket.io by passing it HTTP server obj on which to mount the socket server
import { Server, Socket } from 'socket.io';

interface SocketUser {
  phoneNumber: string;
  socketId: string;
};

interface Message {
  senderPhone: string;
  receiverPhone: string;
  text: string;
}


const httpServer = http.createServer();
let users: SocketUser[] = [];

const addUser = (phoneNumber: string, socketId: string) => {
  users.reduce((acc: number, user: SocketUser) => {
    if(user.phoneNumber === phoneNumber) acc++;
    return acc;
  }, 0) === 0 ? users.push({ phoneNumber, socketId });
};

const deleteUser = (socketId: string) => {
  users = users.filter((user: SocketUser) => {
    return user.socketId === socketId;
  })
};

const getUser = (phoneNumber: string) => {
  for(let user of users) {
    if(user.phoneNumber === phoneNumber) return user;
  }
};

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

io.on("connection", (socket: Socket) => {
  socket.on('addUser', phoneNumber => {
    addUser(phoneNumber, socket.id);
    io.emit('getUsers', users);
  }) ;

  socket.on('sendMessage', ({ senderPhone, receiverPhone, text }: Message) => {
    const user = getUser(receiverPhone);
    if(user) io.to(user.socketId).emit('getMessage', {
      senderPhone,
      receiverPhone,
      text
    })
  });

  socket.on('disconnect', () => {
    deleteUser(socket.id);
  })
});

httpServer.listen(3001);