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

