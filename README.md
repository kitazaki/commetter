# commetter
====

## 概要 (Overview)
commetterはniconicocoaをリファクタリングしてMQTT対応したElectron実装アプリです。

niconicocoaはブラウザ上のGoogleスライド等で、発表中に視聴者からのコメントをスライドの上にニコニコ風に表示させることが出来るサービスでした。

<img src="niconicocoa.png" width="50%">

niconicocoaはバックエンドにMilkcocoaを使用しており、2019年10月30日にMilkcocoaが終了したため、利用できなくなりました。

<img src="Milkcocoa_loss.png" width="50%">

niconicocoaは現在、バックエンドにFirebaseを使用した<a href="https://comets.nabettu.com/">comets</a>というサービス名に変わっています。
ブラウザのExtensionやPluginではなくブックマークレットを利用する方式は同様です。

<img src="comets.png" width="50%">

commetterはMilkcocoaから汎用MQTTに対応(shiftr.ioで動作確認)し、ブックマークレット方式を止めてElectron実装アプリ(ブラウザ内に閉じず、ウィンドウ全体にコメントを表示)に変更しました。

<img src="commetter.png" width="50%">

※ 2020年5月5日追記  
2020年4月18日に開催された<a href="https://protoout.connpass.com/event/172136/">ProtoOutハッカソン</a>で<a href="https://protopedia.net/prototype/a07c2f3b3b907aaf8436a26c6d77f0a2">ねこしぇるじゅ</a>というサービスを作りました。  
文字のほかに画像・動画を流す機能(ネコ動)と音声を再生する機能(ネコ声)を追加しました。  
また、文字列の読み上げ機能(Web Speech API)に対応しました。

<a href="https://youtu.be/k8FHGCGBDbU"><img src="nekodou.png" width="50%"></a>

commetter is MQTT and Electron implementation of niconicocoa, because Milkcocoa service was shutdown on 30 Oct, 2019.

## インストール (Install)
Node.js、npmはインストールされている前提です。

```bash
$ git clone https://github.com/kitazaki/commetter
$ cd commetter
$ npm i
```

動作確認した環境は以下です。

```bash
$ node -v
v9.11.2
$ npm -v
5.6.0
```

## 使い方 (Usage)
### 起動
```bash
$ npm start
```
### ビルド

```bash
# for macOS
$ npm run build-macOS
# for Windows
$ npm run build-windows
# for Linux
$ npm run build-linux
```
macOSの場合、  
MQTTWidget-darwin-x64/MQTTWidget.app  
が実行モジュールです。

## カスタマイズ (Customize)
ディレクトリ構成は以下のとおりです。(一部、表示を省略しています)

```bash
$ tree commetter
commetter
├── README.md					# このREADME.mdファイル
├── chat					# ウェブページからMQTTへ書き込む(publish)するサンプル
│   ├── index.html
│   └── main.js					# MQTT接続情報を変更する
├── MQTTWidget-darwin-x64
│   └── MQTTWidget.app				# 実行モジュール
├── package-lock.json
├── package.json
└── src
    ├── index.html
    ├── main.js					# Electronの表示動作を変更する
    ├── package-lock.json
    ├── package.json
    ├── script.js				# MQTT接続情報を変更する
    └── style.css				# スタイルシート(フォントサイズやフォントカラーなどを変更する)
```
MQTT接続情報を変更する場合、以下のファイルを編集します。  
chat/main.js  
src/script.js  

```javascript
var id = "try";					# MQTT接続ID
var password = "try";				# MQTT接続パスワード
var topic = "/example";				# MQTT接続トピック

# MQTTサーバ(shiftr.io以外を使用する場合、broker.shiftr.io部分を変更する)
var client = mqtt.connect('wss://'+id+':'+password+'@broker.shiftr.io', {
```
Electronの表示動作を変更する場合、以下のファイルを編集します。  
src/main.js

拡張画面など全ての画面に表示するようになっています。

```javascript
function showWindows() {
  electron.screen.getAllDisplays().forEach(display => {
    windows.push(showWindow(display));
  });
}
```

メインの画面だけに表示する場合、以下のように変更します。

```javascript
function showWindows() {
  windows.push(showWindow(electron.screen.getPrimaryDisplay()));
}
```

他の表示動作の変更方法は以下のとおりです。

```javascript
frame: false,					# フレームを表示する場合、trueに変更します
transparent: true,				# 透過表示しない場合、falseに変更します
resizable: true,				# フレームサイズを変更しない場合、falseに変更します
alwaysOnTop: true				# 画面を常にトップに表示しない場合、falseに変更します
window.setIgnoreMouseEvents(true);		# マウス操作を有効にする場合、falseに変更します
//  window.openDevTools();			# デバッグ目的でブラウザの開発ツールを表示する場合、コメントイン(//を削除)します
```

画像・動画を流す機能(ネコ動)と音声を再生する場合、以下のファイルを編集します。  
src/script.js  

画像を流す場合、文字列の先頭にタグ(img:)を入れることで、タグに続く文字列をimg要素のsrc属性に指定するURIとして取り扱います。  
動画を流す場合、文字列の先頭にタグ(mp4:)を入れることで、タグに続く文字列をiframe要素のsrc属性に指定するURIとして取り扱います。  
音声を再生する場合、文字列の先頭にタグ(mp4:)を入れることで、タグに続く文字列をiframe要素のsrc属性に指定するURIとして取り扱います。  
文字列を読み上げる場合、文字列の先頭にタグ(say:)を入れることで、タグに続く文字列をWeb Speech API (Speech Synthesis API)のspeak()関数に渡します。

```javascript
client.on("message", function(topic, message) {
    console.log(message.toString());
    if (message.toString().match(/^img:/)) {
      var i = message.toString();
      i = i.replace(/img:/g, "");
      var commentDom = $("<p></p>", {
        addClass: "comment",
        "id": num
      }).html("<img src="+i+"></img>").css({
        top: (Math.random() * 90) + "%"
      });
    } else if (message.toString().match(/^mp4:/)) {
      var i = message.toString();
      i = i.replace(/mp4:/g, "");
      var commentDom = $("<p></p>", {
        addClass: "comment",
        "id": num
      }).html("<iframe src="+i+" frameborder=0 allow=autoplay allowfullscreen id=iframeVideo></iframe>").css({
        top: (Math.random() * 90) + "%"
      });
    } else if (message.toString().match(/^mp3:/)) {
      var i = message.toString();
      i = i.replace(/mp3:/g, "");
      var commentDom = $("<p></p>", {
        addClass: "comment",
        "id": num
      }).html("<iframe src="+i+" allow=autoplay style=display:none id=iframeAudio></iframe>").css({
        top: (Math.random() * 90) + "%"
      });
    } else if (message.toString().match(/^say:/)) {
      // Speak
      var i = message.toString();
      i = i.replace(/say:/g, "");
      speechSynthesis.speak(
        new SpeechSynthesisUtterance(i)
      );
    } else {
      var commentDom = $("<p></p>", {
        addClass: "comment",
        "id": num
      }).text(message.toString()).css({
        top: (Math.random() * 90) + "%"
      });
    }
    $("#comets").append(commentDom);
    setTimeout(function(id) {
      $("#comets #" + id).remove();
    }, 10000, num);
    num++;
  });
}, 1000);
```
