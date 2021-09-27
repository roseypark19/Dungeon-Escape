class HeroFactory {

    static width = 16;
    static height = 28;
    static sprites = ["./sprites/knight.png", "./sprites/knight_female.png", "./sprites/wizard.png", "./sprites/wizard_female.png", 
                      "./sprites/elf.png", "./sprites/elf_female.png", "./sprites/lizard.png", "./sprites/lizard_female.png"];

    static createHero(game, x, y, code) {
        return new Hero(game, x, y, HeroFactory.sprites[code], code);
    }
}