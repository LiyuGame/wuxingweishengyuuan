import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Magnify'
@ccclass
export default class Magnify extends cc.Component
{
    @property(cc.Node)
    hide_1: cc.Node = null
    @property(cc.Node)
    hide: cc.Node = null;
    @property
    index: number = 0;

    initPos: cc.Vec3;
    close: cc.Node;
    initparent: cc.Node;
    initZindex: number = 0;
    onLoad()
    {
        this.close = this.node.getChildByName('close');
        this.initZindex = this.node.zIndex;
        this.initparent = this.node.parent;
        this.initPos = this.node.position
        GameSys.game.xBind(Config.MAGNIFY, this.change_magnify.bind(this), BINDER_NAME)
        this.close.on(cc.Node.EventType.TOUCH_END, this.onTouchClose.bind(this))
    }
    open: boolean = false;
    change_magnify(data: { index?: number, state: boolean })
    {
        if (data.state)
        {
            if (this.index == data.index)
            {
                if (this.hide)
                {
                    this.hide.active = true
                }
                if (this.hide_1)
                {
                    this.hide_1.active = false;
                }
                GameSys.game.xSet(Config.BUILDINGSAPP, {
                    index: this.index,
                    state: true
                })
                this.open = true;
                GameSys.game.xSet(Config.BLOCK, {
                    state: true,
                    spr: false,
                    clean: false
                })
                this.close.active = true
                let canvas: cc.Node = cc.find('Canvas')
                this.node.parent = canvas
                this.node.zIndex = 15;
                cc.tween(this.node)
                    .to(0, { scale: 1.2, x: 0, y: 0 })
                    .start()
            }
            else
            {
                if (this.open)
                {
                    this.onTouchClose();
                }
            }
        }
        else
        {
            this.onTouchClose()
        }


    }

    onTouchClose()
    {
        GameSys.audio.playSFX("audios/close")
        GameSys.game.xSet(Config.BUILDINGSAPP, {
            index: this.index,
            state: false
        })
        GameSys.game.xSet(Config.APPITEM, {
            index: GameSys.game.xGet(Config.APPITEM).index,
            state: false
        })
        this.open = false;
        this.close.active = false;
        GameSys.game.xSet(Config.BLOCK, {
            state: false,
            spr: false,
            clean: false
        })
        cc.tween(this.node)
            .to(0, { scale: 1, position: this.initPos })
            .call(() =>
            {
                if (this.hide)
                {
                    this.hide.active = false
                }
                if (this.hide_1)
                {
                    this.hide_1.active = true;
                }
                this.node.parent = this.initparent;
                this.node.zIndex = this.initZindex;
                this.close.off(cc.Node.EventType.TOUCH_END, this.onTouchClose.bind(this))
            })
            .start()
    }

    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
