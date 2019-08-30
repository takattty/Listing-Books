const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

router.get('/signup', function(req, res, next) {
    const signup_text = {
        title1: 'ここではアカウントの新規作成が出来ます。',
        title2: '名前、パスワード、自己紹介を書いてアカウントを作成しよう！',
        create: 'アカウント新規作成',
        name: '名前',
        text: '自己紹介',
        bottom: 'アカウントを作成する',
        user: { name: ""}
    };
    res.render('account', signup_text);
});

router.post('/signup', (req, res, next) => {
    function pass() {
        let pass1 = req.body.password1;
        let pass2 = req.body.password2;
            if (pass1 == pass2) {
                return pass1;
            } else {
                res.redirect('/account/signup');
            }
    }
    let id = null;
    let name = req.body.name;
    let password = pass(); 
    let si = req.body.comment;
    let date = {id, name, password, si};
    connection.query('INSERT INTO account SET ?', date,
        (error, results, fields) => {
            res.redirect('/account/login');
        });
    console.log(date);
});

router.get('/login', function(req, res, next) {
    const login_text = {
        title1: 'アカウント作成が完了したので、ログインしましょう！',
        title2: '名前、パスワード、自己紹介を書いてください！',
        create: 'ログイン',
        name: '名前',
        bottom: 'ログイン' 
    };
    res.render('login', login_text);
});

router.post('/login', (req, res, next) => {
    function pass() {
        let pass1 = req.body.password1;
        let pass2 = req.body.password2;
            if (pass1 == pass2) {
                return pass1;
            } else {
                res.redirect('/account/login');
            }
    }
    let name = req.body.name;
    let password = pass();
    let query = 'SELECT id FROM account WHERE name="' + name + '" AND password = "' + password + '" LIMIT 1';
    connection.query(query, (error, rows) => {
        if (error) {
            console.log("ここでエラーになってるよ！");
            res.end();
        } else {
            let userId = rows.length? rows[0].id: false;
            if (userId) {
                req.params.id = userId;//ここでidのキーにDBの値を記入出来ている。
                req.session.user_id = userId;//サーバーにある。
                console.log(userId);
                console.log(req.params);
                console.log("セッションID登録完了！！！");
                res.redirect('/success/' + req.session.user_id );
            } else {
                res.redirect('/account/login');
                console.log("falseだよ");
            }
        }
    });
});


router.get('/:id/edit', function(req, res, next) {
    let id = req.params.id;
    let userid = req.session.user_id;
    //サーバーで保持している情報。cookieは各ブラウザに持たせる。
    //メモリで管理は何とかして識別している。
    console.log(id);
    console.log(userid)
    if (id == userid) {
        let query = 'SELECT id, name, password, si FROM account WHERE id =' + id;
        connection.query(query, (err, rows) => {
            if (err) throw err;
            console.log(rows[0]);
            const edit_text = {
                title1: 'ここではアカウントの編集が出来ます。',
                title2: '編集を終えたら、保存ボタンを押しましょう！',
                create: 'アカウント編集',
                name: '名前',
                text: '自己紹介',
                bottom: '保存する',
                user: rows[0]
            }
            res.render('account', edit_text);
        });
    } else {
        res.redirect('/profile/' + userid);
    }
});

router.post('/:id/edit', (req, res, next) => {
    function pass() {
        let pass1 = req.body.password1;
        let pass2 = req.body.password2;
            if (pass1 == pass2) {
                return pass1;
            } else {
                res.redirect('/' + req.session.user_id + '/edit');
            }
    }
    let id = req.params.id;
    let name = req.body.name;
    let password = pass(); 
    let si = req.body.comment;
    connection.query('UPDATE account SET name=?, password=?, si=? WHERE id = ?', [name, password, si, id], (err, rows) => {
        if (err) throw err;
        console.log('アカウント編集成功！');
        res.redirect('/success/' + id);
    });
});

module.exports = router;