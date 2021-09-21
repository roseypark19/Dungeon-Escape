class Boss {
    constructor(game, x, y, code, hero) {
        Object.assign(this, { game, x, y, code, hero });

        this.spritesheet = ASSET_MANAGER.getAsset(BOSS_DATA[this.code].sprite);
        this.state = 0; // 0 = idle, 1 = walking
        this.facing = randomInt(2); // 0 = right, 1 = left
        this.dead = false;
        this.attackDistance = 500 / 3 * PARAMS.SCALE;
        this.maxVelocity = (randomInt(12) + 4) / 3 * PARAMS.SCALE; 
        this.minVelocity = 1 / 3 * PARAMS.SCALE;
        this.proximityConstant = 75 / 3 * PARAMS.SCALE;
        this.velocity = { x : 0, y : 0 };
        this.hp = 50;
        this.elapsedTimeShoot = 0;
        this.elapsedTimePattern = 0;
        this.pattern = randomInt(Object.keys(SHOT_PATTERNS).length - 1) + 1;
        this.dexterity = 0.2;
        this.patternSwitch = 0.05;
        this.range = 300;
        this.animations = [];
        this.updateBB();
        this.loadAnimations();
    };

    loadAnimations() {
        for (var i = 0; i < 2; i++) { // 2 states
            this.animations.push([]);
            for (var j = 0; j < 2; j++) { // 2 directions
                this.animations[i].push([]);
            }
        }

        // idle animations

        // facing = 0 -> right
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, BOSS_DATA[this.code].width, BOSS_DATA[this.code].height, 4, 0.1, false, true);
        
        // facing = 1 -> left
        this.animations[0][1] = new Animator(this.spritesheet, 12 * BOSS_DATA[this.code].width, 0, BOSS_DATA[this.code].width, BOSS_DATA[this.code].height, 4, 0.1, true, true);

        // walking animations

        // facing = 0 -> right
        this.animations[1][0] = new Animator(this.spritesheet, 4 * BOSS_DATA[this.code].width, 0, BOSS_DATA[this.code].width, BOSS_DATA[this.code].height, 4, 0.1, false, true);

        // facing = 1 -> left
        this.animations[1][1] = new Animator(this.spritesheet, 8 * BOSS_DATA[this.code].width, 0, BOSS_DATA[this.code].width, BOSS_DATA[this.code].height, 4, 0.1, true, true);
    };

    update() {
        let center = this.getCenterPoint();
        let heroCenter = this.hero.getCenterPoint();
        let dist = distance(center, heroCenter);
        let heroPrevious = this.hero.previousCenter;
        if (dist <= this.attackDistance && dist > this.proximityConstant) {
            let vector = { x : heroPrevious.x - center.x, y : heroPrevious.y - center.y };
            let directionUnitVector = { x : vector.x / magnitude(vector), y : vector.y / magnitude(vector) };
            let newVelocity = Math.max(this.minVelocity, this.maxVelocity * dist / this.attackDistance);
            this.velocity.x = directionUnitVector.x * newVelocity;
            this.velocity.y = directionUnitVector.y * newVelocity;
            this.facing = this.velocity.x > 0 ? 0 : 1;
            this.state = 1;
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.state = 0;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.updateBB();

        // projectile lauching
        this.elapsedTimeShoot += this.game.clockTick;
        if (dist <= this.attackDistance && this.elapsedTimeShoot >= this.dexterity) {
            this.elapsedTimeShoot = 0;
            let shotVector = {x: heroCenter.x - this.getCenterPoint().x, y: heroCenter.y - this.getCenterPoint().y};
            let shotUnitVector = {x: shotVector.x / magnitude(shotVector), y: shotVector.y / magnitude(shotVector)};
            this.game.addEntity(new Projectile(this.game, this.getCenterPoint().x, this.getCenterPoint().y, this.range,
                                               {x: shotUnitVector.x * 2, y: shotUnitVector.y * 2}, this.pattern, false, 13, 14, "./sprites/fireball.png"));
            this.elapsedTimePattern += this.game.clockTick;
            console.log(this.elapsedTimePattern);
            if (this.elapsedTimePattern > this.patternSwitch) {
                let oldPattern = this.pattern;
                while (this.pattern === oldPattern) {
                    this.pattern = randomInt(Object.keys(SHOT_PATTERNS).length - 1) + 1;
                }
                this.elapsedTimePattern = 0;
            } 
        }

        this.originalCollisionBB = this.collisionBB.previous;
        var that = this;

        this.game.entities.forEach(function(entity) {
            if (entity.BB && that.collisionBB.collide(entity.BB)) {
                if (entity instanceof Boundary) {
                    resolveCollision(that, entity);
                    that.updateBB();  
                } else if (entity instanceof Projectile && entity.friendly) {
                    entity.removeFromWorld = true;
                    that.hp--;
                    if (that.hp === 0) {
                        that.removeFromWorld = true;
                    }
                }
            }
        });
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, BOSS_DATA[this.code].width * PARAMS.SCALE, BOSS_DATA[this.code].height * PARAMS.SCALE, this.BB);
        this.collisionBB = new BoundingBox(this.x + this.BB.width / 5, this.y + this.BB.height / 2, this.BB.width * 3 / 5,
                                           BOSS_DATA[this.code].height * PARAMS.SCALE * 1 / 2, this.collisionBB);
    };
    
    draw(ctx) {
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.SCALE);

        if (PARAMS.DEBUG) {
            ctx.lineWidth = PARAMS.DEBUG_WIDTH;
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
            ctx.strokeRect(this.collisionBB.x - this.game.camera.x, this.collisionBB.y - this.game.camera.y, this.collisionBB.width, this.collisionBB.height);
        }
    };

    getCenterPoint() {
        //return { x : this.x + BOSS_DATA[this.code].width * PARAMS.SCALE / 2, y : this.y + BOSS_DATA[this.code].height * PARAMS.SCALE / 2 };
        return this.collisionBB.center;
    };
};