const PARAMS = {
    BLOCKWIDTH : 16,
    DEBUG : false,
    DEBUG_WIDTH : 1,
    DEBUG_COLOR: 'White',
    CANVAS_WIDTH : 1200,
    CANVAS_HEIGHT : 1200,
    SCALE : 3
};


// returns a random integer between 0 and n-1
function randomInt(n) {
    return Math.floor(Math.random() * n);
};

// returns a string that can be used as a rgb web color
function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
};

// returns a string that can be used as a hsl web color
function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)";
};

function distance(pt1, pt2) {
    return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
};

function magnitude(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
};

function unitVector(vector) {
    return {x: vector.x / magnitude(vector), y: vector.y / magnitude(vector)};
};

function oscillate(input, min, max) {
    let range = max - min;
    return min + Math.abs(((input + range) % (range * 2)) - range);
};

function rotateImage(spritesheet, xStart, yStart, width, height, theta) {
    let offscreenCanvas = document.createElement('canvas');
    let dimension = Math.max(width, height);
    offscreenCanvas.width = dimension;
    offscreenCanvas.height = dimension;
    let offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.imageSmoothingEnabled = false;
    offscreenCtx.save();
    offscreenCtx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
    offscreenCtx.rotate(theta);
    offscreenCtx.translate(-offscreenCanvas.width / 2, -offscreenCanvas.height / 2);
    offscreenCtx.drawImage(spritesheet, xStart, yStart, width, height, 
                           width < dimension ? (dimension - width) / 2 : 0, 
                           height < dimension ? (dimension - height) / 2 : 0, width, height);
    offscreenCtx.restore();
    return offscreenCanvas;
};

// creates an alias for requestAnimationFrame for backwards compatibility
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

const HERO_SPRITES = ["./sprites/knight.png", "./sprites/knight_female.png", "./sprites/wizard.png", "./sprites/wizard_female.png", 
                      "./sprites/elf.png", "./sprites/elf_female.png", "./sprites/lizard.png", "./sprites/lizard_female.png"];

const HERO_DIMENSIONS = { width : 16, height : 28 };

const WEAPON_DATA = [{width : 10, height : 22, sprite : "./sprites/baton.png"}, 
                     {width : 30, height : 30, sprite : "./sprites/staff.png", range: 500,
                      projectile : { sprite: "./sprites/fireball.png", velocity: 8, 
                                     width: 13, height: 14, scale: 2.5, pattern: 0}}, 
                     {width : 24, height : 24, sprite : "./sprites/sword_gold.png" }, 
                     {width : 8, height : 19, sprite : "./sprites/cleaver.png"}];

const BOSS_DATA = [{width : 32, height : 36, sprite : "./sprites/bigdemon.png"}, 
                   {width : 32, height : 32, sprite : "./sprites/bigogre.png"}, 
                   {width : 32, height : 34, sprite : "./sprites/bigzombie.png"}];

const TILE_ANIMATIONS = { 27: { frameCount: 4, frameDuration: 0.75 }, 39: { frameCount: 3, frameDuration: 0.2 }, 
                          42: { frameCount: 3, frameDuration: 0.2 }, 45: { frameCount: 3, frameDuration: 0.2 }, 
                          48: { frameCount: 3, frameDuration: 0.2 }};





