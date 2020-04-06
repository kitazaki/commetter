var client = mqtt.connect('wss://try:try@broker.shiftr.io', {
  clientId: 'javascript'
});

client.on('connect', function(){
    console.log('client has connected!');
    client.subscribe('/example');
});

var nameArea, textArea, board;

window.onload = function(){
  nameArea = document.getElementById("name");
  textArea = document.getElementById("msg");
  board = document.getElementById("board");
}
 
function clickEvent(){
  var name = nameArea.value;
  var text = textArea.value;
  if (name) {
    var textmsg = name+'> '+text;
  } else {
    var textmsg = text;
  }
  sendText(textmsg);
}
 
function sendText(text){
  setTimeout(function(){
    client.publish('/example', text);
    console.log("送信完了!");
    textArea.value = "";
  }, 1000);
}

client.on('message', function(topic, message) {
  console.log('new message:', topic, message.toString());
  addText(message.toString());
}); 
 
function addText(text){
  var msgDom = document.createElement("li");
  msgDom.innerHTML = text;
  board.insertBefore(msgDom, board.firstChild);
}

