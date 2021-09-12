class Weapon {

    constructor(game, hero) {
        this.game = game;
        this.hero = hero;
        this.vertAdjust = 0;
        let codeVal = Math.floor(this.hero.code / 2);
        this.scale = codeVal === 1 ? 0.8 * PARAMS.SCALE : PARAMS.SCALE;
        this.data = WEAPON_DATA[codeVal];
        // this.pixelsAboveGround = codeVal === 1 || codeVal === 3 ? 0 : 7 / 3 * PARAMS.SCALE;
        // this.x = this.hero.facing === 0 ? HERO_DIMENSIONS.width * PARAMS.SCALE + this.hero.x -  PARAMS.SCALE * (this.data.horizPadding - this.data.spacing) : 
        //                                   this.hero.x - PARAMS.SCALE * (this.data.width - this.data.horizPadding + this.data.spacing);
        // this.y = this.hero.y + PARAMS.SCALE * (HERO_DIMENSIONS.height - this.data.height + this.data.vertPadding) + this.vertAdjust - this.pixelsAboveGround;
        // this.x = this.hero.facing === 0 ? HERO_DIMENSIONS.width * PARAMS.SCALE + this.hero.x : this.hero.x - PARAMS.SCALE * this.data.width;
        // this.y = this.hero.y + PARAMS.SCALE * (HERO_DIMENSIONS.height - this.data.height) + this.vertAdjust - this.pixelsAboveGround;
        this.x = 0;
        this.y = 0;
        this.elapsedTime = 0;
        this.oscillateTime = 0.02;
        this.maxAdjust = 12 / 3 * PARAMS.SCALE;
        this.counter = 0;
        this.rotationAngle = 0;
        this.rotationRadius = 55 / 3 * PARAMS.SCALE;
        this.degreesTravelled = 0;
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

        // this.animations[0][0] = new Animator(this.spritesheet, 0, 0, this.data.width, 
        //                                      this.data.height, 1, 0.13, false, true);
        // this.animations[0][1] = new Animator(this.spritesheet, this.data.width, 0, 
        //                                      this.data.width, this.data.height, 1, 0.13, false, true);


        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, this.data.width, 
                                             this.data.height, 1, 0.15, false, true);
        this.animations[0][1] = new Animator(this.spritesheet, 2 * this.data.width, 0, 
                                             this.data.width, this.data.height, 1, 0.15, false, true);

        //shooting animations
        this.animations[1][0] = new Animator(this.spritesheet, 0, 0, this.data.width, 
                                             this.data.height, 2, 0.15, false, true);
        this.animations[1][1] = new Animator(this.spritesheet, 2 * this.data.width, 0, 
                                             this.data.width, this.data.height, 2, 0.15, false, true);
    };

    update() {
        // if (this.hero.shooting === 0) {
            //if (changeTime) 
        
        this.elapsedTime += this.game.clockTick; // update vertical oscillation data
        if (this.elapsedTime >= this.oscillateTime) {
            this.elapsedTime = 0;
            this.vertAdjust = this.oscillate(this.counter, 0, this.maxAdjust) * -1;
            this.counter = (this.counter + 1) % (2 * this.maxAdjust);
        }

        if (this.hero.shooting === 1) {
            let mousePoint = this.game.mouse ? this.game.mouse : this.game.click;
            let drawVect = { x: mousePoint.x + this.game.camera.x - this.hero.BB.center.x, 
                             y: mousePoint.y + this.game.camera.y - (this.hero.BB.center.y + this.hero.BB.height / 4) };
            let magnitude = Math.sqrt(Math.pow(drawVect.x, 2) + Math.pow(drawVect.y, 2));
            let unitVect = { x: drawVect.x / magnitude, y: drawVect.y / magnitude };
            this.x = this.hero.BB.center.x + this.rotationRadius * unitVect.x - this.data.width * this.scale / 2;
            this.y = this.hero.BB.center.y + this.hero.BB.height / 4 + this.rotationRadius * unitVect.y - this.data.height * this.scale / 2;
            let drawAngle = Math.atan2(drawVect.y, drawVect.x);
            if (drawAngle < 0) drawAngle += 2 * Math.PI;
            this.rotationAngle = drawAngle;
        } else {
            let centerDrawPoint = { x: this.hero.BB.center.x + Math.cos(this.rotationAngle) * this.rotationRadius, 
                                    y: this.hero.BB.center.y + this.hero.BB.height / 4 + Math.sin(this.rotationAngle) * this.rotationRadius };
            this.rotationAngle = (this.rotationAngle - Math.PI / 180 * 2) % (2 * Math.PI);
            // this.degreesTravelled++;
            this.x = centerDrawPoint.x - this.data.width * this.scale / 2;
            this.y = centerDrawPoint.y - this.data.height * this.scale / 2 + this.maxAdjust / 2 + this.vertAdjust;  
        }
        
        // console.log(this.rotationAngle)
        // if (this.degreesTravelled === 270) {
        //     this.clockwise = !this.clockwise;
        //     this.degreesTravelled = 0;
        // }
        // console.log(this.rotationAngle * 180 / Math.PI)
        // } else {
        //     this.vertAdjust = 0;
        // }
        // console.log(this.vertAdjust);
        // this.x = this.hero.facing === 0 ? HERO_DIMENSIONS.width * PARAMS.SCALE + this.hero.x -  PARAMS.SCALE * (this.data.horizPadding - this.data.spacing) : 
        //                                   this.hero.x - PARAMS.SCALE * (this.data.width - this.data.horizPadding + this.data.spacing);
        // this.y = this.hero.y + PARAMS.SCALE * (HERO_DIMENSIONS.height - this.data.height + this.data.vertPadding) + this.vertAdjust - this.pixelsAboveGround;
        // this.x = this.hero.facing === 0 ? HERO_DIMENSIONS.width * PARAMS.SCALE + this.hero.x : this.hero.x - PARAMS.SCALE * this.data.width;
        // this.y = this.hero.y + PARAMS.SCALE * (HERO_DIMENSIONS.height - this.data.height) + this.vertAdjust;// - this.pixelsAboveGround;
        
        this.updateBB();
    };

    updateBB() {
        // this.BB = new BoundingBox(this.x + this.data.horizPadding * PARAMS.SCALE, this.y + this.data.vertPadding * PARAMS.SCALE, 
        //                           this.data.width * PARAMS.SCALE - 2 * this.data.horizPadding * PARAMS.SCALE,
        //                           this.data.height * PARAMS.SCALE - 2 * this.data.vertPadding * PARAMS.SCALE, this.BB);
        this.BB = new BoundingBox(this.x, this.y, this.data.width * this.scale, this.data.height * this.scale, this.BB);
    };

    draw(ctx) {
        this.animations[this.hero.shooting][this.hero.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);
        // this.animations[0][this.hero.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);

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