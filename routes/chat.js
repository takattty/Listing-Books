const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

router.get('/:id', function(req, res, next) {
    let room_id = req.params.id;//roomの識別
    console.log('roomId=' + room_id);
    let sessionId = req.session.room_id;//ちゃんとログインしたかの確認
    console.log('this is room_session_id =' + sessionId);
    let user_id = req.session.user_id;//人の識別
    console.log('user_session_id is = ' + user_id);
    connection.beginTransaction((err) => {
        if (err) throw err;
        let query1 = 'SELECT text, time, user_id FROM message WHERE room_id=' + room_id;
        connection.query(query1, (err, row1) => {
            console.log(row1);//room別のmessageデータが入っている値。
            for(let ar in row1) {
                console.log(row1[ar]);
                let query2 = ('SELECT name FROM account WHERE id=' + row1[ar].user_id);
                connection.query(query2, (err, row2) => {
                    console.log(row2);//それぞれのユーザーの名前を出力完了。
                });
            }
        });
    });
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