import * as PIXI from "pixi.js";
import { GameObject, IGameObjectSideAttribute } from "./GameObject";
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
}

enum SlotState {
    Ready,
    Progress,
    Finished
}

export default class Slot extends GameObject {
    private _reelsArray: Reel[] = [];
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
            progressThreshold = .5
        } = options;

        this._progressThreshold = Math.max(0, Math.min(progressThreshold, 1));

        const screenWidth: number = width - 2 * frameSize;
        const cellWidth: number = screenWidth / reelCount - reelsHorizontalDistance;
        const cellHeight: number = cellWidth * symbolsArray[0].height / symbolsArray[0].width;
        const screenHeight: number = visibleCellCount * (cellHeight + reelsVerticalDistance);

        this._displayObject.position = position;
        overlay.width = width;
        overlay.height = screenHeight + frameSize * 2;
        this._displayObject.addChild(overlay);

        const screen: PIXI.Container = new PIXI.Container();
        screen.position.set(frameSize, frameSize);
        this._displayObject.addChild(screen);

        const maskRect: PIXI.Graphics = new PIXI.Graphics();
        maskRect.beginFill(0xFF3300);
        maskRect.drawRect(0, 0, screenWidth, screenHeight);
        maskRect.endFill();
        screen.addChild(maskRect);
        screen.mask = maskRect;

        for (let i = 0; i < reelCount; i++) {
            this._reelsArray.push(new Reel({
                cellCount,
                symbolsArray,
                cellWidth,
                cellHeight,
                position: new PIXI.Point(
                        reelsHorizontalDistance / 2 + i * (cellWidth + reelsHorizontalDistance), 0
                    ),
                visibleCellCount: 4,
                velocity: .001,
                reelsVerticalDistance
            }));
            screen.addChild(this._reelsArray[i].displayObject);
        }

        this.start();
    }

    public update(delta: number) {
        if (this._state === SlotState.Progress) {
            this._reelsArray.forEach((reel, i, arr) => {
                if (reel.isReady()) {
                    if (i === 0 || arr[i - 1].progress >= this._progressThreshold) {
                        reel.start();
                    }
                }
            });
        }

        this._reelsArray.forEach((reel) => {
            reel.update(delta);
        });
    }

    public start() {
        this._state = SlotState.Progress;
    }
}
