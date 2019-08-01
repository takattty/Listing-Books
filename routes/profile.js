const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

/* GET home page. */
router.get('/:id', function(req, res, next) {
	let user_id = req.params.id;
	let query = 'SELECT id, name, si FROM account WHERE id =' + user_id;
	connection.query(query, (err, rows) => {
		if (err) throw err;
		console.log(rows[0]);
		res.render('profile', { 
			user_name: rows[0].name, 
			user_si: rows[0].si,
			user_id: rows[0].id });
		});
});

module.exports = router;
