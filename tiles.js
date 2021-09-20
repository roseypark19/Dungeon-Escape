class MapTile {
    constructor(game, x, y, width, height, code) {
        Object.assign(this, {game, x, y, width, height, code});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
        let frameCount = TILE_ANIMATIONS[this.code] ? TILE_ANIMATIONS[this.code].frameCount : 1;
        let frameDuration = TILE_ANIMATIONS[this.code] ? TILE_ANIMATIONS[this.code].frameDuration : 1;
        this.animator = new Animator(this.spritesheet, PARAMS.BLOCKWIDTH * (this.code - 1), 0, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH,
                                     frameCount, frameDuration, false, true);
        if (this.code === 27) this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {

    };

    draw(ctx) {
        this.animator.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);

        if (this.BB && PARAMS.DEBUG) {
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
    };
};

class Boundary {
    constructor(game, x, y, width, height, top, bottom, left, right, projectilePass) {
        Object.assign(this, {game, x, y, width, height, top, bottom, left, right, projectilePass});
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    };

    update() {

    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            ctx.lineWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
    };
};