import Caches from "../common/manager/Caches";
import { Config } from "../common/manager/Config";
import DataManager from "../common/manager/DataManager";
import GameSys from "../common/manager/GameSys";
import UtilsManager from "../common/manager/UtilsManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Block extends cc.Component
{
    @property
    index: number = 0;

    flag: boolean = false;//已经清洁
    over: boolean = false;//停下来
    initPos: cc.Vec3;
    initPar: cc.Node;
    canvas: cc.Node;
    count: number = 0;
    async onEnable()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this))
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this))
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this))
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this))

        this.canvas = cc.find("Canvas")
        this.initPar = this.node.parent;
        this.flag = false;
        this.over = false;
        this.count = 0;

        let spr: string = ""
        if (this.index == 0)
        {
            spr = DataManager.getInstance().cleanGarbageInfo.item_model1;
        }
        else if (this.index == 1)
        {
            spr = DataManager.getInstance().cleanGarbageInfo.item_model2;
        }
        else if (this.index == 2)
        {
            spr = DataManager.getInstance().cleanGarbageInfo.item_model3;
        }
        let spriteFrame: cc.SpriteFrame = await UtilsManager.loadImage("warehouseItem/" + spr) as cc.SpriteFrame
        this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.node.setContentSize(spriteFrame.getOriginalSize())

        if (this.index == 2)
        {
            DataManager.getInstance().garbageItem = this.node;
        }
    }
    onTouchStart()
    {
        if (DataManager.getInstance().garbageFlag != this.index) return
        if (this.over) return;
        this.initPos = this.node.position;
        // this.initPos = this.canvas.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
        let pos = this.canvas.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
        this.node.parent = this.canvas;
        this.node.setPosition(pos)
        this.node.zIndex = 15
        this.count = 0;

        if (this.index == 0)
        {
            if (!Caches.get(Caches.newGuide))
            {
                if (GameSys.game.xGet(Config.NEWGUIDECON) == 21)
                {
                    GameSys.game.xSet(Config.NEWGUIDECON, 22)
                }
            }
        }
        if (this.index == 1)
        {
            if (!Caches.get(Caches.newGuide))
            {
                if (GameSys.game.xGet(Config.NEWGUIDECON) == 23)
                {
                    GameSys.game.xSet(Config.NEWGUIDECON, 24)
                }
            }
        }
        if (this.index == 2)
        {
            if (!Caches.get(Caches.newGuide))
            {
                if (GameSys.game.xGet(Config.NEWGUIDECON) == 25)
                {
                    GameSys.game.xSet(Config.NEWGUIDECON, 26)
                }
            }
        }
    }
    onTouchMove(event: cc.Event.EventTouch)
    {
        if (DataManager.getInstance().garbageFlag != this.index) return
        if (this.over) return;
        let pos = event.getLocation();
        // pos = this.node.parent.convertToNodeSpaceAR(pos);
        this.node.x += event.getDeltaX()
        this.node.y += event.getDeltaY()

        if (DataManager.getInstance().checkOnTarget(pos))
        {
            if (this.flag)
            {
                return
            }
            this.count++;
            // console.log("在包围盒里")
            if (this.count > 20)
            {
                if (this.index == 2)
                {
                    if (GameSys.game.xGet(Config.GARBAGEOPACITY) == 3)
                    {
                        this.flag = true;
                    }
                }
                else
                {

                    this.flag = true;
                }

                GameSys.game.xSet(Config.GARBAGEOPACITY, this.index)

            }
        }
        else
        {
            // console.log("不在包围盒内")
        }
    }
    onTouchEnd()
    {
        if (DataManager.getInstance().garbageFlag != this.index) return
        if (this.over) return;
        let pos = this.initPar.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
        this.node.parent = this.initPar;
        this.node.setPosition(pos)
        cc.tween(this.node)
            .to(0.3, { position: this.initPos })
            .start()
        if (this.flag)
        {
            this.over = true;
            DataManager.getInstance().garbageFlag = this.index + 1;
            if (this.index == 0)
            {
                if (!Caches.get(Caches.newGuide))
                {
                    if (GameSys.game.xGet(Config.NEWGUIDECON) == 22)
                    {
                        GameSys.game.xSet(Config.NEWGUIDECON, 23)
                    }
                }
            }

            if (this.index == 1)
            {
                if (!Caches.get(Caches.newGuide))
                {
                    if (GameSys.game.xGet(Config.NEWGUIDECON) == 24)
                    {
                        GameSys.game.xSet(Config.NEWGUIDECON, 25)
                    }
                }
            }
            if (this.index == 2)
            {
                if (GameSys.game.xGet(Config.GARBAGEOPACITY) == 3)
                {

                }
            }

        }

    }
    onDisable()
    {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this))
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this))
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this))
    }
}
