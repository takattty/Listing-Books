const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');
const hashed = require('../hash-password');
const { validationResult } = require('express-validator');
const validationCheckCreate = require('../public/javascripts/validation/account/validation');
const validationCheckRoom = require('../public/javascripts/validation/account/validation');

//ルーム作成ページ
router.get('/create', function(req, res, next) { 
  const roomCreate = {
      title1: 'ここではRoomの新規作成が出来ます。',
      title2: 'Room名, パスワード, Roomの説明を書きましょう！また、Roomを作成した方がそのRoomのオーナーとなります。',
      create: 'Room新規作成',
      name: 'Room名',
      text: 'Room紹介',
      bottom: 'Roomを作成する',
      user: ''
  };
  res.render('account', roomCreate);
});

//ルーム作成処理
router.post('/create', validationCheckCreate, (req, res, next) => {
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    console.info(validationError.errors);
    res.redirect('/room/create');
  } else {
    const room_id = null;
    const room_name = req.body.name;
    const room_memo = req.body.comment;
    const room_owner = req.session.user_id;
    const pass1 = req.body.password1;
    const pass2 = req.body.password2;
    if (pass1 == pass2) {
      const room_plaintextPassword = pass1; 
      hashed.generatedHash(room_plaintextPassword).then((room_hash) => {
        const room_hashedpassword = room_hash;
        const date = {
          room_id: room_id,
          room_name: room_name,
          room_pass: room_hashedpassword,
          room_memo: room_memo,
          room_owner: room_owner
        };
        connection.query('INSERT INTO room SET ?', [date],
          (error, results, fields) => {
            res.redirect('/room/index');
          });
      });
    } else {
      res.redirect('/room/create');
    }
  }
});

//ルーム更新画面
router.get('/:id/edit', function(req, res, next) { 
  const room_id = req.params.id;
  const userid = req.session.user_id;
  const query = 'SELECT room_id, room_name, room_memo, room_owner FROM room WHERE room_id = ?';
  connection.query(query, [room_id], (err, rows) => {
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

//ルーム情報更新処理
router.post('/:id/edit', validationCheckRoom, (req, res, next) => {
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    console.info(validationError.errors);
    res.redirect('/room' + room_id + '/edit'); 
  } else {
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
    const room_memo = req.body.comment;
    const num = req.body.kind;
    const room_plaintextPassword = pass(); 
    if (num == 1) {
      const query = 'DELETE FROM room WHERE room_id = ?';
      connection.query(query, [room_id], (err, rows) => {
        if (err) throw err;
        res.redirect('/room/index');
      });
    } 
    if (num == 2) {
      hashed.generatedHash(room_plaintextPassword).then((room_hash) => {
        const room_hashedpassword = room_hash;
        const queryDate = [room_name, room_hashedpassword, room_memo, room_id];
        connection.query('UPDATE room SET room_name = ?, room_pass = ?, room_memo = ? WHERE room_id = ?', [queryDate], (err, rows) => {
          if (err) throw err;
          res.redirect('/chat/' + room_id);
        });
      });
    }
  }
});

//ルームの詳細ページ
router.get('/:id/show', function(req, res, next) { 
    const room_id = req.params.id;
    const query = 'SELECT room_id, room_name, room_memo FROM room WHERE room_id = ?';
    connection.query(query, [room_id], (err, rows) => {
        if (err) throw err;
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