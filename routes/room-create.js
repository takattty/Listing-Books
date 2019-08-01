const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

/* GET home page. */
router.get('/create', function(req, res, next) { 
    const roomCreate = {
        title1: 'ここではRoomの新規作成が出来ます。',
        title2: 'Room名, パスワード, Roomの説明を書きましょう！また、Roomを作成した方がそのRoomのオーナーとなります。',
        create: 'Room新規作成',
        name: 'Room名',
        text: 'Room紹介',
        bottom: 'Roomを作成する'
    };
  res.render('account', roomCreate);
});

router.post('/create', (req, res, next) => {
    function pass() {
        let pass1 = req.body.password1;
        let pass2 = req.body.password2;
            if (pass1 == pass2) {
                return pass1;
            } else {
                res.redirect('/room/create');
            }
    }
    let room_id = null;
    let room_name = req.body.name;
    let room_pass = pass(); 
	let room_memo = req.body.comment;
	let room_owner = req.session.user_id;
	let date = {room_id, room_name, room_pass, room_memo, room_owner};
	connection.query('INSERT INTO room SET ?', date,
		(error, results, fields) => {
			res.redirect('/room/index');
		});
	console.log(date);
});

router.get('/:id/edit', function(req, res, next) { 
    let room_id = req.params.id;
    let query = 'SELECT room_id, room_name, room_pass, room_memo FROM room WHERE room_id =' + room_id;
    connection.query(query, (err, rows) => {
        if (err) throw err;
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
    res.render('room-edit', roomEdit);
    });
});

router.get('/:id/show', function(req, res, next) { 
    let room_id = req.params.id;
    console.log(room_id);
    let query = 'SELECT room_id, room_name, room_pass, room_memo FROM room WHERE room_id =' + room_id;
    connection.query(query, (err, rows) => {
        if (err) throw err;
        console.log(rows[0]);
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