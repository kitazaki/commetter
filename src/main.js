'use strict';

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let windows = [];
let tray = null;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {
  showWindows();

  electron.screen.on('display-added', function () {
    dismissWindows();
    showWindows();
  });

  electron.screen.on('display-removed', function () {
    dismissWindows();
    showWindows();
  });
});

function showWindows() {
  electron.screen.getAllDisplays().forEach(display => {
    windows.push(showWindow(display));
  });
//  windows.push(showWindow(electron.screen.getPrimaryDisplay()));
}

function dismissWindows() {
  if (!windows || windows.length < 1) {
    return;
  }

  windows.forEach(window => {
    if (!window) {
      return;
    }

    window.close();
  });

  windows = [];
}

function showWindow(display) {
  let size = display.size;
  let window = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width: size.width,
    height: size.height,
    frame: false,			// true or false
    transparent: true,			// true or false
    resizable: true,
    alwaysOnTop: true
  });

  window.loadURL('file://' + __dirname + '/index.html');
  window.setIgnoreMouseEvents(true);	// true or false
//  window.openDevTools();		// comment out

  window.on('closed', function () {
    window = null;
  });

  return window;
}
