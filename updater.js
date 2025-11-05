const { autoUpdater } = require('electron-updater')
const { dialog } = require('electron')

// 配置自动更新
function setupAutoUpdater(mainWindow) {
  // 设置更新服务器（GitHub Releases）
  autoUpdater.autoDownload = false // 不自动下载，让用户选择
  autoUpdater.autoInstallOnAppQuit = true

  // 检查更新时
  autoUpdater.on('checking-for-update', () => {
    console.log('正在检查更新...')
  })

  // 发现新版本
  autoUpdater.on('update-available', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '发现新版本',
      message: `发现新版本 ${info.version}，是否立即下载？`,
      buttons: ['下载', '稍后'],
      defaultId: 0
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
  })

  // 没有新版本
  autoUpdater.on('update-not-available', () => {
    console.log('已是最新版本')
  })

  // 下载进度
  autoUpdater.on('download-progress', (progress) => {
    console.log(`下载进度: ${progress.percent.toFixed(2)}%`)
    // 可以发送到渲染进程显示进度条
    mainWindow.webContents.send('download-progress', progress.percent)
  })

  // 下载完成
  autoUpdater.on('update-downloaded', (info) => {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '更新下载完成',
      message: '新版本已下载完成，应用将在退出后自动更新',
      buttons: ['立即重启', '稍后'],
      defaultId: 0
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  // 更新出错
  autoUpdater.on('error', (err) => {
    console.error('更新错误:', err)
  })

  // 应用启动后 5 秒检查更新
  setTimeout(() => {
    autoUpdater.checkForUpdates()
  }, 5000)
}

module.exports = { setupAutoUpdater }

