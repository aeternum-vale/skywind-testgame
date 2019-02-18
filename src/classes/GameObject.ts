import * as PIXI from "pixi.js";

export interface IGameObjectSideAttribute {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface IGameObject {
    getDisplayObject(): PIXI.DisplayObject;
    update(delta: number): void;
}

export abstract class ContainerGameObject implements IGameObject {
    protected _container: PIXI.Container = new PIXI.Container();

    public getDisplayObject(): PIXI.Container {
        return this._container;
    }

    public update(delta: number): void {}
}
