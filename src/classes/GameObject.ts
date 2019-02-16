import * as PIXI from "pixi.js";

export default abstract class GameObject {
    protected _container: PIXI.Container = new PIXI.Container();

    get container(): PIXI.Container {
        return this._container;
    }

    public abstract update(delta: number): void;
}
