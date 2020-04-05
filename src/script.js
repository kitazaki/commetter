document.body.appendChild(document.createElement("script")).src =
  "./node_modules/jquery/dist/jquery.min.js";
document.body.appendChild(document.createElement("script")).src =
  "./node_modules/mqtt/dist/mqtt.min.js";

var id = "try";
var password = "try";
var topic = "/+";

setTimeout(function() {
  var cssfile = $("<link>", {
    "href": "./style.css",
    "type": "text/css",
    "rel": "stylesheet"
  });
  $("body").append(cssfile);

  var wrapperDom = $("<div></div>", {
    "id": "comets"
  });
  var setupedTextDom = $("<p></p>", {
    addClass: 'status'
  }).text("commetter");

  if ($(".punch-full-screen-element").length) {
    $(".punch-full-screen-element").append(wrapperDom);
  } else {
    $("body").append(wrapperDom);
  }
  wrapperDom.append(setupedTextDom);

  wrapperReset = function() {
    setTimeout(function() {
      console.log("reset");
      wrapperDom.remove();
      if ($(".punch-full-screen-element").length) {
        $(".punch-full-screen-element").append(wrapperDom);
      } else {
        $("body").append(wrapperDom);
      }
      $("#comets").css("font-size", $(window).height() / 12 + "px");
    }, 1500);
  }

  $("#punch-start-presentation-left").on("click", function() {
    wrapperReset();
  });

  $(window).on("resize", function(e) {
    wrapperReset();
  });

  $(window).keydown(function(e) {
    if ((event.shiftKey) && (event.metaKey)) {
      if (e.keyCode === 13) {
        wrapperReset();
        return false;
      }
    }
  });

  var time = new Date().getTime().toString(16);
  var client = mqtt.connect('wss://'+id+':'+password+'@broker.shiftr.io', {
    clientId: 'MQTTWidget_'+time
  });

  client.on('connect', function(){
    console.log('client has connected');
    client.subscribe(topic);
  });

  var num = 0;

  client.on("message", function(topic, message) {
    console.log(message.toString());
    var commentDom = $("<p></p>", {
      addClass: "comment",
      "id": num
    }).text(message.toString()).css({
      top: (Math.random() * 90) + "%"
    });
    $("#comets").append(commentDom);
    setTimeout(function(id) {
      $("#comets #" + id).remove();
    }, 10000, num);
      num++;
  });
}, 1000);

