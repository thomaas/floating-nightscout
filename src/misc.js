/**
 * Gibt die Anzahl der Minuten seit dem Zeitstempel
 * @param {Number} dt Zeitstempel in millisekunden
 */
const minutes_ago = (dt) => {
    let dt2 = new Date(dt);
    var diff = (dt2.getTime() - new Date().getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
};

/**
 * Schließt das akutelle Fenster
 */
const closeWindow = () => {
    require("electron").remote.getCurrentWindow().close();
};

/**
 * Öffnet das Einstellungsmenü (Sendet Befehl an main)
 */
const openConfig = () => {
    require("electron").ipcRenderer.send("configwindow");
};

/**
 * Halfmoon Progressbar Tool
 * @param {HTMLElement} el Progressbar Element
 * @param {Number} percent Percent of Progressbar
 * @param {boolean} animated Should it be animated
 * @param {String} colorClass color, given in css Class
 */
const setProgressbar = (el, percent, animated, colorClass) => {
    el.style.width = percent.toString() + "%";
    el.classList.remove("bg-success");
    el.classList.remove("bg-danger");
    el.classList.remove("bg-secondary");
    el.classList.add(colorClass);
    if (animated) {
        el.classList.add("progress-bar-animated");
    } else {
        el.classList.remove("progress-bar-animated");
    }
};

/**
 * Lädt Daten von Nightscout
 * @param {String} url URL from Nightscout ending with /
 * @returns {{state:Number,json:{status:[{now:Number}],bgs:[{sgv:String,direction:String,datetime:Number,iob:String,battery:String,bgdelta:Number}]}}}
 */
const fetchNightscout = async(url) => {
    try {
        return await fetch(url + "pebble", {}).then(async(res) => ({
            state: res.status,
            json: await res.json(),
        }));
    } catch (e) {
        return { state: 0, json: null };
    }
};

module.exports = {
    minutes_ago,
    closeWindow,
    openConfig,
    setProgressbar,
    fetchNightscout,
};