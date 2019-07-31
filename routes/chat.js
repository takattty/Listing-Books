const express = require('express');
const router = express.Router();

router.get('/:id', function(req, res, next) {
    let roomId = req.params.id;
    console.log('roomId=' + roomId);
    let sessionId = req.session.room_id;
    console.log(sessionId);

    res.render('chat');
});

module.exports = router;