import { Config, In_Save_Apperance } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import UtilsManager from "../common/manager/UtilsManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Changee_Appearance'
@ccclass
export default class Changee_Appearance extends cc.Component
{
    @property(cc.Sprite)
    spr: cc.Sprite = null;
    @property()
    index: number = 0;
    @property()
    floorIndex: number = -1;

    private path: string[] = ["roomB/B", "roomA/A", "roomS/S"]
    async onLoad()
    {
        GameSys.game.xBind(Config.APPEARANCECHANGE, this.change_spr.bind(this), BINDER_NAME)
        // GameSys.game.xBind(Config.CLEAN, this.clean.bind(this), BINDER_NAME)
        let appearance: In_Save_Apperance = GameSys.game.xGet(Config.APPEARANCE)[this.index];
        this.node.getComponent(cc.Sprite).spriteFrame = await UtilsManager.loadImage(this.path[appearance.index] + this.index.toString()) as cc.SpriteFrame
        if (appearance.index == 1 || appearance.index == 2)
        {
            if (this.spr.node)
            {
                this.spr.spriteFrame = await UtilsManager.loadImage(this.path[appearance.index] + this.index.toString() + "_" + appearance.index.toString()) as cc.SpriteFrame
            }
        }
        appearance = null;
    }
    // private floor: cc.Node = new cc.Node;
    // clean(data: { state: boolean, index: number })
    // {
    //     if (data.state && data.index == this.floorIndex)
    //     {
    //         let canvas = cc.find("Canvas");
    //         this.floor = this.node;
    //         this.floor.parent = canvas;
    //         this.floor.setPosition(cc.v2(0, 0));
    //         this.floor.zIndex = 15;
    //         this.floor.scale = 1.5
    //     }
    //     if (!data.state && data.index == this.floorIndex)
    //     {
    //         this.floor.removeFromParent();
    //     }
    // }
    async change_spr(data: { index: number, state: number })
    {
        if (data.index !== this.index)
            return
        // console.error("====", data.index, data.state)
        let clone: cc.Node = new cc.Node();
        clone.parent = this.node.parent;
        clone.anchorX = this.node.anchorX;
        clone.anchorY = this.node.anchorY
        clone.x = this.node.x;
        clone.y = this.node.y + 100;
        if (this.spr.node)
        {
            this.spr.enabled = false;
        }
        this.node.getComponent(cc.Sprite).enabled = false;
        this.node.stopAllActions();
        this.node.resumeAllActions()
        clone.addComponent(cc.Sprite).spriteFrame = await UtilsManager.loadImage(this.path[data.state] + this.index.toString()) as cc.SpriteFrame
        if (data.state == 0)
        {
            if (this.spr.node)
            {
                this.spr.enabled = false;
            }
            cc.tween(clone)
                .to(0.5, { y: this.node.y })
                .call(async () =>
                {
                    clone.destroy();
                    this.node.getComponent(cc.Sprite).enabled = true;
                    this.node.getComponent(cc.Sprite).spriteFrame = await UtilsManager.loadImage(this.path[data.state] + this.index.toString()) as cc.SpriteFrame
                })
                .start()
        }
        else if (data.state == 1)
        {
            if (this.spr.node)
            {
                let clone_1: cc.Node = new cc.Node;
                clone_1.parent = this.spr.node.parent;
                clone_1.x = this.spr.node.x;
                clone_1.y = this.spr.node.y + 150;
                clone_1.addComponent(cc.Sprite).spriteFrame = await UtilsManager.loadImage(this.path[data.state] + this.index.toString() + "_" + data.state.toString()) as cc.SpriteFrame
                cc.tween(clone_1)
                    .to(0.7, { y: this.spr.node.y })
                    .call(async () =>
                    {
                        clone_1.destroy();
                        this.spr.enabled = true;
                        this.spr.spriteFrame = await UtilsManager.loadImage(this.path[data.state] + this.index.toString() + "_" + data.state.toString()) as cc.SpriteFrame
                    })
                    .start()
            }
            cc.tween(clone)
                .to(0.5, { y: this.node.y })
                .call(async () =>
                {
                    clone.destroy();
                    this.node.getComponent(cc.Sprite).enabled = true;
                    this.node.getComponent(cc.Sprite).spriteFrame = await UtilsManager.loadImage(this.path[data.state] + this.index.toString()) as cc.SpriteFrame
                })
                .start()
        }
        else
        {
            if (this.spr.node)
            {
                let clone_1: cc.Node = new cc.Node;
                clone_1.parent = this.spr.node.parent;
                clone_1.x = this.spr.node.x;
                clone_1.y = this.spr.node.y + 150;
                clone_1.addComponent(cc.Sprite).spriteFrame = await UtilsManager.loadImage(this.path[data.state] + this.index.toString() + "_" + data.state.toString()) as cc.SpriteFrame
                cc.tween(clone_1)
                    .to(0.7, { y: this.spr.node.y })
                    .call(async () =>
                    {
                        clone_1.destroy();
                        this.spr.enabled = true;
                        this.spr.spriteFrame = await UtilsManager.loadImage(this.path[data.state] + this.index.toString() + "_" + data.state.toString()) as cc.SpriteFrame
                    })
                    .start()
            }
            cc.tween(clone)
                .to(0.5, { y: this.node.y })
                .call(async () =>
                {
                    clone.destroy();
                    this.node.getComponent(cc.Sprite).enabled = true;
                    this.node.getComponent(cc.Sprite).spriteFrame = await UtilsManager.loadImage(this.path[data.state] + this.index.toString()) as cc.SpriteFrame
                })
                .start()
        }
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
