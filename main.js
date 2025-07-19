const { app, BrowserWindow, ipcMain, nativeTheme, Menu, systemPreferences } = require("electron")
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
}

// ==== main proccess ====
app.on("ready", createWindow)

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