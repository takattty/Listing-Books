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

module.exports = router;