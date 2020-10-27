const electron = require("electron");
const { ipcRenderer } = electron
const Store = require("../Store");

const closeWindow = () => electron.remote.getCurrentWindow().close();

const store = new Store({ configName: "config" });

const load = () => {
    document.getElementById("nsurl").value = store.get("nightscoutURL")
    document.getElementById("refreshinterval").value = store.get("refreshInterval")
}

const save = () => {
    store.set("nightscoutURL", document.getElementById("nsurl").value);
    store.set("refreshInterval", document.getElementById("refreshinterval").value);
    ipcRenderer.send("reloadMain");
}

load();