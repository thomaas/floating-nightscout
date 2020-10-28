const electron = require("electron");
const remote = electron.remote;
const { Menu, MenuItem } = remote;
const store = require("../../store");

const {
    minutes_ago,
    closeWindow,
    openConfig,
    fetchNightscout,
} = require("../../misc");
const { displayData, displayError } = require("./renderer");

const readData = async() => {
    if (navigator.onLine) {
        const data = await fetchNightscout(store.get("nightscoutURL"));
        if (data.state == 200) {
            if (data.json.bgs.length != 1) {
                displayError("Der Nightscout Server verwendet mehrere Blutzucker");
            } else {
                displayData(
                    data.json.bgs[0].sgv,
                    data.json.bgs[0].bgdelta,
                    data.json.bgs[0].direction,
                    minutes_ago(data.json.bgs[0].datetime)
                );
            }
        } else {
            displayError(
                "Nightscout Seite reagiert nicht oder URL ist falsch (" +
                data.state +
                ")"
            );
        }
    } else {
        displayError("Offline");
    }

    console.log("D");
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
    window.addEventListener("offline", () => readData());
    window.addEventListener("online", () => readData());
};

init();

// Registriere Rechtsklick Menü
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