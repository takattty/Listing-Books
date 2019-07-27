const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

router.get('/:id', function(req, res, next) {
	let userId = req.session.user_id;
	console.log("userId =" + userId);
	let query = 'SELECT id, name FROM account WHERE id = ' + userId;
	connection.query(query, (err, rows) => {
		if (err) throw err; 
		console.log(rows[0]);
		res.render('account-success', { user_name: rows[0].name});
	});
});
module.exports = router;
