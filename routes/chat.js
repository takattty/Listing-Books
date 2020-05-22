const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

//各ルームのメッセージ詳細ページ
router.get('/:room_id/text/:text_id/account/:user_id/show', function(req, res, next) {
  const text_id = req.params.text_id;
  const user_id = req.params.user_id;
  connection.beginTransaction((err) => {
    if (err) { throw err };
    connection.query('SELECT * FROM message WHERE message_id = ?', text_id, (err, row1) => {
      if (err) {
        console.log('最初でミスってる！');
      }
      connection.query('SELECT name FROM account WHERE id = ?', user_id, (err, row2) => {
        if (err) {
          console.log('2つ目のクエリでミスってる！');
        }
        connection.commit((err) => {
          if (err) {
            console.log('最後のコミットでミスってる！');
          }
          const chatTextShow = {
            edit_bottom: '編集',
            user: row2[0],
            text: row1[0]
          };
          res.render('chat-text', chatTextShow);
        });
      });
    });
  });
});

//各ルームのメッセージ編集ページ
router.get('/:room_id/text/:text_id/account/:user_id/edit', function(req, res, next) {
  const text_id = req.params.text_id;
  const user_id = req.session.user_id;
  connection.beginTransaction((err) => {
    if (err) { throw err };
    connection.query('SELECT * FROM message WHERE message_id = ?', text_id, (err, row1) => {
      if (err) {
          console.log('最初でミスってる！');
      }
      connection.query('SELECT name FROM account WHERE id = ?', user_id, (err, row2) => {
        if (err) {
            console.log('2つ目のクエリでミスってる！');
        }
        connection.commit((err) => {
          if (err) {
            console.log('最後のコミットでミスってる！');
          }
          const chatTextEdit = {
            delete_bottom: '削除',
            edit_bottom: '更新',
            user: row2[0],
            text: row1[0]
          }
          res.render('chat-text-edit', chatTextEdit );
        });
      });
    });
  });
});

router.post('/:room_id/text/:text_id/account/:user_id/edit', (req, res, next) => {
  const room_id = req.params.room_id;
  const text_id = req.params.text_id;
  const text = req.body.text;
  const num = req.body.edit;
  if (num == 1) {
    const query = 'DELETE FROM message WHERE message_id = ?';
    connection.query(query, text_id, (err, rows) => {
      if (err) throw err;
      res.redirect('/chat/' + room_id);
    });
  } 
  if (num == 2) {
    connection.query('UPDATE message SET text = ? WHERE message_id = ?', [text, text_id], (err, rows) => {
      if (err) throw err;
      res.redirect('/chat/room/' + req.params.room_id + '/text/' + req.params.text_id + '/account/' + req.params.user_id);
    });
  }
});

module.exports = router;