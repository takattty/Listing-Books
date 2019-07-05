const express = require('express');
const router = express.Router();

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

router.get('/edit', function(req, res, next) { 
  const roomEdit = {
      title1: 'ここではRoomの編集が出来ます。',
      title2: 'Room名, パスワード, Roomの説明を編集しましょう！',
      create: 'Room編集',
      name: 'Room名',
      text: 'Room紹介',
      bottom: 'Roomを更新する'
  };
res.render('account', roomEdit);
});

router.get('/show', function(req, res, next) { 
  const roomShow = {
      title1: 'ここではRoomの編集や削除の選択が出来ます。',
      title2: '編集か削除を選んでください',
      create: 'Roomについて',
      name: 'Room名',
      text: 'Room紹介',
      delete_bottom: '削除',
      edit_bottom: '編集'
  };
res.render('room-show', roomShow);
});

module.exports = router;
