const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

router.get('/:id', function(req, res, next) {
    let roomId = req.params.id;
    console.log('roomId=' + roomId);
    let sessionId = req.session.room_id;
    console.log(sessionId);

    res.render('chat');
});

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
                });
            });
        });
    });
});

module.exports = router;