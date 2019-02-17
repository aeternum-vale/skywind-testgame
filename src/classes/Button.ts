import * as PIXI from "pixi.js";
import { GameObject } from "./GameObject";

enum ButtonState {
    Normal,
    Hover,
    Pressed,
    Disable
}

export interface IButtonTextures {
    normal: PIXI.Texture;
    hover: PIXI.Texture;
    pressed: PIXI.Texture;
    disable: PIXI.Texture;
}

interface IButtonOptions {
    position?: PIXI.Point;
    width?: number;
    height?: number;
    textures: IButtonTextures;
}

export class Button extends GameObject {
    private _state: ButtonState = ButtonState.Normal;

    constructor(options: IButtonOptions) {
        super();
        const {
            textures,
            position = new PIXI.Point(0, 0),
            width,
            height
        } = options;

        this._displayObject = new PIXI.Sprite(textures.normal);
        this._displayObject.position = position;
        if (width) {
            this._displayObject.width = width;
        }
        if (height) {
            this._displayObject.height = height;
        }
    }

    public update(delta: number) {}
}
