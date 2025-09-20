import { Config } from "./common/manager/Config";
import GameSys from "./common/manager/GameSys";
import StaticManager from "./common/manager/StaticManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends cc.Component
{
    @property(cc.Node)
    red: cc.Node = null;
    @property(cc.Node)
    par: cc.Node = null;
    @property
    index: number = 0;

    initZindex: number = 0;
    initparent: cc.Node;
    initPos: cc.Vec2;
    close: cc.Node;
    onEnable()
    {
        this.close = this.par.getChildByName('close');
        // console.log("父节点的Zindex", this.par.zIndex)
        this.initZindex = this.par.zIndex;
        this.initparent = this.par.parent;
        this.initPos = this.par.getPosition()
        // console.log(this.initparent)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch.bind(this))
        this.close.on(cc.Node.EventType.TOUCH_END, this.onTouchClose.bind(this))
    }
    onTouch()
    {
        if (GameSys.game.xGet(Config.HIDEALL))
            return
        if (!this.red.active)
            return;
        GameSys.game.xSet(Config.BLOCK, true)
        let canvas: cc.Node = cc.find('Canvas')
        this.par.parent = canvas;
        // GameSys.game.xSet(Config.HIDEBUILDINGS, {
        //     index: this.index,
        //     v: false
        // })
        cc.tween(this.par)
            .to(0, { x: 0, y: 0, scale: 1.3 })
            .call(() =>
            {
                this.close.active = true;
            })
            .start()
    }
    onTouchClose()
    {
        this.close.active = false;
        GameSys.game.xSet(Config.BLOCK, false)
        cc.tween(this.par)
            .to(0, { x: this.initPos.x, y: this.initPos.y, scale: 1 })
            .call(() =>
            {
                this.par.parent = this.initparent;
                // this.par.setPosition(this.initPos)
                this.par.zIndex = this.initZindex;
                // GameSys.game.xSet(Config.HIDEBUILDINGS, {
                //     index: this.index,
                //     v: true
                // })
            })
            .start()

    }

}
