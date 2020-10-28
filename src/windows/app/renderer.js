const DIR_FLAT = "Flat";
const DIR_UP = "SingleUp";
const DIR_UP_2 = "DoubleUp";
const DIR_UP_45 = "FortyFiveUp";
const DIR_DOWN = "SingleDown";
const DIR_DOWN_2 = "DoubleDown";
const DIR_DOWN_45 = "FortyFiveDown";

/**
 * Zeige Blutzuckerdaten an
 * @param {Number} bg
 * @param {String} dir
 * @param {Number} timeago
 * @param {Number} bgdelta
 */
const displayData = (bg, bgdelta, dir, timeago) => {
    document.getElementById("data-container").removeAttribute("hidden");
    document.getElementById("message-container").setAttribute("hidden", "true");
    document.getElementById("bg").innerHTML = bg;
    document.getElementById("delta").innerHTML =
        bgdelta >= 0 ? "+" + bgdelta : bgdelta;
    const dirEl = document.getElementById("dir");
    switch (dir) {
        case DIR_UP:
            dirEl.innerHTML = "&#8593;";
            break;
        case DIR_UP_2:
            dirEl.innerHTML = "&#8593;&#8593;";
            break;
        case DIR_UP_45:
            dirEl.innerHTML = "&#8599;";
            break;
        case DIR_DOWN:
            dirEl.innerHTML = "&#8595;";
            break;
        case DIR_DOWN_2:
            dirEl.innerHTML = "&#8595;&#8595;";
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

/**
 * Zeige einen Error bzw eine Errormessage an
 * @param {String} err_msg Die Errormessage
 */
const displayError = (err_msg) => {
    document.getElementById("data-container").setAttribute("hidden", "true")
    document.getElementById("message-container").removeAttribute("hidden");
    document.getElementById("message").innerText = err_msg
}

module.exports = { displayData, displayError }