$(function() {
  const socket = io();//画面を開いた時点でここまで実行。submitを押したら下にいく。
  $('#message_form').submit(function() {
    const message = $('#input_msg').val();//エスケープ処理なしで送信
    const selectRoom = $('[data-name="roomid"]').val();
    const userid = $('[data-name="userid"]').val();;
    const frontInfo = {
      message: message,
      roomId: selectRoom,
      userId: userid
    }
    console.log(frontInfo);
    socket.emit('message', frontInfo);//送信
    $('#input_msg').val('');
    return false;
  });
  socket.on('message', function(messageFront) {//受け取り。SocketIDも受け取る
    console.log(messageFront.socketId);
    console.log('フロントでの処理=' + messageFront.text );//ここはちゃんとエスケープ処理されてる。でも表示しているのはされていない値。
    $('#index').append('<div class="chatIndex"><div class="human"><div class="human-img"><p><img src="/images/human.png" width="20" height="20"></p></div><div class="human-name"><p>' + messageFront.user_name + '</p></div></div><div class="text"><p>' + messageFront.text + '</p></div><div class="time"><p>' + messageFront.time + '</p></div></div>');
  });
});