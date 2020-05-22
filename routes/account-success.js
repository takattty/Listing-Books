const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

router.get('/:id', function(req, res, next) {//多分ここのidは、下の処理のrowsのidを参照している。
  const userId = req.session.user_id;
  //console.log("userId =" + userId);
  const query = 'SELECT id, name FROM account WHERE id = ?';
  connection.query(query, userId, (err, rows) => {
    if (err) throw err; 
    //console.log(rows[0]);
    //console.log("/profile/" + rows[0].id)
    res.render('account-success', { 
      user_name: rows[0].name,
      user_num: rows[0].id});
  });
});
module.exports = router;
