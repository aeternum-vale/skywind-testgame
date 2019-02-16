import * as PIXI from "pixi.js";

const APP_WIDTH: number = 1000;
const APP_HEIGHT: number = 800;
const SYMBOL_COUNT: number = 13;

const app: PIXI.Application = new PIXI.Application({
        antialias: true,
        height: APP_HEIGHT,
        resolution: 1,
        transparent: false,
        width: APP_WIDTH,
    },
);

document.body.appendChild(app.view);

PIXI.loader
    .add("assets/images/symbols/01.png")
    .add("assets/images/symbols/02.png")
    .add("assets/images/symbols/03.png")
    .add("assets/images/symbols/04.png")
    .add("assets/images/symbols/05.png")
    .add("assets/images/symbols/06.png")
    .add("assets/images/symbols/07.png")
    .add("assets/images/symbols/08.png")
    .add("assets/images/symbols/09.png")
    .add("assets/images/symbols/10.png")
    .add("assets/images/symbols/11.png")
    .add("assets/images/symbols/12.png")
    .add("assets/images/symbols/13.png")
    .add("assets/images/btn_spin_disable.png")
    .add("assets/images/btn_spin_hover.png")
    .add("assets/images/btn_spin_normal.png")
    .add("assets/images/btn_spin_pressed.png")
    .add("assets/images/slotOverlay.png")
    .add("assets/images/winningFrameBackground.jpg")
    .load(setup);

function setup(): void {
    const gameScene: PIXI.Container = new PIXI.Container();
    app.stage.addChild(gameScene);

    const background = new PIXI.extras.TilingSprite(
        PIXI.loader.resources["assets/images/winningFrameBackground.jpg"].texture,
        APP_WIDTH,
        APP_HEIGHT
    );

    gameScene.addChild(background);
}
