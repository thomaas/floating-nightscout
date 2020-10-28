const electron = require("electron");
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        frame: false,
        //resizable: false,
        width: 200,
        height: 140,
        opacity: 0.9,
        fullscreenable: false,
        skipTaskbar: true,
        minimizable: false,
        alwaysOnTop: true,
        icon: "build/icon.png",
        title: "Floating Nightscout"
    });
    mainWindow.loadFile("src/windows/app/index.html");
};

const openConfigurationWindow = () => {
    let configWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        title: "Konfiguration",
        frame: false,
        parent: mainWindow,
        width: 455,
        height: 405,
        show: false,
    });
    configWindow.loadFile("src/windows/config/index.html");
    configWindow.on("ready-to-show", configWindow.show);
};

ipcMain.on("configwindow", (e) => {
    openConfigurationWindow();
});

ipcMain.on("reloadMain", () => {
    mainWindow.reload();
});

app.on("ready", () => {
    createWindow();
});