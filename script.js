// ------- CONFIGURATION ---------
let img_speed, img_order, tip_speed, tip_order, server_logo, server_logo_alpha, tipJSON, credits;
tipJSON = "./tips.json";

// Adjusts how fast the images switch in seconds.
img_speed = 10;

// Adjusts the order of which the images load.
img_order = "first_to_last";

// Adjusts how fast the tips switch in seconds.
tip_speed = 10;

// Adjusts the order of which the tips load.
tip_order = "first_to_last";

// Adjusts the logo, opacity and position of the server logo.
server_logo = "monolith-servers.png";
server_logo_alpha = "75%";

// Display credits to the creator of the image(s).
credits = false;


// first_to_last = Order from First Object to Last Object.
// last_to_first = Order from Last Object to First Object.
// random = Chooses object at random every interval.
// static = Chooses an object at random and that's it; doesn't change.
// ------- END OF CONFIGURATION ---------

const backgroundImage = document.getElementById("background-image");
const tipText = document.getElementById("tip-text");
const serverLogo = document.getElementById("server-logo");

serverLogo.src = `${server_logo}`;
serverLogo.style.opacity = server_logo_alpha.replace("%", "") / 100;

const backgroundLayer1 = document.getElementById("background-layer-1");
const backgroundLayer2 = document.getElementById("background-layer-2");

let activeLayer = backgroundLayer1;

if (credits === false) {
    document.getElementById("preview-tip").style.display = "none";
}


function displayImage(index) {
    const imageElement = document.getElementById("image");
    const authorElement = document.getElementById("img_author");

    if (index >= 0 && index < images.length) {
        imageElement.src = images[index].fileName;
        authorElement.textContent = `Author: ${images[index].author}`;
    }
}

async function fetchImages() {
    try {
        const response = await fetch("./images.json");
        if (!response.ok) throw new Error("Failed to fetch images.json");

        const images = await response.json();
        if (!Array.isArray(images)) throw new Error("Invalid images.json format");

        // Remove background image and set black background color; this is to allow smooth transitions, this only happens if
        // the above lines doesn't fail; if they fail; the original Monolith Roleplay background will display.
        backgroundImage.style.backgroundImage = "none";
        backgroundImage.style.backgroundColor = "black";

        return images.filter((image) => image.fileName && /\.(jpg|jpeg|png|gif)$/i.test(image.fileName));
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
}

function preloadImages(imageUrls) {
    imageUrls.forEach((imageUrl) => {
        const img = new Image();
        img.src = `./images/${imageUrl}?v=2`;
    });
}

function getNextItem(list, order, index) {
    if (list.length === 0) return "";

    // To choose which one of these you want; update the img_order or tip_order in the configuration at the very top;
    // to one of these values below; don't modify this code here as this will break both tips and images.

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

    preloadImages(images.map(image => image.fileName));

    let index = 0;

    activeLayer.style.backgroundImage = `url('./images/${images[index].fileName}?v=2')`;
    document.getElementById("img_author").textContent = `${images[index].author}`;
    index++;

    setInterval(() => {
        const nextImage = getNextItem(images, img_order, index);
        const inactiveLayer = activeLayer === backgroundLayer1 ? backgroundLayer2 : backgroundLayer1;

        inactiveLayer.style.backgroundImage = `url('./images/${nextImage.fileName}?v=2')`;
        document.getElementById("img_author").textContent = `${nextImage.author}`;
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

    tipText.innerHTML = getNextItem(tips, tip_order, index);
    index++;

    setInterval(() => {
        const nextTip = getNextItem(tips, tip_order, index);
        if (nextTip) {
            tipText.innerHTML = nextTip;
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
    // This needs to fire at least once to start the cycling of images and tips.
    
    updateImage();
    updateTip();
};