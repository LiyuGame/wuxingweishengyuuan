import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import MathManager from "../common/manager/MathManager";
import PoolManager from "../common/manager/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GoldAnim extends cc.Component
{
    private price: number
    bindername: string
    init(v: number, bindername: string, click: boolean)
    {
        this.node.resumeAllActions()
        let xran = MathManager.getInstance().randomNum(-60, 60);
        let yran = MathManager.getInstance().randomNum(-10, 0);
        let tran = MathManager.getInstance().randomNum(2, 6);
        let hran = MathManager.getInstance().randomNum(50, 100);

        let action1 = cc.jumpBy(tran * 0.1, cc.v2(xran, yran), hran, 1);
        let action2 = cc.delayTime(1);

        let action4 = cc.scaleTo(0.5, 0.95)
        let action5 = cc.scaleTo(0.5, 1)
        let action = cc.sequence(action4, action5).repeatForever();
        let time: number = 0
        if (click)
        {

            time = 5
        }
        else
        {

            time = 9
        }
        let action3 = cc.callFunc(() =>
        {
            // music.playSound("goldcollect");
            // this.jinbi_shengyin();
            this.node.runAction(action)
            this.scheduleOnce(() =>
            {
                this.onTouchEnd();
            }, time)
        }, this, 10);

        let actionlist = cc.sequence(action1, action2, action3);

        this.node.runAction(actionlist)

        // cc.tween(this.node)
        //     .by(tran * 0.1, { x: xran, y: yran + hran })
        //     .delay(1)
        //     .call(() =>
        //     {
        //         //调用金币声音
        //         this.node.resumeAllActions()
        //         cc.tween(this.node)
        //             .to(0.5, { scale: 0.8 })
        //             .to(0.5, { scale: 1 })
        //             .union().repeatForever()
        //             .start()
        //         this.scheduleOnce(() =>
        //         {
        //             this.onTouchEnd();
        //         }, 5)
        //     })
        //     .start()
        this.price = v;
        this.bindername = bindername;
        if (GameSys.game.xGet(Config.HIDEALL))
        {
            this.node.opacity = 0;
        }

        GameSys.game.xBind(Config.HIDEALL, this.hideAll.bind(this), this.bindername)
    }
    hideAll(v: boolean)
    {
        if (v)
        {
            this.node.opacity = 0;
        }
        else
        {
            this.node.opacity = 255;
        }
    }
    private touch: boolean = false;
    onLoad()
    {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this))
    }
    onTouchEnd()
    {
        if (this.touch)
            return
        this.node.stopAllActions();
        this.node.scale = 1
        this.unscheduleAllCallbacks();
        this.touch = true
        let canvas = cc.find("Canvas")
        let pos: cc.Vec3 = canvas.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
        this.node.parent = canvas
        this.node.setPosition(pos)
        this.node.zIndex = 0
        cc.tween(this.node)
            .to(2, { x: GameSys.game.xGet(Config.GOLDPOS).x, y: GameSys.game.xGet(Config.GOLDPOS).y }, { easing: 'backInOut' })
            .call(() =>
            {
                GameSys.gold(this.price);
                this.node.stopAllActions();
                // this.node.destroy();
                this.node.scale = 1
                this.price = 0;
                this.node.opacity = 255
                this.touch = false
                GameSys.game.xUnbind(this.bindername)
                PoolManager.getInstance().clearGoldList(this.node)
            })
            .start()
    }
    onDestroy()
    {
        GameSys.game.xUnbind(this.bindername)
    }
}
