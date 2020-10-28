const electron = require("electron");
const { ipcRenderer } = electron;
const store = require("../../store");
const halfmoon = require("../../halfmoon/halfmoon-module");
const { setProgressbar } = require("../../misc");
const closeWindow = () => electron.remote.getCurrentWindow().close();

//const store = new Store({ configName: "config" });
const progressbar = document.getElementById("nsprogress")

const init = () => {
    load();
    document.getElementById(
        "version"
    ).innerText = electron.remote.app.getVersion();
};

const load = () => {
    document.getElementById("nsurl").value = store.get("nightscoutURL");
    document.getElementById("refreshinterval").value = store.get(
        "refreshInterval"
    );
};

const testUrl = () => {
    console.log("test");
    setProgressbar(progressbar, 50, true, "bg-secondary");
    fetch(document.getElementById("nsurl").value + "pebble").then((success) => {
        console.log(success);
        if (success.status == 200) {
            document.getElementById("nsurl").classList.remove("is-invalid");
            setProgressbar(progressbar, 100, false, "bg-success")
        } else {
            throw "Not Valid";
        }
    }).catch((err) => {
        console.log(err)
        document.getElementById("nsurl").classList.add("is-invalid");
        setProgressbar(progressbar, 100, false, "bg-danger")
    })
}

const save = () => {
    store.set("nightscoutURL", document.getElementById("nsurl").value);
    store.set(
        "refreshInterval",
        document.getElementById("refreshinterval").value
    );
    ipcRenderer.send("reloadMain");
};




init();