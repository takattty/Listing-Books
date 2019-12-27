const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');
const moment = require('moment');

// router.get('/:id', function(req, res) {
//     let room_id = req.params.id;//roomの識別
//     console.log('room_id=' + room_id);
//     let sessionId = req.session.room_id;//ちゃんとログインしたかの確認
//     console.log('this is room_session_id =' + sessionId);
//     let user_id = req.session.user_id;//人の識別
//     console.log('user_session_id is = ' + user_id);
//     let query1 = 'SELECT text, time, user_name FROM message WHERE room_id=' + room_id;
//     connection.query(query1, (err, rows1) => {
//         //console.log(rows1);//POSTで保存しに持っていった値の前のデータを表示する。
//         let query2 = 'SELECT room_name FROM room WHERE room_id=' + room_id;
//         connection.query(query2, (err, rows2) => {
//         //console.log(rows2);
//             let content = {
//                 roomid: room_id,
//                 roomname: rows2[0].room_name,
//                 date: rows1
//             }
//             res.render('chat',　content);
//             //ここで渡している値って言うのはsocketではなくDBの値なので、フロントに反映させる時に工夫が必要。
//         });
//     });
// });

// router.post('/:id', function(req, res, next) {
//     let room_id = req.params.id;//roomの識別
//     //console.log('roomId=' + room_id);
//     let user_id = req.session.user_id;//人の識別
//     //console.log('user_session_id is = ' + user_id);
//     connection.query('SELECT name FROM account WHERE id=' + user_id, (err, userName) => {
//         if (err) {
//             console.log('セレクトミス');
//         }
//         let text = req.body.text;
//         console.log('ここでchat.jsの受け取り=' + text);
//         let message_id = null;
//         let time = moment().format('hh:mm');;
//         let user_name = userName[0].name;
//         let text_date = {message_id, text, time, room_id, user_id, user_name}
//         console.log(text_date);
//         connection.query('INSERT INTO message SET ?', text_date,
//             (err, results) => {
//                 if (err) {
//                     console.log('DBに保存出来てない〜〜');
//                 }
//                 console.log('DB保存おっけい！');
//             }
//         );
//     });
//     res.redirect('/chat/' + room_id);
// });


//各ルームのコメント詳細ページ
router.get('/:room_id/text/:text_id/account/:user_id', function(req, res, next) {
    let text_id = req.params.text_id;
    let user_id = req.params.user_id;
    connection.beginTransaction((err) => {
        if (err) { throw err; }
        connection.query('SELECT * FROM message WHERE message_id=' + text_id, (err, row1) => {
            if (err) {
                console.log('最初でミスってる！');
            }
            console.log(row1);
            console.log(row1[0].text);
            console.log(row1[0].room_id);
            connection.query('SELECT name FROM account WHERE id=?', user_id, (err, row2) => {
                if (err) {
                    console.log('2つ目のクエリでミスってる！');
                }
                console.log(row2);
                console.log(row2[0].name);
                connection.commit((err) => {
                    if (err) {
                        console.log('最後のコミットでミスってる！');
                    }
                    console.log('success!!!!!');
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

//各ルームのコメントの編集ページ
router.get('/:room_id/text/:text_id/account/:user_id/edit', function(req, res, next) {
    let text_id = req.params.text_id;
    let user_id = req.params.user_id;
    connection.beginTransaction((err) => {
        if (err) { throw err; }
        connection.query('SELECT * FROM message WHERE message_id=' + text_id, (err, row1) => {
            if (err) {
                console.log('最初でミスってる！');
            }
            console.log(row1);
            console.log(row1[0].text);
            console.log(row1[0].room_id);
            connection.query('SELECT name FROM account WHERE id=?', user_id, (err, row2) => {
                if (err) {
                    console.log('2つ目のクエリでミスってる！');
                }
                console.log(row2);
                console.log(row2[0].name);
                connection.commit((err) => {
                    if (err) {
                        console.log('最後のコミットでミスってる！');
                    }
                    console.log('success!!!!!');
                    const chatTextEdit = {
                        delete_bottom: '削除',
                        edit_bottom: '更新',
                        user: row2[0],
                        text: row1[0]
                    }
                    res.render('chat-text-edit', chatTextEdit );
                })
            });
        });
    });
});

router.post('/:room_id/text/:text_id/account/:user_id/edit', (req, res, next) => {
    let room_id = req.params.room_id;
    let text_id = req.params.text_id;
    let text = req.body.text;
    let num = req.body.kind;
    console.log(text);
    console.log(num);

    if (num == 1) {
        console.log('削除ボタンの処理が出来てるよ！');
        let query = 'DELETE FROM message WHERE message_id =' + text_id;
        connection.query(query, (err, rows) => {
            if (err) throw err;
            res.redirect('/chat/' + room_id);
        });
    } 
    if (num == 2) {
        console.log('更新の処理が出来るよ！');
        connection.query('UPDATE message SET text=? WHERE message_id=?', [text, text_id], (err, rows) => {
            if (err) throw err;
            res.redirect('/chat/' + req.params.room_id + '/text/' + req.params.text_id + '/account/' + req.params.user_id);
        });
    }

});

module.exports = router;