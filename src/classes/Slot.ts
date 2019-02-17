import * as PIXI from "pixi.js";
import GameObject from "./GameObject";
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
}

export default class Slot extends GameObject {
    private _reelsArray: Reel[] = [];
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

        this._container.position = position;
        overlay.width = width;
        overlay.height = screenHeight + frameSize * 2;
        this._container.addChild(overlay);

        const screen: PIXI.Container = new PIXI.Container();
        screen.position.set(frameSize, frameSize);
        this._container.addChild(screen);

        const screenGlobalPosition = screen.getGlobalPosition();
        const maskRect: PIXI.Graphics = new PIXI.Graphics();
        maskRect.beginFill(0xFF3300);
        maskRect.drawRect(screenGlobalPosition.x, screenGlobalPosition.y, screenWidth, screenHeight);
        maskRect.endFill();
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
            screen.addChild(this._reelsArray[i].container);
        }
    }
}
