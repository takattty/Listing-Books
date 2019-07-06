const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    const chatTextShow = {
        delete_bottom: '削除',
        edit_bottom: '編集'
    };
    res.render('chat-text', chatTextShow);
});

router.get('/edit', function(req, res, next) {
    const chatTextEdit = {
        delete_bottom: '削除',
        edit_bottom: '更新'
    }
    res.render('chat-text', chatTextEdit );
});

module.exports = router;