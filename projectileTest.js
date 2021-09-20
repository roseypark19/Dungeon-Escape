class Projectile {
    constructor(game, x, y, range, velocity, shotPattern, friendly, width, height, sprite) {
        Object.assign(this, {game, x, y, range, velocity, shotPattern, friendly, width, height});
        this.spritesheet = ASSET_MANAGER.getAsset(sprite);
        this.originPoint = {x: this.x, y: this.y};
        this.vectorPoint = {x: this.x, y: this.y};
        this.update();
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x + this.width * PARAMS.SCALE / 6, this.y + this.height * PARAMS.SCALE / 6, 
                                  this.width * PARAMS.SCALE * 2 / 3, this.height * PARAMS.SCALE * 2 / 3, this.BB);
    };

    update() {    
        SHOT_PATTERNS[this.shotPattern](this);
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

    updateVectorPoint() {
        this.vectorPoint.x += this.velocity.x;
        this.vectorPoint.y += this.velocity.y;
        return distance(this.originPoint, this.vectorPoint) <= this.range;
    };

    getLinearDestination() {
        let unitVel = unitVector(this.velocity);
        if (this.reverse) {
            unitVel.x *= -1;
            unitVel.y *= -1;
        }
        return {x: this.originPoint.x + unitVel.x * this.range, y: this.originPoint.y + unitVel.y * this.range};
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