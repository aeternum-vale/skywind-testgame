import * as PIXI from "pixi.js";
import { Button, IButtonTextures } from "./Button";
import { ContainerGameObject, IGameObjectSideAttribute } from "./GameObject";
import Reel from "./Reel";

interface ISlotOptions {
    width: number;
    frameSize?: number;
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

    constructor(options: ISlotOptions) {
        super();
        const {
            reelCount,
            cellCount,
            visibleCellCount,
            width,
            frameSize = 0,
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
            reelEasingFunction
        } = options;

        this._progressThreshold = Math.max(0, Math.min(progressThreshold, 1));

        const screenWidth: number = width - 2 * frameSize;
        const cellWidth: number = screenWidth / reelCount - reelsHorizontalDistance;
        const cellHeight: number = cellWidth * symbolsArray[0].height / symbolsArray[0].width;
        const screenHeight: number = visibleCellCount * (cellHeight + reelsVerticalDistance);

        this._container.position = position;
        overlay.width = width;
        overlay.height = screenHeight + frameSize * 2;
        this._container.addChild(overlay);

        const screen: PIXI.Container = new PIXI.Container();
        screen.position.set(frameSize, frameSize);
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
                symbolsArray,
                cellWidth,
                cellHeight,
                position: new PIXI.Point(
                        reelsHorizontalDistance / 2 + i * (cellWidth + reelsHorizontalDistance), 0
                    ),
                visibleCellCount,
                velocity: reelVelocity,
                reelsVerticalDistance,
                easingFunction: reelEasingFunction
            }));
            screen.addChild(this._reels[i].getDisplayObject());
        }

        this._button = new Button({
            textures: buttonTextures,
            position: buttonPosition,
            width: buttonWidth,
            height: buttonHeight,
            onClickCallback: () => this.start()
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
