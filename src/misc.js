const minutes_ago = (dt) => {
    let dt2 = new Date(dt);
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
}

module.exports = { minutes_ago, closeWindow, openConfig, setProgressbar };