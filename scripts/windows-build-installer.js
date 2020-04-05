var winstaller = require('electron-winstaller');

winstaller.createWindowsInstaller({
  appDirectory: './MQTTWidget-win32-x64/',
  outputDirectory: './builds/windows/installer64/',
  authors: '',
  description: '',
  exe: 'MQTTWidget.exe'
})
  .then(() => console.log('It worked!'))
  .catch(e => console.log(`No dice: ${e.message}`));

