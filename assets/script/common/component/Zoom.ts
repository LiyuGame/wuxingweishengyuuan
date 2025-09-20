import { Config } from "../manager/Config";
import GameSys from "../manager/GameSys";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Zoom'
@ccclass
export default class Zoom extends cc.Component
{
    @property(cc.Node)
    zone: cc.Node = null;
    @property(cc.Node)
    targetMap: cc.Node = null;
    startPos1: cc.Vec2;
    startPos2: cc.Vec2;
    pointsDis: number

    onLoad()
    {
        // this.node.on('touchstart', this.onTouchStart, this);
        // this.node.on('touchmove', this.onTouchMove, this);

        GameSys.game.xBind(Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME)
    }
    stopmove: boolean = false;
    hideAll(v: boolean)
    {
        this.stopmove = v
        this.node.scale = 1;
    }
    onTouchStart(event)
    {
        if (this.stopmove)
            return
        let touches = event.getTouches();
        if (touches.length == 1)
        {
            // 一根手指是移动，这里不用写任何代码       
        }
        else if (touches.length == 2)
        {
            this.startPos1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
            this.startPos2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
            this.pointsDis = this.startPos1.sub(this.startPos2).mag();
        }
    }
    onTouchMove(event)
    {
        if (this.stopmove)
            return
        let touches = event.getTouches();
        // if (touches.length == 1)
        // {
        //     // 一根手指是移动
        //     let delta = event.getDelta();
        //     this.targetMap.setPosition(this.targetMap.position.add(delta));
        //     this.restrictPic();
        // }
        // else 
        if (touches.length == 2)
        {
            // 两根手指是缩放
            let touchPoint1 = this.node.convertToNodeSpaceAR(touches[0].getLocation());
            let touchPoint2 = this.node.convertToNodeSpaceAR(touches[1].getLocation());
            let newPointsDis = touchPoint1.sub(touchPoint2).mag();

            if (!this.pointsDis)        // 该行代码针对安卓手机(因为在安卓手机上，onTouchStart获取的手指数始终为1，从而导致this.pointsDis不存在)
                this.pointsDis = 0;

            if (newPointsDis > this.pointsDis)
            {
                // 表明两根手指在往外划
                if (this.targetMap.scale >= 1.2)
                {
                    this.targetMap.scale = 1.2
                    return
                }
                this.pointsDis = newPointsDis;
                this.targetMap.scale += 0.1;
            }
            else if (newPointsDis < this.pointsDis)
            {
                // 表明两根手指在往内划
                if (this.targetMap.scale <= 1)
                {
                    this.targetMap.scale = 1;
                    return;
                }

                this.pointsDis = newPointsDis;
                this.targetMap.scale -= 0.1;
            }

            this.restrictPic();
        }

    }
    restrictPic()
    {
        // 限制移动，放置出现黑边
        let picWidth = this.targetMap.getBoundingBox().width;
        let picHeight = this.targetMap.getBoundingBox().height;
        if (this.targetMap.x > 0 && this.targetMap.x - 0 > picWidth / 2 - this.zone.width / 2)
            this.targetMap.x = picWidth / 2 - this.zone.width / 2;
        if (this.targetMap.x < 0 && this.targetMap.x - 0 < this.zone.width / 2 - picWidth / 2)
            this.targetMap.x = this.zone.width / 2 - picWidth / 2;
        if (this.targetMap.y > 0 && this.targetMap.y - 0 > picHeight / 2 - this.zone.height / 2)
            this.targetMap.y = picHeight / 2 - this.zone.height / 2;
        if (this.targetMap.y < 0 && this.targetMap.y - 0 < this.zone.height / 2 - picHeight / 2)
            this.targetMap.y = this.zone.height / 2 - picHeight / 2;
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
