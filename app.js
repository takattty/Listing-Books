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
const moment = require('moment');
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//create Server
const server = http.createServer(app);
server.listen(port);//この子が探しているサーバーの待ち状態。
server.on('error', onError);
server.on('listening', onListening);
const io = require('socket.io').listen(server);

//Routing
const homeRouter = require('./routes/home');
const accountRouter = require('./routes/account');
const accountSuccessRouter = require('./routes/account-success');
const roomIndexRouter = require('./routes/room-index');
const roomLoginRouter = require('./routes/room-login');
const roomCreateRouter = require('./routes/room-create');
const profileRouter = require('./routes/profile');
const chatRoomRouter = require('./routes/chat');

console.log('Server start!');

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

app.use('/', homeRouter);
app.use('/account', accountRouter);
app.use('/success', accountSuccessRouter);
app.use('/room', roomIndexRouter);
app.use('/room', roomLoginRouter);
app.use('/room', roomCreateRouter);
app.use('/profile', profileRouter);
app.use('/chat/room', chatRoomRouter);

//chat画面だけのルーティング
function sessionData(room, user){
	const room_id = room;
	const user_id = user;
	console.log(room_id, user_id);
}

io.on('connection', (socket) => {
	console.log('This is socket.id = ' + socket.id);
	socket.on('message', (msg) => {//フロントでデータを送信したら処理開始。
		console.log('サーバでの処理=' + msg);
		connection.query('SELECT name FROM account WHERE id=' + user_id, (err, userName) => {//必要なのはuser_id
			if(err) {
				console.log('セレクトミス');
			}
			const user_name = userName[0].name;//ここがuser_nameの箇所。これがDBから取得した値。
			console.log(user_name);
			const message_id = null;
			const time = String(moment().format('hh:mm'));
			const text = msg;
			const socketId = socket.id;
			const messageDb = { message_id, text, time, room_id, user_id, user_name };//保存に必要なデータ。DBとのやりとりが必要なのはuser_nameのみ
			const messageFront = { user_name, text, time, socketId };//表示に必要なデータ。DBとのやりとりに必要なのはuser_nameのみ
			connection.query('INSERT INTO message SET ?', messageDb,
				(err, results) => {
					if(err) {
						console.log('DBに保存出来てない〜〜');
						console.log(err);
					}
					console.log('DBに保存おっけい！！');
				})
			io.emit('message', messageFront);//フロントに渡すデータはここ。
		});
	});
});

app.use('/chat', router.get('/:id', function(req, res) {
	const room_id = req.session.room_id;//これはsessionに入ってる
	const user_id = req.session.user_id;//これも元々持ってる
	const query1 = 'SELECT text, time, user_name FROM message WHERE room_id=' + room_id;
	connection.query(query1, (err, rows1) => {
		const query2 = 'SELECT room_name FROM room WHERE room_id=' + room_id;//ルームの名前を引っ張ってきてる
		connection.query(query2, (err, rows2) => {
			const content = {
				roomid: room_id,//リンクの中で使用
				roomname: rows2[0].room_name,//リンクでルームの名前として使用
				date: rows1//ここにはSELECTで指定したプロパティが入ってる
			}
			res.render('chat',　content);//ここでフロントのレンダリング処理完了
		});
	});
	sessionData(room_id, user_id);
}));


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
