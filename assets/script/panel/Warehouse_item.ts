import Caches from "../common/manager/Caches";
import { Config, IN_Warehouse, WAREHOUSE } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StateManager from "../common/manager/StateManager";
import UtilsManager from "../common/manager/UtilsManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Warehouse_item'
@ccclass
export default class Warehouse_item extends cc.Component
{
    @property(cc.Node)
    buy: cc.Node = null
    @property(cc.Prefab)
    reduce: cc.Prefab = null;
    @property(cc.Label)
    lock_lab: cc.Label = null;
    @property(StateManager)
    state: StateManager = null;
    @property(cc.Sprite)
    spr: cc.Sprite = null;
    @property(cc.Label)
    buy_lab: cc.Label = null;
    @property(cc.Label)
    time_lab: cc.Label = null;
    @property(cc.Label)
    interval_lab: cc.Label = null;
    @property(cc.Label)
    add_lab: cc.Label = null;
    @property(cc.Label)
    count_lab: cc.Label = null;

    private ID: number = 0;
    private gold: number = 0;
    private index: number = 0;
    private watchvideo: boolean = false
    async init(warehouse: IN_Warehouse, _index: number)
    {
        this.buyFlag = false;
        this.ID = warehouse.ID - 1
        this.index = _index
        let path = 'warehouse/' + warehouse.name;
        this.spr.spriteFrame = await UtilsManager.loadImage(path) as cc.SpriteFrame;
        this.buy_lab.string = "-" + warehouse.buy.toString();
        this.time_lab.string = `-${warehouse.result_1}s`
        this.interval_lab.string = `-${warehouse.result_2}s`
        this.add_lab.string = `+${warehouse.result_3 * 100}%`
        this.count_lab.string = warehouse.name
        this.gold = warehouse.buy;
        this.watchvideo = false;
        // console.error("解锁条件", warehouse.lock, _index)
        if (GameSys.level >= warehouse.lock)
        {
            this.state.stateChange(0)
            GameSys.judgeGold(this.gold, () =>
            {
                this.state.node.children[0].children[0].active = true;
                this.watchvideo = true;
            }, () =>
            {
                this.state.node.children[0].children[0].active = false;
                this.watchvideo = false;
            })
            this.lock_lab.string = ''
        }
        else
        {
            this.state.stateChange(2)
            this.lock_lab.string = "解锁等级：" + warehouse.lock
        }
        for (let i = 0; i < GameSys.game.xGet(Config.WAREHOUSE).length; i++)
        {
            if (this.ID == GameSys.game.xGet(Config.WAREHOUSE)[i])
            {
                this.state.stateChange(1)

                this.buy_lab.string = ''
            }
        }
        GameSys.game.xBind(Config.WAREHOUSEANIM, this.anim.bind(this), BINDER_NAME);
    }
    onTouchLock()
    {
        GameSys.game.xSet(Config.TIP, "等级不够无法购买！")
    }
    onTouhcHave_buy()
    {
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 30)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 31)
            }
        }
    }
    anim(_index: number)
    {
        this.node.stopAllActions();
        this.node.opacity = 255;
        if (this.index + _index * 3 >= WAREHOUSE.length)
        {
            cc.tween(this.node)
                .to(0.2, { opacity: 0 })
                .start()
            return
        }
        cc.tween(this.node)
            .to(0.2, { opacity: 0 })
            .call(() =>
            {
                this.init(WAREHOUSE[this.index + _index * 3], this.index)
                cc.tween(this.node)
                    .to(0.1, { opacity: 255 })
                    .start()
            })
            .start()
    }
    private buyFlag: boolean = false;
    onTouchBuy()
    {
        if (this.buyFlag)
            return

        this.buyFlag = true;
        let cb = () =>
        {

            this.state.stateChange(1)
            this.lock_lab.string = ""
            this.buy_lab.string = ''
            GameSys.game.xSet(Config.WAREHOUSECHNAGE, this.ID)
            GameSys.game.xSet(Config.ALLRED)
        }
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 30)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 31)
                GameSys.useGold(-this.gold, () =>
                {
                    let goldAnim: cc.Node = cc.instantiate(this.reduce);
                    this.buy.addChild(goldAnim);
                    goldAnim.y = 0;
                    goldAnim.x = 0;
                    goldAnim.children[0].getComponent(cc.Label).string = "-" + this.gold.toFixed(0);
                    goldAnim.children[0].color = cc.Color.BLACK;
                    cc.tween(goldAnim)
                        .to(1, { y: goldAnim.y + 50, opacity: 100 })
                        .call(() =>
                        {
                            goldAnim.destroy();
                            cb()
                        })
                        .start()

                })
            }
        }
        else
        {
            if (this.watchvideo)
            {
                GameSys.watchVideo(4, cb)
            }
            else
            {
                GameSys.useGold(-this.gold, () =>
                {
                    let goldAnim: cc.Node = cc.instantiate(this.reduce);
                    this.buy.addChild(goldAnim);
                    goldAnim.y = 0;
                    goldAnim.x = 0;
                    goldAnim.children[0].getComponent(cc.Label).string = "-" + this.gold.toFixed(0);
                    goldAnim.children[0].color = cc.Color.BLACK;
                    cc.tween(goldAnim)
                        .to(1, { y: goldAnim.y + 50, opacity: 100 })
                        .call(() =>
                        {
                            goldAnim.destroy();
                            cb()
                        })
                        .start()
                })
            }
        }
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
