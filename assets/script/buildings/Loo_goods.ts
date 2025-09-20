import Caches from "../common/manager/Caches";
import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StaticManager from "../common/manager/StaticManager";
import UtilsManager from "../common/manager/UtilsManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loo_goods extends cc.Component
{
    price: number;//价格
    redIndex: number
    async init(_price: number, _path: string, _index: number)
    {
        // console.log("掉落物价格", _price, _path)
        this.redIndex = _index;
        this.price = _price;
        this.node.getComponent(cc.Sprite).spriteFrame = await UtilsManager.loadImage('fallings/' + _path) as cc.SpriteFrame;
        // this.change_active(false)
    }
    onLoad()
    {
        // let canvas = cc.find('Canvas')
        // GameSys.game.xSet(Config.GOODSPOS, canvas.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0))))
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch.bind(this))
    }
    gather: boolean = false;
    onTouch()
    {
        this.gather = true
        GameSys.audio.playSFX("audios/button");
        StaticManager.getInstance().falllings[this.redIndex][0] = 0
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 27)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 28)
            }
        }
        GameSys.game.xSet(Config.FALLINGRED, this.redIndex)
        cc.tween(this.node)
            .to(0.2, { scale: 0.8 })
            .to(0.2, { scale: 0.7 })
            .call(() =>
            {
                this.node.getComponent(cc.Sprite).enabled = false;
                let canvas = cc.find("Canvas")
                let pos = canvas.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
                this.node.parent = canvas;
                this.node.zIndex = 100;
                this.node.x = pos.x;
                this.node.y = pos.y
                let x = GameSys.game.xGet(Config.GOLDPOS).x;
                let y = GameSys.game.xGet(Config.GOLDPOS).y;
                this.node.children[0].active = true;
                cc.tween(this.node)
                    .to(1, { x: x, y: y })
                    .call(() =>
                    {
                        GameSys.gold(this.price);
                        GameSys.audio.playSFX("audios/goldcollect");
                        this.node.destroy();
                    })
                    .start()
            })
            .start()
    }
}
