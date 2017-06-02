var io = require('socket.io').listen(3333);

io.sockets.on('connection', function (socket) {
  console.log('connection');
  socket.on('test', function (data) {
    console.log('serverserver data', data);
  });
});