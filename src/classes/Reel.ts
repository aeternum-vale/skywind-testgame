import * as PIXI from "pixi.js";
import randomInt from "../lib/randomInt";
import { ContainerGameObject } from "./GameObject";

interface IReelOptions {
    cellCount: number;
    visibleCellCount: number;
    cellWidth: number;
    cellHeight: number;
    symbolsArray: PIXI.Texture[];
    position: PIXI.Point;
    velocity?: number;
    reelsVerticalDistance?: number;
    easingFunction?: (timeFraction: number) => number;
}

enum ReelState {
    Ready,
    Progress,
    Finished
}

export default class Reel extends ContainerGameObject {

    private _cells: PIXI.Sprite[] = [];
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
    private _easingFunction: (timeFraction: number) => number;

    constructor(options: IReelOptions) {
        super();
        const {
            cellWidth,
            cellHeight,
            cellCount,
            visibleCellCount,
            symbolsArray,
            reelsVerticalDistance,
            easingFunction = (timeFraction: number) => timeFraction
        } = options;

        for (let i = 0; i < cellCount; i++) {
            const anotherCell = new PIXI.Sprite(symbolsArray[randomInt(1, symbolsArray.length - 1)]);

            anotherCell.width = cellWidth;
            anotherCell.height = cellHeight;

            anotherCell.y = reelsVerticalDistance / 2 + i * (cellHeight + reelsVerticalDistance);

            this._cells.push(anotherCell);
            this._container.addChild(anotherCell);
        }

        this._startPosition = options.position;
        this._container.position = this._startPosition;
        this._necessaryDistance = (cellHeight + reelsVerticalDistance) * (cellCount - visibleCellCount);
        this._container.pivot.y = this._necessaryDistance;

        this._visibleCellCount = visibleCellCount;
        this._cellCount = cellCount;
        this._symbolsArray = symbolsArray;

        this._easingFunction = easingFunction;
    } 

    public update(delta: number) {
       if (this._state === ReelState.Progress) {
            this._progress += this._progressVelocity;

            if (this._progress < 1) {
                this._container.position.y = this._startPosition.y +
                    this._necessaryDistance * this._easingFunction(this._progress);
            } else {
                this._container.position.y = this._startPosition.y + this._necessaryDistance;

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

    public isFinished(): boolean {
        return (this._state === ReelState.Finished);
    }

    public refresh(): void {
        const diff: number = this._cellCount - this._visibleCellCount;
        for (let i = this._cellCount - 1; i >= this._cellCount - this._visibleCellCount; i--) {
            this._cells[i].texture = this._cells[i - diff].texture;
        }

        for (let i = 0; i < diff; i++) {
            this._cells[i].texture = this._symbolsArray[randomInt(1, this._symbolsArray.length - 1)]
        }

        this._container.position = this._startPosition;
        this._progress = 0;
        this._state = ReelState.Ready;
    }
}
