class Hero {
    constructor(game, x, y, sprite, code) {
        Object.assign(this, { game, x, y, code });
        this.spritesheet = ASSET_MANAGER.getAsset(sprite);
        this.facing = 0; // 0 = right, 1 = left
        this.state = 0; // 0 = idle, 1 = walking, 2 = hit
        this.shooting = 0; // 0 = not shooting, 1 = shooting
        this.velocityConstant = 7 * PARAMS.SCALE / PARAMS.STANDARD_SCALE;
        this.velocity = { x : 0, y : 0 };
        this.animations = [];
        this.updateBB();
        this.loadAnimations();
    };

    loadAnimations() {
        for (var i = 0; i < 3; i++) { // 3 states
            this.animations.push([]);
            for (var j = 0; j < 2; j++) { // 2 directions
                this.animations[i].push([]);
            }
        }

        // idle animations

        // facing = 0 -> right
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, HERO_DIMENSIONS.width, HERO_DIMENSIONS.height, 4, 0.1, false, true);
        
        // facing = 1 -> left
        this.animations[0][1] = new Animator(this.spritesheet, 14 * HERO_DIMENSIONS.width, 0, HERO_DIMENSIONS.width, HERO_DIMENSIONS.height, 4, 0.1, true, true);

        // walking animations

        // facing = 0 -> right
        this.animations[1][0] = new Animator(this.spritesheet, 4 * HERO_DIMENSIONS.width, 0, HERO_DIMENSIONS.width, HERO_DIMENSIONS.height, 4, 0.1, false, true);

        // facing = 1 -> left
        this.animations[1][1] = new Animator(this.spritesheet, 10 * HERO_DIMENSIONS.width, 0, HERO_DIMENSIONS.width, HERO_DIMENSIONS.height, 4, 0.1, true, true);

        // hit animations

        // facing = 0 -> right
        this.animations[2][0] = new Animator(this.spritesheet, 8 * HERO_DIMENSIONS.width, 0, HERO_DIMENSIONS.width, HERO_DIMENSIONS.height, 1, 0.1, false, false);

        // facing = 1 -> left
        this.animations[2][1] = new Animator(this.spritesheet, 9 * HERO_DIMENSIONS.width, 0, HERO_DIMENSIONS.width, HERO_DIMENSIONS.height, 1, 0.1, false, false);
    };
    
    update() {
        this.previousCenter = this.getCenterPoint();

        let newVelX = 0;
        let newVelY = 0;
        
        if (this.game.right) {
            newVelX += this.velocityConstant;
            this.facing = 0;
        }
        if (this.game.left) {
            newVelX -= this.velocityConstant;
            this.facing = 1;
        }
        if (this.game.up) {
            newVelY -= this.velocityConstant;
        }
        if (this.game.down) {
            newVelY += this.velocityConstant;
        }

        if (newVelX !== 0 && newVelY !== 0) var diagonalVel = Math.sqrt(Math.pow(this.velocityConstant, 2) / 2);

        if (diagonalVel) {
            newVelX = newVelX > 0 ? diagonalVel : -diagonalVel;
            newVelY = newVelY > 0 ? diagonalVel : -diagonalVel;
        } 

        this.velocity.x = newVelX;
        this.velocity.y = newVelY;
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.state = this.velocity.x === 0 && this.velocity.y === 0 ? 0 : 1;
        this.shooting = this.game.clicked ? 1 : 0;

        if (this.game.clicked) {
            let mousePoint = this.game.mouse ? this.game.mouse : this.game.click;
            this.facing = mousePoint.x < this.getCenterPoint().x - this.game.camera.x ? 1 : 0; 
        }
        this.updateBB();

        this.originalCollisionBB = this.collisionBB.previous;
        var that = this;
        this.game.entities.forEach(function(entity) {
            if (entity instanceof Boundary && that.collisionBB.collide(entity.BB)) {
                Collision.resolveCollision(that, entity);
                that.updateBB();  
            }
        });
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, HERO_DIMENSIONS.width * PARAMS.SCALE, HERO_DIMENSIONS.height * PARAMS.SCALE, this.BB);
        this.collisionBB = new BoundingBox(this.x, this.y + (HERO_DIMENSIONS.height * 2 / 3 * PARAMS.SCALE), 
                                           HERO_DIMENSIONS.width * PARAMS.SCALE, HERO_DIMENSIONS.height * PARAMS.SCALE / 3, this.collisionBB);
    };

    hasChangedDirection(acceleration, velocity) {
        return (acceleration < 0 && velocity > 0) || (acceleration > 0 && velocity < 0);
    };
    
    draw(ctx) {
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);

        if (PARAMS.DEBUG) {
            ctx.lineWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
            ctx.strokeRect(this.collisionBB.x - this.game.camera.x, this.collisionBB.y - this.game.camera.y, this.collisionBB.width, this.collisionBB.height);
            ctx.beginPath();
            ctx.arc(this.collisionBB.center.x - this.game.camera.x, this.collisionBB.center.y - this.game.camera.y, 60, 0, Math.PI * 2);
            ctx.stroke();
        }
    };

    getCenterPoint() {
        // return { x : this.x + HERO_DIMENSIONS.width * PARAMS.SCALE / 2, y : this.y + HERO_DIMENSIONS.height * PARAMS.SCALE / 2 };
        return this.collisionBB.center;
    };
};

