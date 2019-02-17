import * as PIXI from "pixi.js";

export interface IGameObjectSideAttribute {
    Top: number;
    Bottom: number;
    Left: number;
    Right: number;
}

export abstract class GameObject {
    protected _container: PIXI.Container = new PIXI.Container();

    get container(): PIXI.Container {
        return this._container;
    }

    public abstract update(delta: number): void;
}
