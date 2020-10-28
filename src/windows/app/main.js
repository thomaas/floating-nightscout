const electron = require("electron");
const remote = electron.remote;
const { Menu, MenuItem } = remote;
const { ipcRenderer } = electron;
const store = require("../../store");

//const { closeWindow } = require("../misc")

const { minutes_ago, closeWindow, openConfig } = require("../../misc");
const { displayData, displayError } = require("./renderer");

const readData = async() => {
    if (navigator.onLine) {
        const data = await fetchData();
        if (data.state == 200) {
            displayData(
                data.json.bgs[0].sgv,
                data.json.bgs[0].bgdelta,
                data.json.bgs[0].direction,
                minutes_ago(data.json.bgs[0].datetime)
            );
        } else {
            displayError(
                "Nightscout Seite reagiert nicht oder URL ist falsch (" +
                data.state +
                ")"
            );
        }
    } else {
        //document.getElementById("bg").innerHTML = "Offline";
        displayError("Offline");
    }

    console.log("D");
};

// {{status:[{now:Number}],bgs:[{sgv:String,direction:String,datetime:Number,iob:String,battery:String}]}}

/**
 * @returns {{state:Number,json:{status:[{now:Number}],bgs:[{sgv:String,direction:String,datetime:Number,iob:String,battery:String,bgdelta:Number}]}}}
 */
const fetchData = async() => {
    try {
        return await fetch(store.get("nightscoutURL") + "pebble", {}).then(
            async(res) => ({
                state: res.status,
                json: await res.json(),
            })
        );
    } catch (e) {
        return { state: 0, json: null };
    }
};

const init = () => {
    if (store.get("nightscoutURL") == "") {
        displayError("Keine Nightscout URL gesetzt");
        openConfig();
    } else {
        readData();
    }
    setInterval(
        readData,
        (store.get("refreshInterval") ? store.get("refreshInterval") : 10) * 1000
    );
};

init();

// Right-click Menu
const menu = new Menu();
menu.append(new MenuItem({ label: "Schliessen", click: closeWindow }));
menu.append(new MenuItem({ label: "Einstellungen", click: openConfig }));
menu.append(new MenuItem({ label: "Aktualisieren", click: readData }));
window.addEventListener(
    "contextmenu",
    (e) => {
        e.preventDefault();
        menu.popup();
    },
    false
);