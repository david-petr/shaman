const { app, BrowserWindow, ipcMain, nativeTheme, Menu, systemPreferences } = require("electron")
const { autoUpdater } = require("electron-updater")
const path = require("path")
const url = require("url")

let win

// ==== functions ====
function getAccentColor(){
    if (process.platform === "win32") {
        return `#${systemPreferences.getAccentColor()}`
    } else if (process.platform === "darwin") {
        return systemPreferences.getUserDefault("AppleAccentColor", "string")
    } else {
        return null
    }
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

    win.once("ready-to-show", win.show)

    // win.webContents.openDevTools()
    Menu.setApplicationMenu(null)

    win.on("closed", () => {
        win = null
    })

    // ==== dark / light mode ====
    ipcMain.handle("dark-mode:toggle", () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = "light"
        } else {
            nativeTheme.themeSource = "dark"
        }
        return nativeTheme.shouldUseDarkColors
    })

    ipcMain.handle("dark-mode:system", () => {
        nativeTheme.themeSource = "system"
    })

    ipcMain.handle("get-accent-color", () => {
        return getAccentColor()
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
    win.webContents.send("message-send", "Nepodařilo se zkontrolovat aktualizace: " + err.message)
})
autoUpdater.on("download-progress", (info) => {
    win.webContents.send("update-progress-send", info)
})
autoUpdater.on("update-downloaded", (info) => {
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