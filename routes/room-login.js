const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

/* GET home page. */
router.get('/:id/login', function(req, res, next) { 
	let roomId_url = req.params.id;
	console.log(roomId_url);//ここに入る数値がroom_idです。
	let query = 'SELECT room_id, room_name, room_memo, room_pass FROM room WHERE room_id =' + roomId_url;
	connection.query(query, (err, rows) => {
		if (err) throw err;
		console.log(rows[0]);
		res.render('room-login', { room_show: rows[0]});
	});
});

router.post('/:id/login', (req, res, next) => {//パスワードの検証
	let roomId = req.params.id;
	console.log(roomId);
	let query = 'SELECT room_id, room_pass FROM room WHERE room_id =' + roomId;
	connection.query(query, (err, rows) => {
		if (err) throw err;
		console.log(rows[0]);//この中には、roomのidとpassがある。
		let pass = req.body.pass;
		console.log(pass);
		console.log(rows[0].room_pass);
		if (pass == rows[0].room_pass) {
			let userId = req.session.user_id;
			req.session.room_id = userId;
			console.log(userId);
			res.redirect('/chat/' + req.params.id);
			console.log('うまく行ったぞ！');
		} else {
			res.redirect('/:id/login');
			console.log('間違ってるよ');
		}
	});
});


module.exports = router;