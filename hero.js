class Hero {
    constructor(game, x, y, code) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset(HERO_SPRITES[code]);
        this.code = code;
        this.weapon = new Weapon(this.game, this);
        this.facing = 0; // 0 = right, 1 = left
        this.state = 0; // 0 = idle, 1 = walking, 2 = hit
        this.shooting = 0; // 0 = not shooting, 1 = shooting
        this.maxVelocity = 7 / 3 * PARAMS.SCALE;
        this.accelerationConstant = 0.1 / 3 * PARAMS.SCALE;
        this.dead = false;
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
        let accelX = 0;
        let accelY = 0;
        
        if (this.game.right) {
            accelX += this.accelerationConstant;
            this.facing = 0;
        }
        if (this.game.left) {
            accelX -= this.accelerationConstant;
            this.facing = 1;
        }
        if (this.game.up) {
            accelY -= this.accelerationConstant;
        }
        if (this.game.down) {
            accelY += this.accelerationConstant;
        }

        if (accelX !== 0) newVelX = this.hasChangedDirection(accelX, this.velocity.x) ? accelX : this.velocity.x + accelX;
        if (Math.abs(newVelX) > this.maxVelocity) newVelX = newVelX > 0 ? this.maxVelocity : -this.maxVelocity;
        if (accelY !== 0) newVelY = this.hasChangedDirection(accelY, this.velocity.y) ? accelY : this.velocity.y + accelY;
        if (Math.abs(newVelY) > this.maxVelocity) newVelY = newVelY > 0 ? this.maxVelocity : -this.maxVelocity;

        let diagonalVel = 0;
        let maxVelComponent = 0;
        if (newVelX !== 0 && newVelY !== 0) {
            maxVelComponent = Math.max(Math.abs(newVelX), Math.abs(newVelY));
            diagonalVel = Math.sqrt(Math.pow(maxVelComponent, 2) / 2);
        }

        this.velocity.x = newVelX;
        this.velocity.y = newVelY;

        let diagonalX = this.velocity.x > 0 ? diagonalVel : -diagonalVel;
        let diagonalY = this.velocity.y > 0 ? diagonalVel : -diagonalVel;

        if (diagonalVel !== 0) {
            this.x += diagonalX;
            this.y += diagonalY;
        } else {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }

        this.state = this.velocity.x === 0 && this.velocity.y === 0 ? 0 : 1;
        this.shooting = this.game.clicked ? 1 : 0;

        if (this.game.clicked) {
            let mousePoint = this.game.mouse ? this.game.mouse : this.game.click;
            this.facing = mousePoint.x < this.getCenterPoint().x - this.game.camera.x ? 1 : 0; 
        }
        // this.weapon.update(true);
        this.updateBB();

        this.originalCollisionBB = this.collisionBB.previous;
        var that = this;
        this.game.entities.forEach(function(entity) {
            if (entity.BB && that.collisionBB.collide(entity.BB)) {
                if (entity instanceof Boundary) {
                    resolveCollision(that, entity);
                    that.updateBB();  
                }
            }
        });
        // this.weapon.update();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, HERO_DIMENSIONS.width * PARAMS.SCALE, HERO_DIMENSIONS.height * PARAMS.SCALE, this.BB);
        this.collisionBB = new BoundingBox(this.x, this.y + (HERO_DIMENSIONS.height * 2 / 3 * PARAMS.SCALE), 
                                           HERO_DIMENSIONS.width * PARAMS.SCALE, HERO_DIMENSIONS.height * PARAMS.SCALE / 3, this.collisionBB);
        // if (this.facing === 0) { // right
        //     this.collisionBB = new BoundingBox(this.BB.left, this.BB.bottom - this.weapon.BB.height - this.weapon.maxAdjust - this.weapon.pixelsAboveGround, 
        //                                        this.BB.width + this.weapon.BB.width, this.weapon.BB.height + this.weapon.maxAdjust + this.weapon.pixelsAboveGround, this.collisionBB);
            // if (this.shooting === 1) {
            //     this.collisionBB = new BoundingBox(this.BB.x, this.BB.bottom - this.weapon.BB.height - this.weapon.maxAdjust - this.weapon.pixelsAboveGround,
            //                                        PARAMS.SCALE * (HERO_DIMENSIONS.width + this.weapon.data.spacing + this.weapon.data.shootPadding) + this.weapon.BB.width, 
            //                                        this.weapon.BB.height + this.weapon.maxAdjust + this.weapon.pixelsAboveGround, this.collisionBB);
            // } else {
            //     this.collisionBB = new BoundingBox(this.BB.x, this.BB.bottom - this.weapon.BB.height - this.weapon.maxAdjust - this.weapon.pixelsAboveGround,
            //                                        PARAMS.SCALE * (HERO_DIMENSIONS.width + this.weapon.data.spacing) + this.weapon.BB.width,
            //                                        this.weapon.BB.height + this.weapon.maxAdjust + this.weapon.pixelsAboveGround, this.collisionBB);
            // }      
        // } else { // left
        //     this.collisionBB = new BoundingBox(this.weapon.BB.left, this.BB.bottom - this.weapon.BB.height - this.weapon.maxAdjust - this.weapon.pixelsAboveGround, 
                                            //    this.BB.width + this.weapon.BB.width, this.weapon.BB.height + this.weapon.maxAdjust + this.weapon.pixelsAboveGround, this.collisionBB);
            // if (this.shooting === 1) {
            //     this.collisionBB = new BoundingBox(this.weapon.BB.x - PARAMS.SCALE * this.weapon.data.shootPadding, 
            //                                        this.BB.bottom - this.weapon.BB.height - this.weapon.maxAdjust - this.weapon.pixelsAboveGround,
            //                                        PARAMS.SCALE * (HERO_DIMENSIONS.width + this.weapon.data.spacing + this.weapon.data.shootPadding) + this.weapon.BB.width, 
            //                                        this.weapon.BB.height + this.weapon.maxAdjust + this.weapon.pixelsAboveGround, this.collisionBB);
            // } else {
            //     this.collisionBB = new BoundingBox(this.weapon.BB.x, 
            //                                        this.BB.bottom - this.weapon.BB.height - this.weapon.maxAdjust - this.weapon.pixelsAboveGround,
            //                                        PARAMS.SCALE * (HERO_DIMENSIONS.width + this.weapon.data.spacing) + this.weapon.BB.width, 
            //                                        this.weapon.BB.height + this.weapon.maxAdjust + this.weapon.pixelsAboveGround, this.collisionBB);
            // }
            
        // }
    };

    hasChangedDirection(acceleration, velocity) {
        return (acceleration < 0 && velocity > 0) || (acceleration > 0 && velocity < 0);
    };
    
    draw(ctx) {
        // let weaponDrawn = false;
        // if (this.weapon.rotationAngle >= 225 * Math.PI / 180 && this.weapon.rotationAngle <= 315 * Math.PI / 180) {
        //     weaponDrawn = true;
        //     this.weapon.draw(ctx);
        // }
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);
        

        // this.weapon.draw(ctx);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
            ctx.strokeRect(this.collisionBB.x - this.game.camera.x, this.collisionBB.y - this.game.camera.y, this.collisionBB.width, this.collisionBB.height);
            ctx.beginPath();
            ctx.arc(this.collisionBB.center.x - this.game.camera.x, this.collisionBB.center.y - this.game.camera.y, 60, 0, Math.PI * 2);
            ctx.stroke();
        }
        // if (weaponDrawn === false) {
        //     this.weapon.draw(ctx);
        // } 
    };

    getCenterPoint() {
        return { x : this.x + HERO_DIMENSIONS.width * PARAMS.SCALE / 2, y : this.y + HERO_DIMENSIONS.height * PARAMS.SCALE / 2 };
    };
};

