class Projectile {

    constructor(game, x, y, velX, velY, width, height, sprite, range) {
        Object.assign(this, {game, x, y, velX, velY, width, height, range});
        this.spritesheet = ASSET_MANAGER.getAsset(sprite);
        this.originPoint = {x: this.x, y: this.y};
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x + this.width * PARAMS.SCALE / 6, this.y + this.height * PARAMS.SCALE / 6, 
                                  this.width * PARAMS.SCALE * 2 / 3, this.height * PARAMS.SCALE * 2 / 3, this.BB);
    };

    update() {
        this.x += this.velX;
        this.y += this.velY;
        if (distance(this.originPoint, {x: this.x, y: this.y}) > this.range) {
            this.removeFromWorld = true;
        }
        if (!this.removeFromWorld) {
            this.updateBB();
            var that = this;
            this.game.entities.forEach(function(entity) {
                if (entity.BB && that.BB.collide(entity.BB)) {
                    if (entity instanceof Boundary && !entity.projectilePass) {
                        that.removeFromWorld = true;
                    }
                }
            });
        }   
    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, 13, 14, this.x - this.game.camera.x, this.y - this.game.camera.y, this.width * PARAMS.SCALE, 
                                                                                                                this.height * PARAMS.SCALE);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.lineWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
    };
};