const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  var win = new BrowserWindow({
    width: 1000, 
    height: 500, 
    resizable: false,
    icon: './build/icon.png',
    webPreferences: {
      preload: './app/js/preload.js',
      preload: './app/js/backup.js',
      nodeIntegration: true,
      contextIsolation: false
    }
    
  })

  win.setIcon('./build/icon.png');
  win.loadFile('./app/index.html')
  win.setMenuBarVisibility(false)

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

app.on('activate', () => { if (win === null) { createWindow() } })