const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');
const bcryot = require('bcrypt');
const { validationResult } = require('express-validator');
const validationCheck = require('../public/javascripts/validation/room-login/validation');
const unescape = require('../public/javascripts/escape/unescape');

//ルームログインページの表示
router.get('/:id/login', function(req, res, next) { 
  const roomId_url = req.params.id;
  const query = 'SELECT id, name, memo FROM room WHERE id = ?';
  connection.query(query, [roomId_url], (err, rows) => {
    if (err) throw err;
    const unescaped_room_name = unescape(rows[0].room_name);
    const unescaped_room_memo = unescape(rows[0].room_memo);
    rows[0].room_name = unescaped_room_name;
    rows[0].room_memo = unescaped_room_memo;
    res.render('room-login', { room_show: rows[0]});
  });
});

//ルームログイン処理
router.post('/:id/login', validationCheck, (req, res, next) => {
  const roomId = req.params.id;
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    console.info(validationError.errors);
    res.redirect('/room/' + roomId + '/login');
  } else {
    const query = 'SELECT id, password FROM room WHERE id = ?';
    connection.query(query, [roomId], (err, rows) => {
      if (err) throw err;
      const plaintextPassword = req.body.pass;
      const room_pass = rows[0].password;
      bcryot.compare(plaintextPassword, room_pass, (err, result) => {
        if(result === true) {
          req.session.room_id = roomId;//ここでroom_idの保存
          res.redirect('/chat/' + req.params.id);
        } else {
          res.redirect('/room/' + req.params.id + '/login');
        }
      });
    });
  }
});

module.exports = router;