var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/bigdemon.png");
ASSET_MANAGER.queueDownload("./sprites/bigogre.png");
ASSET_MANAGER.queueDownload("./sprites/bigzombie.png");
ASSET_MANAGER.queueDownload("./sprites/chort.png");
ASSET_MANAGER.queueDownload("./sprites/elf.png");
ASSET_MANAGER.queueDownload("./sprites/elf_female.png");
ASSET_MANAGER.queueDownload("./sprites/goblin.png");
ASSET_MANAGER.queueDownload("./sprites/imp.png");
ASSET_MANAGER.queueDownload("./sprites/knight.png");
ASSET_MANAGER.queueDownload("./sprites/knight_female.png");
ASSET_MANAGER.queueDownload("./sprites/lizard.png");
ASSET_MANAGER.queueDownload("./sprites/lizard_female.png");
ASSET_MANAGER.queueDownload("./sprites/maskedorc.png");
ASSET_MANAGER.queueDownload("./sprites/muddy.png");
ASSET_MANAGER.queueDownload("./sprites/necromancer.png");
ASSET_MANAGER.queueDownload("./sprites/orcshaman.png");
ASSET_MANAGER.queueDownload("./sprites/orcwarrior.png");
ASSET_MANAGER.queueDownload("./sprites/skeleton.png");
ASSET_MANAGER.queueDownload("./sprites/swampy.png");
ASSET_MANAGER.queueDownload("./sprites/tinyzombie.png");
ASSET_MANAGER.queueDownload("./sprites/wizard.png");
ASSET_MANAGER.queueDownload("./sprites/wizard_female.png");
ASSET_MANAGER.queueDownload("./sprites/wogol.png");
ASSET_MANAGER.queueDownload("./sprites/zombie.png");
ASSET_MANAGER.queueDownload("./sprites/staff.png");
ASSET_MANAGER.queueDownload("./sprites/baton.png");
ASSET_MANAGER.queueDownload("./sprites/sword_gold.png");
ASSET_MANAGER.queueDownload("./sprites/cleaver.png");
ASSET_MANAGER.queueDownload("./sprites/tiles.png");
ASSET_MANAGER.queueDownload("./sprites/lvl1floor_walls.png");
ASSET_MANAGER.queueDownload("./sprites/lvl1toppers.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	gameEngine.init(ctx);

	new SceneManager(gameEngine);

	gameEngine.start();
});
