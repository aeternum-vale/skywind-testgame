import * as PIXI from "pixi.js";
import randomInt from "../lib/randomInt";
import { GameObject } from "./GameObject";

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

enum ReelState {
    Ready,
    Progress,
    Finished
}

export default class Reel extends GameObject {

    private _state: ReelState = ReelState.Ready;
    private _progress: number = 0;
    get progress(): number {
        return this._progress;
    }

    private _progressVelocity: number = .01;
    private _visibleCellCount: number;
    private _cellWidth: number;
    private _cellHeight: number;
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
            this._displayObject.addChild(anotherCell);
        }

        this._startPosition = options.position;
        this._displayObject.position = this._startPosition;
        this._necessaryDistance = (cellHeight + reelsVerticalDistance) * (cellCount - visibleCellCount);
        this._displayObject.pivot.y = this._necessaryDistance;

        this._visibleCellCount = visibleCellCount;
        this._cellCount = cellCount;
        this._symbolsArray = symbolsArray;
    }

    public update(delta: number) {
       if (this._state === ReelState.Progress) {
            this._progress += this._progressVelocity;
            this._displayObject.position.y = this._startPosition.y + this._necessaryDistance * this._progress;
            if (this._progress >= 1) {
                this._state = ReelState.Finished;
            }
       }
    }

    public start() {
        this._state = ReelState.Progress;
    }

    public isReady(): boolean {
        return (this._state === ReelState.Ready);
    }
}
