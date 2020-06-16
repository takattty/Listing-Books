const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');
const unescape = require('../public/javascripts/escape/unescape');

router.get('/:id', function(req, res, next) {
  const user_id = req.params.id;
  const query = 'SELECT id, name, si FROM account WHERE id = ?';
  connection.query(query, [user_id], (err, rows) => {
    if (err) throw err;
    const unescaped_name = unescape(rows[0].name);
    rows[0].name = unescaped_name;
    const unescaped_si = unescape(rows[0].si);
    rows[0].si = unescaped_si;
    res.render('profile', { 
      user_name: rows[0].name, 
      user_si: rows[0].si,
      user_id: rows[0].id,
      success: user_id 
    });
  });
});

module.exports = router;