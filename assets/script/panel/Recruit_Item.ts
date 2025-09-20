import { Config, In_RECRUIT, TipLab } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StateManager from "../common/manager/StateManager";
import UtilsManager from "../common/manager/UtilsManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = ''
@ccclass
export default class RecruitItem extends cc.Component
{
    @property(cc.Node)
    buy: cc.Node = null
    @property(cc.Prefab)
    reduce: cc.Prefab = null;
    @property(cc.Node)
    lvl: cc.Node = null;
    @property(cc.Sprite)
    head: cc.Sprite = null;
    @property(cc.Label)
    name_lab: cc.Label = null;
    @property(cc.Label)
    efficiency_lab: cc.Label = null;
    @property(cc.Label)
    time_lab: cc.Label = null;
    @property(cc.Label)
    price_lab: cc.Label = null;
    @property(StateManager)
    star: StateManager = null;

    @property(StateManager)
    state: StateManager = null;

    private recruitInfo: In_RECRUIT;
    private ID: number = 0;//这样处理有一个弊端，就是无法节点顺序要确定写

    /**
     * 
     * @param _state 状态，是否已经招募
     * @param _index 对应的员工ID
     * @param recruit 员工信息
     */
    async init(_state: number, recruit: In_RECRUIT)
    {
        this.efficiency_lab.string = ''
        this.time_lab.string = ''
        this.price_lab.string = ''
        this.recruitInfo = recruit;
        this.state.stateChange(_state);
        this.ID = recruit.ID;

        this.name_lab.string = recruit.name;
        this.efficiency_lab.string = "打扫时间:" + recruit.efficiency.toString() + "秒/次";
        this.time_lab.string = "休息时间:" + recruit.time.toString() + "秒/次";
        this.price_lab.string = "招募价格:" + recruit.price.toString();
        if (this.ID == 3 || this.ID == 7)
        {
            this.price_lab.node.x = -36;
            if (_state == 0)
            {
                this.price_lab.string = "视频获得"
                this.state.node.children[0].children[0].active = true;
                this.watchvideo = true;
                this.state.node.children[0].children[1].active = true;
            }
            else
            {
                this.price_lab.string = "视频获得"
                this.state.node.children[0].children[0].active = false;
                this.watchvideo = false;
            }
        }
        if (_state == 0 && this.ID !== 3 && this.ID !== 7)
        {
            GameSys.judgeGold(recruit.price, () =>
            {
                this.state.node.children[0].children[1].active = false;
            }, () =>
            {
                this.state.node.children[0].children[1].active = true;
            })
        }
        if (recruit.level > 5)
        {
            this.star.stateChange(5)
        }
        else
        {
            this.star.stateChange(recruit.level - 1)
        }
        // this.level_lab.string = "类型品级:" + recruit.ID
        this.head.spriteFrame = await UtilsManager.loadImage(`staff/staff_${recruit.ID}`) as cc.SpriteFrame
        this.lvl.color = new cc.Color().fromHEX(recruit.color)
    }
    private watchvideo: boolean = false;
    //招募
    onTouchRecruit()
    {
        //金币判断
        // console.log("招募", this.ID - 1)
        let cb = () =>
        {
            GameSys.game.xSet(Config.TIP, this.recruitInfo.name + TipLab.recruited)
            // this.node.destroy();//同时在已经招募里面要有展示
            GameSys.game.xSet(Config.RECRUITCHANGE, {
                index: this.ID - 1,
                state: 1,
            })
            this.state.stateChange(1)
            GameSys.game.xSet(Config.ALLRED)
        }
        if (this.watchvideo)
        {
            GameSys.watchVideo(5, cb)
        }
        else
        {
            GameSys.useGold(-this.recruitInfo.price, () =>
            {
                let goldAnim: cc.Node = cc.instantiate(this.reduce);
                this.buy.addChild(goldAnim);
                goldAnim.y = -30;
                goldAnim.x = 0;
                goldAnim.children[0].getComponent(cc.Label).string = "-" + this.recruitInfo.price.toFixed(0);
                goldAnim.children[0].color = cc.Color.BLACK;
                cc.tween(goldAnim)
                    .to(1, { y: goldAnim.y - 30, opacity: 100 })
                    .call(() =>
                    {
                        cb()
                        goldAnim.destroy();
                    })
                    .start()


            })
        }

    }
    //解雇
    onTouchDismissal()
    {
        //所用员工删除
        // console.log("解雇", this.ID - 1)
        GameSys.game.xSet(Config.TIP, this.recruitInfo.name + TipLab.dissmissal)
        GameSys.game.xSet(Config.RECRUITCHANGE, {
            index: this.ID - 1,
            state: 0,
        })
        this.state.stateChange(0)
        if (this.ID == 3 || this.ID == 7)
        {
            this.price_lab.node.x = -36;
            this.price_lab.string = "视频获得"
            this.state.node.children[0].children[0].active = true;
            this.watchvideo = true;
        }
        GameSys.game.xSet(Config.ALLRED)
    }
}
