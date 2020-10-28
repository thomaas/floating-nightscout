const minutes_ago = (dt2) => {
    var diff = (dt2.getTime() - new Date().getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
};

const closeWindow = () => {
    require("electron").remote.getCurrentWindow().close();
};

const openConfig = () => {
    ipcRenderer.send("configwindow");
};

module.exports = { minutes_ago, closeWindow, openConfig };