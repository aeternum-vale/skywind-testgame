import * as PIXI from "pixi.js";
import randomInt from "../lib/randomInt";
import GameObject from "./GameObject";

interface IReelOptions {
    cellCount: number;
    visibleCellCount: number;
    cellWidth: number;
    cellHeight: number;
    symbolsArray: PIXI.Texture[];
    position: PIXI.Point;
    velocity?: number;
    reelsVerticalDistance?: number;
}

export default class Reel extends GameObject {

    private _visibleCellCount: number;
    private _cellCount: number;
    private _symbolsArray: PIXI.Texture[];
    private _necessaryDistance: number;
    private _startPosition: PIXI.Point;

    constructor(options: IReelOptions) {
        super();
        const {
            cellWidth,
            cellHeight,
            cellCount,
            visibleCellCount,
            symbolsArray,
            reelsVerticalDistance
        } = options;

        for (let i = 0; i < cellCount; i++) {
            const anotherCell = new PIXI.Sprite(symbolsArray[randomInt(1, symbolsArray.length - 1)]);

            anotherCell.width = cellWidth;
            anotherCell.height = cellHeight;

            anotherCell.y = reelsVerticalDistance / 2 + i * (cellHeight + reelsVerticalDistance);
            this._container.addChild(anotherCell);
        }

        this._startPosition = options.position;
        this._container.position = this._startPosition;
        this._necessaryDistance = (cellHeight + reelsVerticalDistance) * (cellCount - visibleCellCount);
        this._container.pivot.y = this._necessaryDistance;

        this._visibleCellCount = visibleCellCount;
        this._cellCount = cellCount;
        this._symbolsArray = symbolsArray;
    }

}
