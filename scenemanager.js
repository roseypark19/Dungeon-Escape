class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.hero = new Hero(game, 0, 0, 2);
        this.loadLevel(levelOne, 239, 330);
    };

    loadLevel(level, heroX, heroY) {

        // for (var row = 0; row < level.tiles.length; row++) {
        //     for (var col = 0; col < level.tiles[row].length; col++) {
        //         let code = level.tiles[row][col];
        //         if (code == 1) { // wall
        //             if (level.collisions[row][col] === 3) { // we have a corner (4 possible types)
        //                 let neighborV = level.tiles[row - 1][col] === 1 ? { x : 0, y : -1 } : { x : 0, y : 1 };
        //                 let neighborH = level.tiles[row][col + 1] === 1 ? { x : 1, y : 0 } : { x : -1, y : 0 };
        //                 this.game.addEntity(new Wall(this.game, col * PARAMS.BLOCKWIDTH, row * PARAMS.BLOCKWIDTH, 
        //                                              PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, level.collisions[row][col], neighborV, neighborH));
        //             } else {
        //                 this.game.addEntity(new Wall(this.game, col * PARAMS.BLOCKWIDTH, row * PARAMS.BLOCKWIDTH, 
        //                                              PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, level.collisions[row][col], null, null));
        //             }
                    
        //         } else if (code == 2) { // floor
        //             this.game.addEntity(new Ground(this.game, col * PARAMS.BLOCKWIDTH, row * PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH));
        //         }
        //         }  
        // }
        // this.game.addEntity(new MapLayer(this.game, 0, 0, PARAMS.BLOCKWIDTH * 100, PARAMS.BLOCKWIDTH * 100, ASSET_MANAGER.getAsset(levelOneData.layer1)));
        // this.hero.x = heroX;
        // this.hero.y = heroY;
        // this.game.addEntity(this.hero);
        // this.game.addEntity(new Boss(this.game, 900, 1000, 2));
        // this.game.addEntity(new MapLayer(this.game, 0, 0, PARAMS.BLOCKWIDTH * 100, PARAMS.BLOCKWIDTH * 100, ASSET_MANAGER.getAsset(levelOneData.layer2)));

        for (var i = 0; i < 3; i++) {
            for (var row = 0; row < level.tiles.length; row++) {
                for (var col = 0; col < level.tiles[row].length; col++) {
                    let code = level.tiles[row][col][i];
                    if (i === 2) {
                        // console.log(code);
                        // console.log(row); console.log(col);
                    }
                    if (code !== 0) {
                        if (i < 2) { // a map tile
                            this.game.addEntity(new MapTile(this.game, col * PARAMS.BLOCKWIDTH * PARAMS.SCALE, row * PARAMS.BLOCKWIDTH * PARAMS.SCALE, 
                                                            PARAMS.BLOCKWIDTH * PARAMS.SCALE, PARAMS.BLOCKWIDTH * PARAMS.SCALE, code));
                        } else { // a boundary
                            let top = row - 1 >= 0 ? level.tiles[row - 1][col][i] !== 1 : true;
                            let bottom = row + 1 <= level.tiles.length - 1 ? level.tiles[row + 1][col][i] !== 1 : true;
                            let left = col - 1 >= 0 ? level.tiles[row][col - 1][i] !== 1 : true;
                            let right = col + 1 <= level.tiles[0].length - 1 ? level.tiles[row][col + 1][i] !== 1 : true;
                            if (code === 1) {
                                this.game.addEntity(new Boundary(this.game, col * PARAMS.BLOCKWIDTH * PARAMS.SCALE, row * PARAMS.BLOCKWIDTH * PARAMS.SCALE, 
                                                                 PARAMS.BLOCKWIDTH * PARAMS.SCALE, PARAMS.BLOCKWIDTH * PARAMS.SCALE,
                                                                 top, bottom, left, right, 
                                                                 level.tiles[row][col][1] === 0 && (level.tiles[row][col][0] === 0 || level.tiles[row][col][0] === 17)));
                            }
                        }
                    }
                }
            }
            if (i === 0) {
                this.hero.x = heroX;
                this.hero.y = heroY;
                this.game.addEntity(this.hero);
                this.game.addEntity(new Boss(this.game, 900, 1000, 2, this.hero));
                this.game.addEntity(new Boss(this.game, 1400, 1250, 1, this.hero));
            }
        }
        this.game.addEntity(new Weapon(this.game, this.hero));

        // if (level.music) {
        //     ASSET_MANAGER.autoRepeat(level.music);
        //     ASSET_MANAGER.pauseBackgroundMusic();
        //     ASSET_MANAGER.muteAudio(true);
        //     ASSET_MANAGER.playAsset(level.music);
        // }
        
        // this.game.addEntity(new Boss(this.game, 750, 1000, 0));
        // this.game.addEntity(new Boss(this.game, 900, 1000, 1));
        // this.game.addEntity(new Boss(this.game, 1050, 1000, 2));
    };

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
        let midpoint = { x : PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2, y : PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2 };
        this.x = this.hero.x - midpoint.x;
        this.y = this.hero.y - midpoint.y;
    };

    draw(ctx) {

    };


}