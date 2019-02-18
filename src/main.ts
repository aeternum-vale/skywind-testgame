import * as PIXI from "pixi.js";
import * as cubicBezier from "../node_modules/bezier-easing/src/index";
import Slot from "./classes/Slot";
import { IGameObjectSideAttribute } from "./classes/GameObject";
import { IButtonTextures } from "./classes/Button";

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

    const slot = new Slot({
        symbolsArray,
        reelCount: 5,
        frames: {
            top: 35,
            bottom: 30,
            left: 40,
            right: 40,
        },
        visibleCellCount: 4,
        cellCount: 20,
        width: 800,
        position: new PIXI.Point(10, 10),
        reelsHorizontalDistance: 10,
        reelsVerticalDistance: 10,
        overlay,
        progressThreshold: .1,
        buttonTextures,
        buttonPosition: new PIXI.Point(800, 0),
        reelVelocity: .16,
        reelEasingFunction: cubicBezier(.54, 1.21, 1, 1.001)
    });

    gameScene.addChild(background);
    gameScene.addChild(slot.getDisplayObject());

    app.ticker.add((delta) => slot.update(delta));
}
