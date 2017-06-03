const five = require('johnny-five');
const io = require('socket.io').listen(3333);
const express = require('express');
const app = express();
const request_cli = require('request');
const nodemailer = require('nodemailer');
const fs = require('fs');
const authorize = require('./authorize');
const sendDataToSheet = require('./sendDataToSheet');

var led, servo, proximity, relay, motors = {};
var board = new five.Board();
var spreadsheetId;
var title = "";

board.on('ready', () => {
  this.repl = false
  relay = new five.Relay(10);
  led = new five.Led(13);
  servo = new five.Servo(8);
  motors = {
    left: new five.Motor({
      pins: {
        pwm: 10,
        dir: 9
      },
      invertPWM: true
    }),
    right: new five.Motor({
      pins: {
        pwm: 6,
        dir: 5
      },
      invertPWM: true
    })
  }
  motors.left.stop()
  motors.right.stop()
});

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tentostertotester@gmail.com',
    pass: 'toster123'
  }
});
app.get('/motion', (req, res) => {
  let mailOptions = {
    from: '"Toster" <tentostertotester@gmail.com>',
    to: 'tentostertotester@gmail.com',
    subject: 'Movement detected',
    html: '<b>Movement detected</b><br />' + espTimeWork
  };
  transporter.sendMail(mailOptions)
})

app.get('/data/*', (req, res) => {
  fullreq = req.originalUrl
  var temp = fullreq.substring(fullreq.indexOf("temp=") + 5, fullreq.indexOf("temp=") + 10);
  var hum = fullreq.substring(fullreq.indexOf("hum=") + 4, fullreq.indexOf("hum=") + 9)
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    authorize(JSON.parse(content), function (auth) {
      sendDataToSheet(auth, spreadsheetId, temp, hum, title).then((arg) => {
        spreadsheetId = arg[0]
        title = arg[1]
      });
    });
  });
});

app.listen(3000);

io.sockets.on('connection', (socket) => {
  socket.on('forward', (data) => {
    motors.left.forward(255)
    motors.right.forward(255);
  });
  socket.on('reverse', (data) => {
    motors.left.reverse(255)
    motors.right.reverse(255);
  });
  socket.on('stop', (data) => {
      motors.left.stop()
      motors.right.stop();
    })
    .on('left', () => {
      motors.left.reverse(255);
      motors.right.forward(255);
    })
    .on('right', () => {
      motors.right.reverse(255);
      motors.left.forward(255);
    })
    .on('bulbOn', () => {
      request_cli('http://192.168.0.18/bulbOn', (error, response, body) => {})
    })
    .on('bulbOff', () => {
      request_cli('http://192.168.0.18/bulbOff', (error, response, body) => {})
    })
});