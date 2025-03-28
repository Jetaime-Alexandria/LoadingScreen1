# Images
Put images in the images folder; then update the images.json and add a new line in the .json with the name of the file, for example. 

```json
[
    { "fileName": "1.png", "author": "Author1" },
    { "fileName": "2.png", "author": "Author2" },
    { "fileName": "3.jpg", "author": "Author3" },
    { "fileName": "4.jpg", "author": "Author4" },
    { "fileName": "5.jpg", "author": "Author5" },
    { "fileName": "6.jpg", "author": "Author6" }
]
```

# Tips
Just modify the tips.json file, add as many tips as you want in seperate lines. Here's an example: 

```json
[
    "Make sure to read the rules and respect other players for a great experience.",
    "If you have any questions, ask in chat or visit our Discord server for assistance.",
    "Check out the settings menu to adjust your controls, graphics, and keybinds for optimal gameplay.",
    "Follow server announcements to stay informed about events, updates, and new features!",
    "Participate in events and complete daily challenges to earn exclusive in-game rewards."
]
```

# Config

```js
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
tip_order = "first_to_last";

// Adjusts the displayed logo and opacity.
server_logo = "monolith-servers.png";
server_logo_alpha = "75%";

// ------- END OF CONFIGURATION ---------
```

This is the default configuration; this can be found inside of script.js; ONLY MODIFY THE CONFIGURATION; you might end up breaking the code for this and things won't work properly; please DM Jet0751 on Discord if you don't know Javascript and wish to update something; I'd be more than happy to help out :)