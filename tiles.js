// class Ground {
//     constructor(game, x, y, width, height, code) {
//         Object.assign(this, {game, x, y, width, height, code});
//         this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
//         // this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
//     };

//     update() {

//     };

//     draw(ctx) {
//         ctx.drawImage(this.spritesheet, PARAMS.BLOCKWIDTH * (this.code - 1), 0, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, 
//                       this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);

//         // if (PARAMS.DEBUG) {
//         //     ctx.strokeStyle = 'Red';
//         //     ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
//         // }
//     };
// };

// class Wall {
//     constructor(game, x, y, width, height, code) {
//         Object.assign(this, {game, x, y, width, height, code});
//         this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
//         // this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
//         // this.bbTop = new BoundingBox(this.x, this.y, this.width, this.height / 2);
//         // this.bbBottom = new BoundingBox(this.x, this.y + this.height / 2, this.width, this.height / 2);
//         // this.bbLeft = new BoundingBox(this.x, this.y, this.width / 2, this.height);
//         // this.bbRight = new BoundingBox(this.x + this.width / 2, this.y, this.width / 2, this.height);
//     };

//     update() {

//     };

//     draw(ctx) {
//         ctx.drawImage(this.spritesheet, PARAMS.BLOCKWIDTH * (this.code - 1), 0, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, 
//                       this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);

//         if (PARAMS.DEBUG) {
//             ctx.strokeStyle = 'Red';
//             ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
//             // ctx.strokeRect(this.bbTop.x - this.game.camera.x, this.bbTop.y - this.game.camera.y, this.bbTop.width, this.bbTop.height);
//             // ctx.strokeRect(this.bbBottom.x - this.game.camera.x, this.bbBottom.y - this.game.camera.y, this.bbBottom.width, this.bbBottom.height);
//             // ctx.strokeRect(this.bbLeft.x - this.game.camera.x, this.bbLeft.y - this.game.camera.y, this.bbLeft.width, this.bbLeft.height);
//             // ctx.strokeRect(this.bbRight.x - this.game.camera.x, this.bbRight.y - this.game.camera.y, this.bbRight.width, this.bbRight.height);
            
//         }
//     };
// };

class MapTile {
    constructor(game, x, y, width, height, code) {
        Object.assign(this, {game, x, y, width, height, code});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
        let frameCount = TILE_ANIMATIONS[this.code] ? TILE_ANIMATIONS[this.code].frameCount : 1;
        let frameDuration = TILE_ANIMATIONS[this.code] ? TILE_ANIMATIONS[this.code].frameDuration : 1;
        this.animator = new Animator(this.spritesheet, PARAMS.BLOCKWIDTH * (this.code - 1), 0, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,
                                     frameCount, frameDuration, false, true);
        // this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {

    };

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);
        // ctx.drawImage(this.spritesheet, PARAMS.BLOCKWIDTH * (this.code - 1), 0, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, 
        //               this.x - this.game.camera.x, this.y - this.game.camera.y, this.width, this.height);

        // if (PARAMS.DEBUG) {
        //     ctx.strokeStyle = 'Red';
        //     ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        // }
    };
};

class MapLayer {
    constructor(game, x, y, width, height, spritesheet) {
        Object.assign(this, {game, x, y, width, height, spritesheet});
        // this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
        // this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, this.width, this.height, 
                      this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.BLOCKWIDTH * 100, PARAMS.BLOCKWIDTH * 100);

        // if (PARAMS.DEBUG) {
        //     ctx.strokeStyle = 'Red';
        //     ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        // }
    };
};


class Boundary {
    constructor(game, x, y, width, height, top, bottom, left, right) {
        Object.assign(this, {game, x, y, width, height, top, bottom, left, right});
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {

    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
    };
};