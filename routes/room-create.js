const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

router.get('/create', function(req, res, next) { 
	const roomCreate = {
			itle1: 'ここではRoomの新規作成が出来ます。',
			itle2: 'Room名, パスワード, Roomの説明を書きましょう！また、Roomを作成した方がそのRoomのオーナーとなります。',
			reate: 'Room新規作成',
			ame: 'Room名',
			ext: 'Room紹介',
			ottom: 'Roomを作成する',
			ser: { name: ""}
	};
	res.render('account', roomCreate);
});

router.post('/create', (req, res, next) => {
	function pass() {
		const pass1 = req.body.password1;
		const pass2 = req.body.password2;
			if (pass1 == pass2) {
				return pass1;
			} else {
				res.redirect('/room/create');
			}
	}
	const room_id = null;
	const room_name = req.body.name;
	const room_pass = pass(); 
	const room_memo = req.body.comment;
	const room_owner = req.session.user_id;
	const date = {room_id, room_name, room_pass, room_memo, room_owner};
	connection.query('INSERT INTO room SET ?', date,
		(error, results, fields) => {
			res.redirect('/room/index');
		});
	//console.log(date);
});

router.get('/:id/edit', function(req, res, next) { 
	const room_id = req.params.id;
	const userid = req.session.user_id;
	const query = 'SELECT room_id, room_name, room_pass, room_memo, room_owner FROM room WHERE room_id =' + room_id;
	connection.query(query, (err, rows) => {
		const roomEdit = {
			title1: 'ここではRoomの更新が出来ます。',
			title2: 'Room名, パスワード, Roomの説明を編集しましょう！',
			create: 'Room編集',
			name: 'Room名',
			text: 'Room紹介',
			delete_bottom: '削除',
			bottom: 'Roomを更新する',
			room: rows[0]
		};
		if (userid == rows[0].room_owner) {
			res.render('room-edit', roomEdit);
		} else {
			res.redirect('/room/' + room_id + '/show');
		}
	});
});

router.post('/:id/edit', (req, res, next) => {
	function pass() {
		const pass1 = req.body.password1;
		const pass2 = req.body.password2;
		if (pass1 == pass2) {
			return pass1;
		} else {
			res.redirect('/room/' + room_id);
		}
	}
	const room_id = req.params.id;
	const room_name = req.body.name;
	const room_pass = pass(); 
	const room_memo = req.body.comment;
	const num = req.body.kind;
	if (num == 1) {
		//console.log('削除ボタンの処理が出来てるよ！');
		const query = 'DEconstE FROM room WHERE room_id =' + room_id;
		connection.query(query, (err, rows) => {
			if (err) throw err;
			res.redirect('/room/index');
		});
	} 
	if (num == 2) {
		console.log('更新の処理が出来るよ！');
		connection.query('UPDATE room SET room_name=?, room_pass=?, room_memo=? WHERE room_id=?', [room_name, room_pass, room_memo, room_id], (err, rows) => {
			if (err) throw err;
			//console.log(room_id);
			res.redirect('/chat/' + room_id);
			//res.redirect('/room/' + room_id + '/show');
		});
	}
})

router.get('/:id/show', function(req, res, next) { 
		const room_id = req.params.id;
		//console.log(room_id);
		const query = 'SELECT room_id, room_name, room_pass, room_memo FROM room WHERE room_id =' + room_id;
		connection.query(query, (err, rows) => {
				if (err) throw err;
				//console.log(rows[0]);
				const roomShow = {
						title1: 'ここではRoomの編集や削除の選択が出来ます。',
						title2: '編集か削除を選んでください',
						create: 'Roomについて',
						name: 'Room名',
						text: 'Room紹介',
						edit_bottom: '編集',
						room: rows[0]
				};
		res.render('room-show', roomShow);
		});
});

module.exports = router;