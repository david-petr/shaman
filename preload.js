const { contextBridge, ipcRenderer } = require("electron")

// ==== open new window ====
contextBridge.exposeInMainWorld("newWindow", {
  openNewWindow: (dataToSend) => ipcRenderer.send("open-new-window-request", dataToSend)
})

// ==== dark mode ====
contextBridge.exposeInMainWorld("darkMode", {
  toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
  system: () => ipcRenderer.invoke("dark-mode:system"),
  user: () => ipcRenderer.invoke("dark-mode:user"),
  getSystem: () => ipcRenderer.invoke("dark-mode:getSystem"),
  setThemeManual: (theme) => ipcRenderer.invoke("setThemeManual", theme)
})

// ==== accent color ====
contextBridge.exposeInMainWorld("accentColor", {
  get: () => ipcRenderer.invoke("get-accent-color"),
  system: () => ipcRenderer.invoke("get-system-accent-color"),
  update: (color) => ipcRenderer.invoke("set-accent-color", color),
  onUpdated: (callback) => ipcRenderer.on("accent-color-updated", (event, color) => {
    callback(color)
  })
})

// ==== app update ====
contextBridge.exposeInMainWorld("sendMessage", {
  get: (callback) => ipcRenderer.on("message-send", (event, message) => {
    callback(message)
  })
})
contextBridge.exposeInMainWorld("updateProgress", {
  get: (callback) => ipcRenderer.on("update-progress-send", (event, progress) => {
    callback(progress)
  })
})

// ==== resize window ====
contextBridge.exposeInMainWorld("windowApi", {
  resizeWindow: (width, height) => {
    ipcRenderer.send("resize-main-window", width, height)
  }
})

// ==== app version ====
contextBridge.exposeInMainWorld("appAPI", {
  onAppVersion: (callback) => ipcRenderer.on("app-version", (event, version) => callback(version))
})

// ==== files ====
contextBridge.exposeInMainWorld("fileAPI", {
  getFilesInFolder: (folderPath) => ipcRenderer.invoke("get-files-in-folder", folderPath),
})