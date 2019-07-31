const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

/* GET home page. */
router.get('/index', function(req, res, next) {
  let query = 'SELECT room_id, room_name FROM room';
  connection.query(query, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    res.render('room-index', { room_info: rows });
  });
});

module.exports = router;