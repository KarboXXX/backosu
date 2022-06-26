const { app, BrowserWindow } = require('electron')
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const path = require('path');

function createWindow() {
  var win = new BrowserWindow({
    width: 1000, 
    height: 500, 
    resizable: false,
    icon: path.join(__dirname, '/build/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'app/js/preload.js'),
      preload: path.join(__dirname, 'app/js/backup.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  
  win.setMenuBarVisibility(false)
  win.loadFile(path.join(__dirname, './app/index.html'));
  
  win.setIcon(path.join(__dirname, './build/icon.png'));
  // win.webContents.openDevTools()
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    event.sender.send('selected-dir', files);
  })
})

app.on('activate', () => { if (win === null) { createWindow() } })