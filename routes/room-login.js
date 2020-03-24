const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

router.get('/:id/login', function(req, res, next) { 
	const roomId_url = req.params.id;
	//console.log(roomId_url);//ここに入る数値がroom_idです。
	const query = 'SELECT room_id, room_name, room_memo, room_pass FROM room WHERE room_id =' + roomId_url;
	connection.query(query, (err, rows) => {
		if (err) throw err;
		//console.log(rows[0]);
		res.render('room-login', { room_show: rows[0]});
	});
});

router.post('/:id/login', (req, res, next) => {//パスワードの検証
	const roomId = req.params.id;
	//console.log(roomId);
	const query = 'SELECT room_id, room_pass FROM room WHERE room_id =' + roomId;
	connection.query(query, (err, rows) => {
		if (err) throw err;
		//console.log(rows[0]);//この中には、roomのidとpassがある。
		const pass = req.body.pass;
		//console.log(pass);
		//console.log(rows[0].room_pass);
		if (pass == rows[0].room_pass) {
      req.session.room_id = roomId;//ここでroom_idの保存
			//console.log(req.session.room_id);
			res.redirect('/chat/' + req.params.id);
		} else {
			res.redirect('/room/' + req.params.id + '/login');
			console.log('間違ってるよ');
		}
	});
});

module.exports = router;