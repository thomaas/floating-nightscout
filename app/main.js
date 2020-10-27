const electron = require("electron");
const remote = electron.remote;
const { Menu, MenuItem } = remote
const { ipcRenderer } = electron;
const Store = require("../Store");
const { closeWindow } = require("../misc")

const store = new Store({
    configName: "config",
    defaults: {
        nightscoutURL: "https://nightscout.toastbrot.org/",
        refreshInterval: 20,
    },
});

const { minutes_ago } = require("../misc");
const { read } = require("fs");

const openConfig = () => {
    ipcRenderer.send("configwindow");
};





const DIR_FLAT = "Flat";
const DIR_UP = "SingleUp";
const DIR_UP_45 = "FortyFiveUp";
const DIR_DOWN = "SingleDown";
const DIR_DOWN_45 = "FortyFiveDown";

const load = () => {
    const req = remote.net.request(store.get("nightscoutURL") + "pebble");
    req.on("response", (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));
            document.getElementById("bg").innerHTML = data;
        });
    });
    req.end();
};

const readData = async() => {
    if (navigator.onLine) {
        const data = await fetchData();
        if (data.state == 200) {
            document.getElementById("bg").innerHTML = data.json.bgs[0].sgv;
            displayData(
                data.json.bgs[0].sgv,
                data.json.bgs[0].bgdelta,
                data.json.bgs[0].direction,
                minutes_ago(new Date(data.json.bgs[0].datetime))
            );
        } else {
            document.getElementById("bg").innerHTML = "Komischer Fehler";
        }
    } else {
        document.getElementById("bg").innerHTML = "Offline";
    }
    console.log("D");
};

/**
 *
 * @param {Number} bg
 * @param {String} dir
 * @param {Number} timeago
 * @param {Number} bgdelta
 */
const displayData = (bg, bgdelta, dir, timeago) => {
    document.getElementById("bg").innerHTML = bg;
    document.getElementById("delta").innerHTML = bgdelta >= 0 ? "+" + bgdelta : bgdelta;
    const dirEl = document.getElementById("dir");
    switch (dir) {
        case DIR_UP:
            dirEl.innerHTML = "&#8593;";
            break;
        case DIR_UP_45:
            dirEl.innerHTML = "&#8599;";
            break;
        case DIR_DOWN:
            dirEl.innerHTML = "&#8595;";
            break;
        case DIR_DOWN_45:
            dirEl.innerHTML = "&#8600;";
            break;
        case DIR_FLAT:
            dirEl.innerHTML = "&#8594;";
            break;
        default:
            dirEl.innerHTML = "&times;";
    }
    document.getElementById("timeago").innerHTML = timeago;
};

// {{status:[{now:Number}],bgs:[{sgv:String,direction:String,datetime:Number,iob:String,battery:String}]}}

/**
 * @returns {{state:Number,json:{status:[{now:Number}],bgs:[{sgv:String,direction:String,datetime:Number,iob:String,battery:String,bgdelta:Number}]}}}
 */
const fetchData = async() => {
    return await fetch(store.get("nightscoutURL") + "pebble", {}).then(async(res) => ({
        state: res.status,
        json: await res.json(),
    }));
};
readData();
setInterval(
    readData,
    (store.get("refreshInterval") ? store.get("refreshInterval") : 10) * 1000
);

// Right-click Menu
const menu = new Menu();
menu.append(new MenuItem({ label: "Schliessen", click: closeWindow }))
menu.append(new MenuItem({ label: "Einstellungen", click: openConfig }))
menu.append(new MenuItem({ label: "Aktualisieren", click: readData }))
window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup()
}, false)