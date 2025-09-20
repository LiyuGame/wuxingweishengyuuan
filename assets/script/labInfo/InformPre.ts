import { Config, PopupPath } from "../common/manager/Config";
import DataManager from "../common/manager/DataManager";
import GameSys from "../common/manager/GameSys";
import PopupManager, { PopupCacheMode, PopupShowPriority } from "../common/manager/PopupManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'InformPre'
@ccclass
export default class InformPre extends cc.Component
{
    @property(cc.Node)
    anim_1: cc.Node = null;

    @property(cc.Node)
    anim: cc.Node = null;
    @property(cc.Label)
    lab: cc.Label = null;

    private index: number = 0;//0  商店，1外观，2打扫，3仓库解锁，4招募员工
    private cb: Function
    init(index: number, v: string, cb: Function)
    {
        this.lab.string = v;
        // this.lab.node.x = 100;
        this.index = index;
        this.cb = cb;
        //这个是滚动
        // cc.tween(this.lab.node)
        //     .to(2, { x: -100 })
        //     .to(0, { x: 100 })
        //     .union().repeatForever()
        //     .start()
        //这个是抖动
        cc.tween(this.anim)
            .to(1, { scale: 1.1 })
            .to(1, { scale: 1 })
            .union().repeatForever()
            .start()
        cc.tween(this.lab.node)
            .to(1, { scale: 1.1 })
            .to(1, { scale: 1 })
            .union().repeatForever()
            .start()
        cc.tween(this.anim_1)
            .to(0.3, { angle: 5 })
            .to(0.2, { angle: 0 })
            .to(0.3, { angle: -5 })
            .to(0.2, { angle: 0 })
            .delay(0.2)
            .union().repeatForever()
            .start()
        this.index = index;
    }
    async onTouchIndex()
    {
        this.cb()
        DataManager.getInstance().spliceInform(this.index);
        this.node.destroy();
    }
    onDestory() 
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
