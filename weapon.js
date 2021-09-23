class Weapon {

    constructor(game, hero) {
        this.game = game;
        this.hero = hero;
        this.vertAdjust = 0;
        let codeVal = Math.floor(this.hero.code / 2);
        this.scale = codeVal === 1 ? 0.8 * PARAMS.SCALE : PARAMS.SCALE;
        this.data = WEAPON_DATA[codeVal];
        this.x = 0;
        this.y = 0;
        this.elapsedTimeOscillate = 0;
        this.elapsedTimeShoot = 0;
        this.shootTime = 0.075;
        this.oscillateTime = 0.02;
        this.maxAdjust = 14 / 3 * PARAMS.SCALE;
        this.counter = 0;
        this.rotationAngle = 0;
        this.rotationRadius = 60 / 3 * PARAMS.SCALE;
        this.spritesheet = ASSET_MANAGER.getAsset(this.data.sprite);
        this.animations = [];
        this.updateBB();
        this.loadAnimations();
    };

    loadAnimations() {
        for (var i = 0; i < 2; i++) { // 2 states (shooting and not shooting)
            this.animations.push([]);
            for (var j = 0; j < 2; j++) { // 2 directions
                this.animations[i].push([]);
            }
        }

        // non-shooting animations
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, this.data.width, 
                                             this.data.height, 1, 0.15, false, true);
        this.animations[0][1] = new Animator(this.spritesheet, 2 * this.data.width, 0, 
                                             this.data.width, this.data.height, 1, 0.15, false, true);

        //shooting animations
        this.animations[1][0] = new Animator(this.spritesheet, 0, 0, this.data.width, 
                                             this.data.height, 2, this.shootTime, false, true);
        this.animations[1][1] = new Animator(this.spritesheet, 2 * this.data.width, 0, 
                                             this.data.width, this.data.height, 2, this.shootTime, false, true);
    };

    update() {
        // if (this.hero.shooting === 0) {
            //if (changeTime) 
        
        this.elapsedTimeOscillate += this.game.clockTick; // update vertical oscillation data
        if (this.elapsedTimeOscillate >= this.oscillateTime) {
            this.elapsedTimeOscillate = 0;
            this.vertAdjust = this.oscillate(this.counter, 0, this.maxAdjust) * -1;
            this.counter = (this.counter + 1) % (2 * this.maxAdjust);
        }

        if (this.hero.shooting === 1) {
            let mousePoint = this.game.mouse ? this.game.mouse : this.game.click;
            let drawVect = { x: mousePoint.x + this.game.camera.x - this.hero.BB.center.x, 
                             y: mousePoint.y + this.game.camera.y - (this.hero.BB.center.y + this.hero.BB.height / 4) };
            let unitVect = unitVector(drawVect);
            this.x = this.hero.BB.center.x + this.rotationRadius / 2 * unitVect.x - this.data.width * this.scale / 2;
            this.y = this.hero.BB.center.y + this.hero.BB.height / 4 + this.rotationRadius / 2 * unitVect.y - this.data.height * this.scale / 2;
            let drawAngle = Math.atan2(drawVect.y, drawVect.x);
            if (drawAngle < 0) drawAngle += 2 * Math.PI;
            this.rotationAngle = drawAngle;

            // check if it's time to shoot again
            this.elapsedTimeShoot += this.game.clockTick;
            if (this.elapsedTimeShoot >= 0) {
                this.elapsedTimeShoot = -this.shootTime * 2;
                this.game.addEntity(new Projectile(this.game, this.hero.facing === 0 ? 
                                                   this.x + this.BB.width * 3 / 4 - this.data.projectile.width * this.data.projectile.scale / 2 : 
                                                   this.x + this.BB.width / 4 - this.data.projectile.width * this.data.projectile.scale / 2, this.y, this.data.range,
                                                   {x: unitVect.x * this.data.projectile.velocity, y: unitVect.y * this.data.projectile.velocity}, 
                                                   this.data.projectile.pattern, true, this.data.projectile.width, this.data.projectile.height, this.data.projectile.scale,
                                                   this.data.projectile.sprite));
            }
        } else {
            let centerDrawPoint = { x: this.hero.BB.center.x + Math.cos(this.rotationAngle) * this.rotationRadius, 
                                    y: this.hero.BB.center.y + this.hero.BB.height / 4 + Math.sin(this.rotationAngle) * this.rotationRadius };
            this.rotationAngle = this.hero.facing === 0 ? (this.rotationAngle - Math.PI / 180 * 2) % (2 * Math.PI) : 
                                                          (this.rotationAngle + Math.PI / 180 * 2) % (2 * Math.PI);
            this.x = centerDrawPoint.x - this.data.width * this.scale / 2;
            this.y = centerDrawPoint.y - this.data.height * this.scale / 2 + this.maxAdjust / 2 + this.vertAdjust;  
            this.elapsedTimeShoot = 0;
        }
        
        this.updateBB();
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.data.width * this.scale, this.data.height * this.scale, this.BB);
    };

    draw(ctx) {
        this.animations[this.hero.shooting][this.hero.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = PARAMS.DEBUG_COLOR;
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
    };

    oscillate(input, min, max) {
        let range = max - min;
        return min + Math.abs(((input + range) % (range * 2)) - range);
    };

};