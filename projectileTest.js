class Projectile {
    constructor(game, x, y, range, velocity, shotPattern, friendly, width, height, scale, sprite) {
        Object.assign(this, {game, x, y, range, velocity, shotPattern, friendly, width, height, scale});
        this.spritesheet = ASSET_MANAGER.getAsset(sprite);
        this.originPoint = {x: this.x, y: this.y};
        this.vectorPoint = {x: this.x, y: this.y};
        this.updateBB();
    }

    updateBB() {
        this.BB = new BoundingBox(this.x + this.width * this.scale / 6, this.y + this.height * this.scale / 6, 
                                  this.width * this.scale * 2 / 3, this.height * this.scale * 2 / 3, this.BB);
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
        ctx.drawImage(this.spritesheet, 0, 0, this.width, this.height, this.x - this.game.camera.x, this.y - this.game.camera.y, this.width * this.scale, 
                      this.height * this.scale);

        // ctx.fillStyle = this.friendly ? 'Orange' : 'Silver';
        // ctx.strokeStyle = 'Black';
        // ctx.lineWidth = 4;
        // ctx.beginPath();
        // ctx.arc(this.BB.center.x - this.game.camera.x, this.BB.center.y - this.game.camera.y, this.BB.width / 2, 0, Math.PI * 2);
        // ctx.stroke();
        // ctx.fill();
        
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.lineWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
    };
};