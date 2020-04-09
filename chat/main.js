var id = "try";
var password = "try";
var topic = "/example";
var time = new Date().getTime().toString(16);

var client = mqtt.connect('wss://'+id+':'+password+'@broker.shiftr.io', {
  clientId: 'javascript_'+time
});

client.on('connect', function(){
    console.log('client has connected!');
    client.subscribe(topic);
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
    client.publish(topic, text);
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

