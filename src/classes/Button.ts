import * as PIXI from "pixi.js";
import { IGameObject } from "./GameObject";

enum ButtonState {
    Normal,
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
    onClickCallback?: () => void;
}

export class Button implements IGameObject {
    private _onClickCallback: () => void;
    private _buttonSprite: PIXI.Sprite;
    private _state: ButtonState = ButtonState.Normal;
    private _textures: IButtonTextures;

    constructor(options: IButtonOptions) {
        const {
            textures,
            position = new PIXI.Point(0, 0),
            width,
            height,
            onClickCallback
        } = options;

        this._onClickCallback = onClickCallback;
        this._textures = textures;
        this._buttonSprite = new PIXI.Sprite(textures.normal);
        this._buttonSprite.position = position;
        if (width) {
            this._buttonSprite.width = width;
        }
        if (height) {
            this._buttonSprite.height = height;
        }

        this._buttonSprite.interactive = true;
        this._buttonSprite.mouseover  = this._onMouseOver.bind(this);
        this._buttonSprite.mouseout  = this._onMouseOut.bind(this);
        this._buttonSprite.click  = this._onClick.bind(this);
    }

    public getDisplayObject(): PIXI.Sprite {
        return this._buttonSprite;
    }

    public activate() {
        this._state = ButtonState.Normal;
        this._buttonSprite.texture = this._textures.normal;
    }

    public update(delta: number) {}

    private _onMouseOver(e: PIXI.interaction.InteractionEvent): void {
        if (this._state === ButtonState.Normal) {
            this._buttonSprite.texture = this._textures.hover;
        }
    }

    private _onMouseOut(e: PIXI.interaction.InteractionEvent): void {
        if (this._state === ButtonState.Normal) {
            this._buttonSprite.texture = this._textures.normal;
        }
    }

    private _onClick(e: PIXI.interaction.InteractionEvent): void {
        if (this._state === ButtonState.Normal) {
            this._state = ButtonState.Disable;
            this._buttonSprite.texture = this._textures.disable;
            if (this._onClickCallback) {
                this._onClickCallback.call(this);
            }
        }
    }
}
