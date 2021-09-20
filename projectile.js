class Projectile {

    constructor(game, x, y, velocity, width, height, sprite, shotPattern, range) {
        Object.assign(this, {game, x, y, velocity, width, height, fromHero});
        this.spritesheet = ASSET_MANAGER.getAsset(sprite);
        this.originPoint = {x: this.x, y: this.y};
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x + this.width * PARAMS.SCALE / 6, this.y + this.height * PARAMS.SCALE / 6, 
                                  this.width * PARAMS.SCALE * 2 / 3, this.height * PARAMS.SCALE * 2 / 3, this.BB);
    };

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.shotPattern <= 1 && distance(this.originPoint, {x: this.x, y: this.y}) > this.range) {
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
        ctx.drawImage(this.spritesheet, 0, 0, this.width, this.height, this.x - this.game.camera.x, this.y - this.game.camera.y, this.width * PARAMS.SCALE, 
                                                                                                                                 this.height * PARAMS.SCALE);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.lineWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
    };
};