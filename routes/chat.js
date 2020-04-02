const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

//各ルームのメッセージ詳細ページ
router.get('/:room_id/text/:text_id/account/:user_id/show', function(req, res, next) {
  const text_id = req.params.text_id;
  const user_id = req.params.user_id;
  connection.beginTransaction((err) => {
    if (err) { throw err };
    connection.query('SELECT * FROM message WHERE message_id=' + text_id, (err, row1) => {
      if (err) {
        console.log('最初でミスってる！');
      }
      //console.log(row1);
      //console.log(row1[0].text);
      //console.log(row1[0].room_id);
      connection.query('SELECT name FROM account WHERE id=?', user_id, (err, row2) => {
        if (err) {
          console.log('2つ目のクエリでミスってる！');
        }
        //console.log(row2);
        //console.log(row2[0].name);
        connection.commit((err) => {
          if (err) {
            console.log('最後のコミットでミスってる！');
          }
          //console.log('success!!!!!');
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
    connection.query('SELECT * FROM message WHERE message_id=' + text_id, (err, row1) => {
      if (err) {
          console.log('最初でミスってる！');
      }
      //console.log(row1);
      //console.log(row1[0].text);
      //console.log(row1[0].room_id);
      connection.query('SELECT name FROM account WHERE id=?', user_id, (err, row2) => {
        if (err) {
            console.log('2つ目のクエリでミスってる！');
        }
        //console.log(row2);
        //console.log(row2[0].name);
        connection.commit((err) => {
          if (err) {
            console.log('最後のコミットでミスってる！');
          }
          //console.log('success!!!!!');
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
  //console.log(text);
  //console.log(num);
  if (num == 1) {
    //console.log('削除ボタンの処理が出来てるよ！');
    const query = 'DELETE FROM message WHERE message_id =' + text_id;
    connection.query(query, (err, rows) => {
      if (err) throw err;
      res.redirect('/chat/' + room_id);
    });
  } 
  if (num == 2) {
    //console.log('更新の処理が出来るよ！');
    connection.query('UPDATE message SET text=? WHERE message_id=?', [text, text_id], (err, rows) => {
      if (err) throw err;
      res.redirect('/chat/room/' + req.params.room_id + '/text/' + req.params.text_id + '/account/' + req.params.user_id);
    });
  }
});

module.exports = router;