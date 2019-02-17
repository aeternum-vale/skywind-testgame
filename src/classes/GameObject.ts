import * as PIXI from "pixi.js";

export interface IGameObjectSideAttribute {
    Top: number;
    Bottom: number;
    Left: number;
    Right: number;
}

export abstract class GameObject {
    protected _displayObject: PIXI.Container = new PIXI.Container();

    get displayObject(): PIXI.Container {
        return this._displayObject;
    }

    public abstract update(delta: number): void;
}
