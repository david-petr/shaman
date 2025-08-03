const { contextBridge, ipcRenderer } = require("electron")

// ==== open new window ====
contextBridge.exposeInMainWorld("newWindow", {
  openNewWindow: (dataToSend) => ipcRenderer.send("open-new-window-request", dataToSend)
})

// ==== dark mode ====
contextBridge.exposeInMainWorld("darkMode", {
  system: () => ipcRenderer.invoke("dark-mode:system")
})

// ==== accent color ====
contextBridge.exposeInMainWorld("accentColor", {
  get: () => ipcRenderer.invoke("get-accent-color")
})
contextBridge.exposeInMainWorld("accentColorUpdates", {
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

// ==== user preferences ====
contextBridge.exposeInMainWorld("preferencesAPI", {
  get: (key) => ipcRenderer.invoke("get-preference", key),
  set: (key, value) => ipcRenderer.invoke("set-preference", key, value),
  onUpdate: (callback) => ipcRenderer.on("preference-updated", (event, key, value) => callback(key, value))
})