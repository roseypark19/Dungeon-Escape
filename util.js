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

// add global parameters here

const HERO_SPRITES = ["./sprites/knight.png", "./sprites/knight_female.png", "./sprites/wizard.png", "./sprites/wizard_female.png", 
                      "./sprites/elf.png", "./sprites/elf_female.png", "./sprites/lizard.png", "./sprites/lizard_female.png"];

const HERO_DIMENSIONS = { width : 16, height : 28 };

const WEAPON_DATA = [{width : 10, height : 22, sprite : "./sprites/baton.png"}, 
                     {width : 30, height : 30, sprite : "./sprites/staff.png", range: 500,
                      projectile : { sprite: "./sprites/fireball.png", velocity: 8, width: 13, height: 14, pattern: 0}}, 
                     {width : 24, height : 24, sprite : "./sprites/sword_gold.png" }, 
                     {width : 8, height : 19, sprite : "./sprites/cleaver.png"}]

const BOSS_DATA = [{width : 32, height : 36, sprite : "./sprites/bigdemon.png"}, 
                   {width : 32, height : 32, sprite : "./sprites/bigogre.png"}, 
                   {width : 32, height : 34, sprite : "./sprites/bigzombie.png"}];

const TILE_ANIMATIONS = { 27: { frameCount: 4, frameDuration: 0.75 }, 39: { frameCount: 3, frameDuration: 0.2 }, 
                          42: { frameCount: 3, frameDuration: 0.2 }, 45: { frameCount: 3, frameDuration: 0.2 }, 
                          48: { frameCount: 3, frameDuration: 0.2 }};

const PARAMS = {
    BLOCKWIDTH : 16,
    DEBUG : false,
    DEBUG_WIDTH : 1,
    DEBUG_COLOR: 'White',
    CANVAS_WIDTH : 1200,
    CANVAS_HEIGHT : 1200,
    SCALE : 3
};

function collide(collisionBB, originalCollisionBB, boundary) {
    if (boundary.top) {
        var top = topCollision(collisionBB, originalCollisionBB, boundary.BB);
        if (top) return top;
    }
    if (boundary.bottom) {
        var bottom = bottomCollision(collisionBB, originalCollisionBB, boundary.BB);
        if (bottom) return bottom;
    }
    if (boundary.left) {
        var left = leftCollision(collisionBB, originalCollisionBB, boundary.BB);
        if (left) return left;
    }
    if (boundary.right) {
        var right = rightCollision(collisionBB, originalCollisionBB, boundary.BB);
        if (right) return right;
    }
};

function leftCollision(collisionBB, originalCollisionBB, boundaryBB) {
    if (collisionBB.x - originalCollisionBB.x > 0) {
        if (collisionBB.right > boundaryBB.left && originalCollisionBB.right <= boundaryBB.left) {
            return { x: -1, y: 0 };
        }
    }
    return false;
};

function rightCollision(collisionBB, originalCollisionBB, boundaryBB) {
    if (collisionBB.x - originalCollisionBB.x < 0) {
        if (collisionBB.left < boundaryBB.right && originalCollisionBB.left >= boundaryBB.right) {
            return { x: 1, y: 0 };
        }
    }
    return false;
};

function topCollision(collisionBB, originalCollisionBB, boundaryBB) {
    if (collisionBB.y - originalCollisionBB.y > 0) {
        if (collisionBB.bottom > boundaryBB.top && originalCollisionBB.bottom <= boundaryBB.top) {
            return { x: 0, y: -1 };
        }
    }
    return false;
};

function bottomCollision(collisionBB, originalCollisionBB, boundaryBB) {
    if (collisionBB.y - originalCollisionBB.y < 0) {
        if (collisionBB.top < boundaryBB.bottom && originalCollisionBB.top >= boundaryBB.bottom) {
            return { x: 0, y: 1 };
        }
    }
    return false;
};

function resolveCollision(entity, boundary) {
    let collisionResolution = collide(entity.collisionBB, entity.originalCollisionBB, boundary);
    if (collisionResolution) {
        if (collisionResolution.x !== 0) {
            entity.velocity.x = 0;
            if (collisionResolution.x < 0) {
                entity.x = boundary.BB.left - entity.collisionBB.width - (entity.BB.width - entity.collisionBB.width) / 2;
            } else if (collisionResolution.x > 0) {
                entity.x = boundary.BB.right - (entity.BB.width - entity.collisionBB.width) / 2;
            }
        } else if (collisionResolution.y !== 0) {
            entity.velocity.y = 0;
            if (collisionResolution.y > 0) {
                entity.y = boundary.BB.bottom - (entity.BB.height - entity.collisionBB.height);
            } else if (collisionResolution.y < 0) {
                entity.y = boundary.BB.top - entity.BB.height;
            }
        }
    } 
};

