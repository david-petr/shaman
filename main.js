const { app, BrowserWindow, ipcMain, nativeTheme, Menu, systemPreferences } = require("electron")
const { autoUpdater } = require("electron-updater")
const path = require("path")
const url = require("url")
const Store = require("electron-store").default

let win

const store = new Store()

// ==== functions ====
function getSystemAccentColor() {
    if (process.platform === "win32") {
        return `#${systemPreferences.getAccentColor()}`
    } else if (process.platform === "darwin") {
        return systemPreferences.getUserDefault("AppleAccentColor", "string")
    } else {
        return null
    }
}
function getAccentColor() {
    if(store.get("accentColor")){
        if(store.get("accentColor") === "system"){
            return getSystemAccentColor()
        } else {
            return store.get("accentColor")
        }
    } else {
        return getSystemAccentColor()
    } 
}
function toggle() {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = "light"
    } else {
        nativeTheme.themeSource = "dark"
    }

    store.set("theme", nativeTheme.themeSource)
}

function createWindow () {
    win = new BrowserWindow({
        width: 300,
        height: 425,
        minWidth: 300,
        minHeight: 300,
        resizable: false,
        show: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, "src/index.html"),
        protocol: "file",
        slashes: true
    }))

    win.webContents.on("did-finish-load", () => {
        const appVersion = app.getVersion()
        win.webContents.send("app-version", appVersion)
    })

    win.once("ready-to-show", win.show)

    // win.webContents.openDevTools()
    Menu.setApplicationMenu(null)

    win.on("closed", () => {
        win = null
    })

    // ==== dark / light mode ====
    ipcMain.handle("dark-mode:toggle", () => {
        toggle()
        return nativeTheme.shouldUseDarkColors
    })
    ipcMain.handle("dark-mode:system", () => {
        store.set("theme", "system")
        nativeTheme.themeSource = "system"
        return nativeTheme.shouldUseDarkColors
    })
    ipcMain.handle("dark-mode:user", () => {
        return store.get("theme")
    })
    ipcMain.handle("dark-mode:getSystem", () => {
        return nativeTheme.shouldUseDarkColors
    })
    if(nativeTheme.shouldUseDarkColors && store.get("theme") === "light"){
        toggle()
    }
    if(nativeTheme.shouldUseDarkColors && store.get("theme") === "dark" || !nativeTheme.shouldUseDarkColors && store.get("theme") === "light"){
        store.set("theme", "system")
    }

    // ==== accent color ====
    ipcMain.handle("get-accent-color", () => {
        return getAccentColor()
    })
    ipcMain.handle("get-system-accent-color", () => {
        return getSystemAccentColor()
    })
    ipcMain.handle("set-accent-color", (event, color) => {
        store.set("accentColor", color)
        win.webContents.send("accent-color-updated", color)
    })

    // změna velikosti okna při aktualizaci
    ipcMain.on("resize-main-window", (event, width, height) => {
        if(win) {
            win.setSize(width, height)
            win.center()
        }
    })
}

// ==== main proccess ====
app.on("ready", () => {
    createWindow()

    autoUpdater.checkForUpdatesAndNotify()    
})

app.on("window-all-closed", () => {
    if(process.platform !== "darwin"){
        app.quit()
    }
})

app.on("activate", () => {
    if(win === null){
        createWindow()
    }
})

// ==== autoUpdater události ====
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

autoUpdater.on("update-available", (info) => {
    win.webContents.send("message-send", "available")
})
autoUpdater.on("update-not-available", (info) => {
    win.webContents.send("message-send", "unavailable")
})
autoUpdater.on("error", (err) => {
    win.setProgressBar(-1)
    setTimeout(() => {
        win.setProgressBar(0)
    }, 5000)

    win.webContents.send("message-send", "Nepodařilo se zkontrolovat aktualizace: " + err.message)
})
autoUpdater.on("download-progress", (info) => {
    const progress = info.percent / 100
    win.setProgressBar(progress)

    win.webContents.send("update-progress-send", info)
})
autoUpdater.on("update-downloaded", (info) => {
    win.setProgressBar(1)
    setTimeout(() => {
      win.setProgressBar(0)
    }, 2000)

    win.webContents.send("message-send", "downloaded")
})

nativeTheme.on("updated", () => {
    if(win){
        const color = getAccentColor()
        win.webContents.send("accent-color-updated", color)
    }
})

// ==== open new window ===
let newWin

ipcMain.on("open-new-window-request", (e, data) => {
    newWin = new BrowserWindow({
        width: data.width,
        height: data.height,
        resizable: data.resizable,
        // fullscreen: data.fullscreen,
        show: false,
        title: data.title,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    })

    newWin.loadURL(url.format({
        pathname: path.join(__dirname, "src/html/" + data.file),
        protocol: "file", 
        slashes: true
    }))

    if(data.fullscreen){
        newWin.maximize()
    }

    if(data.openDevTools){
        newWin.webContents.openDevTools()
    }

    newWin.once("ready-to-show", newWin.show)
})