const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

/* GET home page. */
router.get('/success', function(req, res, next) { //router.getメソッドで'/'にアクセスした際の表示を行う。
  var query = 'SELECT * FROM sharechat_test.account';
  connection.query(query, (err, rows, fields) => {
    if (err) throw err;
    console.log(rows);
    res.render('account-success', { user_name: rows[0].name});
  });
});

module.exports = router;
