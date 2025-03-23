// ------- CONFIGURATION ---------
let img_speed, img_order, tip_speed, tip_order, server_logo, server_logo_alpha;
let tipJSON = "./tips.json";

// Adjusts how fast the images switch in seconds.
img_speed = 10;

// Adjusts the order of which the images load.
img_order = "first_to_last";

// Adjusts how fast the tips switch in seconds.
tip_speed = 10;

// Adjusts the order of which the tips load.
tip_order = "random";

// Adjusts the displayed logo and opacity.
server_logo = "monolith-servers.png";
server_logo_alpha = "75%";

// ------- END OF CONFIGURATION ---------

const backgroundImage = document.getElementById("background-image");
const tipText = document.getElementById("tip-text");
const serverLogo = document.getElementById("server-logo");

serverLogo.src = `${server_logo}`;
serverLogo.style.opacity = server_logo_alpha.replace("%", "") / 100;

const backgroundLayer1 = document.getElementById("background-layer-1");
const backgroundLayer2 = document.getElementById("background-layer-2");

let activeLayer = backgroundLayer1;

async function fetchImages() {
    try {
        const response = await fetch("./images.json");
        if (!response.ok) throw new Error("Failed to fetch images.json");

        const images = await response.json();
        if (!Array.isArray(images)) throw new Error("Invalid images.json format");

        return images.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
}

function preloadImages(imageUrls) {
    imageUrls.forEach((imageUrl) => {
        const img = new Image();
        img.src = `./images/${imageUrl}`;
    });
}

function getNextItem(list, order, index) {
    if (list.length === 0) return "";
    switch (order) {
        case "first_to_last":
            return list[index % list.length];
        case "last_to_first":
            return list[list.length - 1 - (index % list.length)];
        case "random":
            return list[Math.floor(Math.random() * list.length)];
        case "static":
            return list[0];
        default:
            return list[Math.floor(Math.random() * list.length)];
    }
}

async function updateImage() {
    const images = await fetchImages();
    if (images.length === 0) return;

    preloadImages(images);

    let index = 0;

    activeLayer.style.backgroundImage = `url('./images/${images[index]}')`;
    index++;

    setInterval(() => {
        const nextImage = getNextItem(images, img_order, index);
        const inactiveLayer = activeLayer === backgroundLayer1 ? backgroundLayer2 : backgroundLayer1;

        inactiveLayer.style.backgroundImage = `url('./images/${nextImage}')`;
        inactiveLayer.style.opacity = "1";
        activeLayer.style.opacity = "0";

        activeLayer = inactiveLayer;
        index++;
    }, img_speed * 1000);
}

async function updateTip() {
    const tips = await fetchJSON(tipJSON);
    if (tips.length === 0) return;

    let index = 0;

    tipText.textContent = getNextItem(tips, tip_order, index);
    index++;

    setInterval(() => {
        const nextTip = getNextItem(tips, tip_order, index);
        if (nextTip) {
            tipText.textContent = nextTip;
        }
        index++;
    }, tip_speed * 1000);
}

async function fetchJSON(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

window.onload = () => {
    updateImage();
    updateTip();
};
