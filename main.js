const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { setupAutoUpdater } = require('./updater')

// 开发环境热重载
try {
  require('electron-reloader')(module, {
    debug: true,
    watchRenderer: true // 监听渲染进程文件变化
  })
} catch (_) { console.log('Error loading electron-reloader') }

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  win.webContents.openDevTools() // 自动打开开发者工具
  
  return win
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  const win = createWindow()
  
  // 生产环境启用自动更新（开发环境会跳过）
  if (!require('electron').app.isPackaged) {
    console.log('开发模式，跳过自动更新')
  } else {
    setupAutoUpdater(win)
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})