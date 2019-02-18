import * as cubicBezier from "bezier-easing";
import { Howl } from "howler";
import * as PIXI from "pixi.js";
import { IButtonTextures } from "./classes/Button";
import Slot from "./classes/Slot";

const APP_WIDTH: number = 800;
const APP_HEIGHT: number = 600;
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

    const overlay = new PIXI.Sprite(
        PIXI.loader.resources["assets/images/slotOverlay.png"].texture
    );

    const symbolsArray: PIXI.Texture[] = [];

    for (let i = 1; i <= SYMBOL_COUNT; i++) {
        symbolsArray.push(PIXI.loader.resources[`assets/images/symbols/${(i < 10 ? "0" : "") + i}.png`].texture);
    }

    const buttonTextures: IButtonTextures = {
        normal: PIXI.loader.resources["assets/images/btn_spin_normal.png"].texture,
        hover: PIXI.loader.resources["assets/images/btn_spin_hover.png"].texture,
        pressed: PIXI.loader.resources["assets/images/btn_spin_pressed.png"].texture,
        disable: PIXI.loader.resources["assets/images/btn_spin_disable.png"].texture
    };

    const reelSpinSound = new Howl({
        src: ["assets/sounds/Reel_Spin.mp3"]
    });

    const landingSound = new Howl({
        src: ["assets/sounds/Landing_1.mp3"]
    });

    const slot = new Slot({
        symbolsArray,
        reelCount: 5,
        frames: {
            top: 30,
            bottom: 15,
            left: 40,
            right: 40,
        },
        visibleCellCount: 4,
        cellCount: 20,
        width: 650,
        position: new PIXI.Point(30, 0),
        reelsHorizontalDistance: 10,
        reelsVerticalDistance: 10,
        overlay,
        progressThreshold: .1,
        buttonTextures,
        reelVelocity: .16,
        reelEasingFunction: cubicBezier(.54, 1.21, 1, 1.001),
        buttonPosition: new PIXI.Point(610, 430),
        buttonWidth: 150,
        buttonHeight: 150,
        reelSpinSound,
        landingSound
    });

    gameScene.addChild(background);
    gameScene.addChild(slot.getDisplayObject());

    app.ticker.add((delta) => slot.update(delta));
}
