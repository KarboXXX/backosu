const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  var win = new BrowserWindow({
    width: 800, 
    height: 400, 
    resizable: false,
    icon: path.join(__dirname, '/build/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'app/js/preload.js'),
      preload: path.join(__dirname, 'app/js/backup.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
    
  })

  win.setIcon(path.join(__dirname, './build/icon.png'))
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

// app.on('activate', () => { if (win === null) { createWindow() } })