const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const debug = require('debug')('sharechat:server');
const http = require('http');
const router = express.Router();
const connection = require('./mysqlConnection');
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);//この子が探しているサーバーの待ち状態。
server.on('error', onError);
server.on('listening', onListening);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const accountRouter = require('./routes/account');
const accountSuccessRouter = require('./routes/account-success');
const roomIndexRouter = require('./routes/room-index');
const roomLoginRouter = require('./routes/room-login');
const roomCreateRouter = require('./routes/room-create');
//const chatTextRouter = require('./routes/chat-text');
const profileRouter = require('./routes/profile');
const chatRoomRouter = require('./routes/chat');

console.log('Server start!');
//Socket.io
const io = require('socket.io').listen(server);
io.on('connection', (socket) => {
	socket.on('message', (msg) => {
	  console.log('サーバでの処理=' + msg);
		io.emit('message', msg);
	});
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
	secret: 'sharechat-secret',
	resave: false,
	saveUninitialized: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/users', usersRouter);
app.use('/', homeRouter);
app.use('/account', accountRouter);
app.use('/success', accountSuccessRouter);
app.use('/room', roomIndexRouter);
app.use('/room', roomLoginRouter);
app.use('/room', roomCreateRouter);
app.use('/profile', profileRouter);

app.use('/chat/room', chatRoomRouter);
//chat画面だけのルーティング
app.use('/chat', 
	router.get('/:id', function(req, res) {
	    let room_id = req.params.id;//roomの識別
	    console.log('room_id=' + room_id);
	    let sessionId = req.session.room_id;//ちゃんとログインしたかの確認
	    console.log('this is room_session_id =' + sessionId);
	    let user_id = req.session.user_id;//人の識別
	    console.log('user_session_id is = ' + user_id);
	    let query1 = 'SELECT text, time, user_name FROM message WHERE room_id=' + room_id;
	    connection.query(query1, (err, rows1) => {
	        //console.log(rows1);//POSTで保存しに持っていった値の前のデータを表示する。
	        let query2 = 'SELECT room_name FROM room WHERE room_id=' + room_id;
	        connection.query(query2, (err, rows2) => {
	        //console.log(rows2);
	            let content = {
	                roomid: room_id,
	                roomname: rows2[0].room_name,
	                date: rows1
	            }
	            res.render('chat',　content);
	            //ここで渡している値って言うのはsocketではなくDBの値なので、フロントに反映させる時に工夫が必要。
	        });
		});
	})
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};	

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);
  
	if (isNaN(port)) {
	  // named pipe
	  return val;
	}
  
	if (port >= 0) {
	  // port number
	  return port;
	}
  
	return false;
}
  
  /**
   * Event listener for HTTP server "error" event.
   */
  
function onError(error) {
	if (error.syscall !== 'listen') {
	  throw error;
	}
  
	const bind = typeof port === 'string'
	  ? 'Pipe ' + port
	  : 'Port ' + port;
  
	// handle specific listen errors with friendly messages
	switch (error.code) {
	  case 'EACCES':
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
		break;
	  case 'EADDRINUSE':
		console.error(bind + ' is already in use');
		process.exit(1);
		break;
	  default:
		throw error;
	}
}
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
	  ? 'pipe ' + addr
	  : 'port ' + addr.port;
	debug('Listening on ' + bind);
}  

module.exports = app;
