const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');
const unescape = require('../public/javascripts/escape/unescape');

router.get('/:id', function(req, res, next) {
  const userId = req.session.user_id;
  const query = 'SELECT id, name FROM account WHERE id = ?';
  connection.query(query, [userId], (err, rows) => {
    if (err) throw err;
    const user_name = rows[0].name;
    const unescaped_name = unescape(user_name);
    res.render('account-success', { 
      user_name: unescaped_name,
      user_num: rows[0].id
    });
  });
});
module.exports = router;