import Caches from "../manager/Caches";
import { Config, PopupPath } from "../manager/Config";
import GameSys from "../manager/GameSys";
import PopupManager, { PopupCacheMode, PopupShowPriority } from "../manager/PopupManager";

const { ccclass, property } = cc._decorator;
let BINDER_NAME: string = 'map'
@ccclass
export default class Map extends cc.Component
{
    @property(cc.Node)
    zone: cc.Node = null;//是750*1334
    @property(cc.Node)
    targetMap: cc.Node = null;//是任意大

    startPos1: cc.Vec2;
    startPos2: cc.Vec2;
    pointsDis: number
    private _originW: number = 0;
    private _originH: number = 0;

    onLoad()
    {
        this._originW = this.zone.width;
        this._originH = this.zone.height;

        GameSys.game.xBind(Config.SCREENPOS, this.change_pos.bind(this), BINDER_NAME);
        // GameSys.game.xBind(Config.HIDEALL, this.change_fix.bind(this), BINDER_NAME);
        GameSys.game.xBind(Config.NEWGUIDECON, this.change_newguide.bind(this), BINDER_NAME)
        // GameSys.game.xBind(Config.BUILDINGSAPP, this.change_map.bind(this), BINDER_NAME);
    }
    private newguide: number[] = [750, 0]
    change_newguide(v: number)
    {
        if (v == 9)
        {
            this.targetMap.x = 0
        }
        // cc.tween(this.targetMap)
        //     .to(0.2, { x: this.newguide[v] })
        //     .start()
    }
    change_fix(v: boolean)
    {
        this.move = v;
    }
    // change_map(data: { index: number, state: boolean })
    // {
    //     this.move = data.state
    // }
    //传进来的值有0,1,2,3,4,5,6,7
    // private pos: number[] = [0, 0, 0, 750, 750, 750, -274, -274, -274, -750, -750, -750]
    private pos: cc.Vec3[] = [cc.v3(147, 0, 0), cc.v3(600, 0, 0), cc.v3(-343, -130, 0), cc.v3(-972, 0, 0)]
    // private pos: number[] = [-750, -274, 0, 500, 750]
    private move: boolean = false;
    change_pos(v: number)
    {
        cc.tween(this.targetMap)
            .to(0.2, { position: this.pos[v] })
            .start()
    }

    start()
    {
        this.targetMap.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
    }
    onTouchStart(event)
    {
        if (this.move)
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
    onTouchMove(event: cc.Event.EventTouch)
    {
        if (!Caches.get(Caches.newGuide))
            return
        if (GameSys.game.xGet(Config.BLOCK).state)
            return
        if (this.move)
            return
        let pre = event.getPreviousLocation();
        let cur = event.getLocation();
        var dir = cur.sub(pre);
        this.targetMap.x += (dir.x / 2);
        this.targetMap.y += (dir.y / 2);
        //判断左边距离
        var zoneLeft = this.zone.x - this.zone.width / 2;
        var zoneRight = this.zone.x + this.zone.width / 2;
        var zoneTop = this.zone.y + this.zone.height / 2;
        var zoneBottom = this.zone.y - this.zone.height / 2;

        var halfMapWidth = this.targetMap.width / 2;
        var halfMapHeight = this.targetMap.height / 2;

        //左边
        if (this.targetMap.x - halfMapWidth > zoneLeft)
        {
            this.targetMap.x = zoneLeft + halfMapWidth;
        }
        //右边
        if (this.targetMap.x + halfMapWidth < zoneRight)
        {
            this.targetMap.x = zoneRight - halfMapWidth;
        }

        //上边
        if (this.targetMap.y + halfMapHeight < zoneTop)
        {
            this.targetMap.y = zoneTop - halfMapHeight;
        }
        //下边
        if (this.targetMap.y - halfMapHeight > zoneBottom)
        {
            this.targetMap.y = zoneBottom + halfMapHeight;
        }


        let touches = event.getTouches();
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
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME);
    }
}
