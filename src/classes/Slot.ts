import { Howl } from "howler";
import * as PIXI from "pixi.js";
import { Button, IButtonTextures } from "./Button";
import { ContainerGameObject, IGameObjectSideAttribute } from "./GameObject";
import Reel from "./Reel";

interface ISlotOptions {
    reelSpinSound?: Howl;
    landingSound?: Howl;
    width: number;
    visibleCellCount: number;
    position?: PIXI.Point;
    overlay: PIXI.Sprite;
    symbolsArray: PIXI.Texture[];
    reelCount: number;
    cellCount: number;
    reelsVerticalDistance?: number;
    reelsHorizontalDistance?: number;
    progressThreshold?: number;
    frames?: IGameObjectSideAttribute;
    buttonTextures: IButtonTextures;
    buttonPosition?: PIXI.Point;
    buttonWidth?: number;
    buttonHeight?: number;
    reelVelocity?: number;
    reelEasingFunction?: (timeFraction: number) => number;
}

enum SlotState {
    Ready,
    Progress
}

export default class Slot extends ContainerGameObject {
    private _reels: Reel[] = [];
    private _button: Button;
    private _state: SlotState = SlotState.Ready;
    private _progressThreshold: number;
    private _landingSound: Howl;
    private _reelSpinSound: Howl;

    constructor(options: ISlotOptions) {
        super();
        const {
            reelCount,
            cellCount,
            visibleCellCount,
            width,
            frames = {
                bottom: 0,
                left: 0,
                right: 0,
                top: 0
            },
            symbolsArray,
            reelsVerticalDistance = 0,
            reelsHorizontalDistance = 0,
            position = new PIXI.Point(0, 0),
            overlay,
            progressThreshold = .5,
            buttonTextures,
            buttonPosition,
            buttonWidth,
            buttonHeight,
            reelVelocity = .03,
            reelEasingFunction,
            reelSpinSound,
            landingSound
        } = options;

        this._landingSound = landingSound;
        this._reelSpinSound = reelSpinSound;

        this._progressThreshold = Math.max(0, Math.min(progressThreshold, 1));

        const screenWidth: number = width - (frames.left + frames.right);
        const cellWidth: number = screenWidth / reelCount - reelsHorizontalDistance;
        const cellHeight: number = cellWidth * symbolsArray[0].height / symbolsArray[0].width;
        const screenHeight: number = visibleCellCount * (cellHeight + reelsVerticalDistance);

        this._container.position = position;
        overlay.width = width;
        overlay.height = screenHeight + (frames.top + frames.bottom);
        this._container.addChild(overlay);

        const screen: PIXI.Container = new PIXI.Container();
        screen.position.set(frames.left, frames.top);
        this._container.addChild(screen);

        const maskRect: PIXI.Graphics = new PIXI.Graphics();
        maskRect.beginFill(0xFF3300);
        maskRect.drawRect(0, 0, screenWidth, screenHeight);
        maskRect.endFill();
        screen.addChild(maskRect);
        screen.mask = maskRect;

        for (let i = 0; i < reelCount; i++) {
            this._reels.push(new Reel({
                cellCount,
                cellHeight,
                cellWidth,
                easingFunction: reelEasingFunction,
                position: new PIXI.Point(reelsHorizontalDistance / 2 + i * (cellWidth + reelsHorizontalDistance), 0),
                reelsVerticalDistance,
                symbolsArray,
                velocity: reelVelocity,
                visibleCellCount
            }));
            screen.addChild(this._reels[i].getDisplayObject());
        }

        this._button = new Button({
            height: buttonHeight,
            onClickCallback: () => {
                this.start();
                this._reelSpinSound.stop();
                this._reelSpinSound.play();
            },
            position: buttonPosition,
            textures: buttonTextures,
            width: buttonWidth
        });

        this._container.addChild(this._button.getDisplayObject());
    }

    public update(delta: number) {
        if (this._state === SlotState.Progress) {
            this._reels.forEach((reel, i, arr) => {
                if (reel.isReady()) {
                    if (i === 0 || arr[i - 1].progress >= this._progressThreshold) {
                        reel.start();
                    }
                }

                if (i === arr.length - 1 && reel.isFinished()) {
                    this._state = SlotState.Ready;
                    this._refreshReels();
                    this._button.activate();

                    this._reelSpinSound.stop();
                    this._landingSound.play();
                }
            });
        }

        this._reels.forEach((reel) => {
            reel.update(delta);
        });
    }

    public start() {
        this._state = SlotState.Progress;
    }

    private _refreshReels(): void {
        this._reels.forEach((reel) => {
            reel.refresh();
        });
    }
}
