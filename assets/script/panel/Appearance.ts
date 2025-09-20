import Caches from "../common/manager/Caches";
import { APPEARANCE, Config, In_Save_Apperance } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StateManager from "../common/manager/StateManager";
import UtilsManager from "../common/manager/UtilsManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Appearance'
@ccclass
export default class Appearance extends cc.Component
{
    @property(cc.Node)
    S: cc.Node = null;
    @property(cc.Node)
    lockS: cc.Node = null;
    @property(cc.Node)
    goldA: cc.Node = null
    @property(cc.Node)
    goldS: cc.Node = null
    @property(cc.Prefab)
    reduce: cc.Prefab = null;
    @property(cc.Sprite)
    A_spr: cc.Sprite = null;
    @property(cc.Sprite)
    B_spr: cc.Sprite = null;
    @property(cc.Sprite)
    S_spr: cc.Sprite = null;

    @property(cc.Label)
    A_lab: cc.Label = null;
    @property(cc.Label)
    S_lab: cc.Label = null;

    @property(StateManager)
    lock_A: StateManager = null;
    @property(StateManager)
    lock_S: StateManager = null;

    @property(cc.Node)
    select: cc.Node = null;

    private index: number = 0;
    private appearance: In_Save_Apperance

    private selectPos: number[] = [-128, -5, 112]
    init(_index: number)
    {
        this.change_data({ index: _index, state: true })
    }
    onEnable()
    {
        GameSys.game.xBind(Config.APPITEM, this.change_data.bind(this), BINDER_NAME)
        this.node.scale = 0;
    }
    private watchvideoA: boolean = false
    private watchvideoS: boolean = false
    async change_data(data: { index: number, state: boolean })
    {
        let cb = async () =>
        {
            this.S.color = cc.Color.WHITE
            this.A_lab.string = ''
            this.S_lab.string = ''
            this.touch = [false, false, false]
            this.touch[data.index] = true;
            this.watchvideoA = false;
            this.watchvideoS = false;
            this.appearance = GameSys.game.xGet(Config.APPEARANCE)[data.index]
            this.select.x = this.selectPos[this.appearance.index]
            this.index = data.index;

            if (APPEARANCE[data.index].lock_A > GameSys.level)
            {
                this.lock_A.stateChange(0)
                this.A_lab.string = APPEARANCE[data.index].lock_A.toString() + "级解锁"
            }
            else
            {
                this.lock_A.stateChange(1)

                if (this.appearance.geta)
                {
                    // this.A_lab.string = "A级" + APPEARANCE[index].name
                    // this.A_lab.string = '已解锁'
                    this.lock_A.node.children[this.lock_A.nowState].children[0].active = false
                }
                else
                {
                    this.touch[data.index] = false;
                    this.A_lab.string = '-' + APPEARANCE[data.index].gold_A.toString()
                    GameSys.judgeGold(APPEARANCE[data.index].gold_A, () =>
                    {
                        // console.log("金币不足")
                        this.watchvideoA = true;
                        this.lock_A.node.children[this.lock_A.nowState].children[0].active = true
                    }, () =>
                    {
                        // console.log("金币足够")
                        this.watchvideoA = false;
                        this.lock_A.node.children[this.lock_A.nowState].children[0].active = false
                    })
                }
            }

            if (APPEARANCE[data.index].lock_S > GameSys.level)
            {
                this.lock_S.stateChange(0)
                this.lockS.active = true;
                this.S_lab.string = APPEARANCE[data.index].lock_S.toString() + "级解锁"
                this.S.color = cc.Color.GRAY
            }
            else
            {
                this.lock_S.stateChange(1)
                this.lockS.active = false;
                if (this.appearance.gets)
                {
                    // this.S_lab.string = "S级" + APPEARANCE[index].name
                    // this.S_lab.string = ''
                    this.lock_S.node.children[this.lock_S.nowState].children[0].active = false
                }
                else
                {
                    this.touch[data.index] = false;
                    this.S_lab.string = '-' + APPEARANCE[data.index].gold_S.toString()
                    GameSys.judgeGold(APPEARANCE[data.index].gold_S, () =>
                    {
                        // console.log("金币不足")
                        this.watchvideoS = true;
                        this.lock_S.node.children[this.lock_S.nowState].children[0].active = true
                    }, () =>
                    {
                        // console.log("金币足够")
                        this.watchvideoS = false;
                        this.lock_S.node.children[this.lock_S.nowState].children[0].active = false
                    })
                }
            }
            // this.B_lab.string = "B级" + APPEARANCE[index].name
            this.B_spr.spriteFrame = await UtilsManager.loadImage(`appearanceB/B${data.index}`) as cc.SpriteFrame
            this.A_spr.spriteFrame = await UtilsManager.loadImage(`appearanceA/A${data.index}`) as cc.SpriteFrame
            this.S_spr.spriteFrame = await UtilsManager.loadImage(`appearanceS/S${data.index}`) as cc.SpriteFrame

        }
        if (data.state)
        {
            cc.tween(this.node)
                .to(0.1, { scale: 0 })
                .call(() =>
                {
                    cb && cb()
                })
                .to(0.1, { scale: 1 })
                .start()

        }
    }
    touch: boolean[] = [false, false, false]
    onTouchB()
    {
        this.appearance = GameSys.game.xGet(Config.APPEARANCE)[this.index]
        if (this.touch[0])
            return
        this.touch[0] = true;
        this.touch[1] = false;
        this.touch[2] = false;
        GameSys.game.xSet(Config.APPEARANCECHANGE, {
            index: this.index,
            state: 0,
            geta: this.appearance.geta,
            gets: this.appearance.gets
        })
        this.anim(0)
    }
    anim(index: number)
    {
        cc.tween(this.select)
            .to(0, { x: this.selectPos[index] })
            .start()
    }
    onTouchA()
    {
        this.appearance = GameSys.game.xGet(Config.APPEARANCE)[this.index]
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 12)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 13)
            }
        }
        if (this.touch[1])
            return

        let cb = () =>
        {
            this.touch[1] = true;
            this.touch[0] = false;
            this.touch[2] = false;
            this.anim(1)
            GameSys.game.xSet(Config.APPEARANCECHANGE, {
                index: this.index,
                state: 1,
                geta: true,
                gets: this.appearance.gets
            })
            this.A_lab.string = ''
            GameSys.audio.playSFX("audios/shengji_2");
            this.lock_A.node.children[this.lock_A.nowState].children[0].active = false
            GameSys.game.xSet(Config.ALLRED)
        }

        if (this.appearance.geta)
        {
            GameSys.audio.playSFX("audios/shengji_2");
            GameSys.game.xSet(Config.APPEARANCECHANGE, {
                index: this.index,
                state: 1,
                geta: this.appearance.geta,
                gets: this.appearance.gets
            })
            this.anim(1)
            this.touch[1] = true;
            this.touch[0] = false;
            this.touch[2] = false;
        }
        else
        {
            if (this.watchvideoA)
            {
                GameSys.watchVideo(2, cb)
            }
            else
            {
                GameSys.useGold(-APPEARANCE[this.index].gold_A, () =>
                {
                    this.goldAnim(this.goldA, APPEARANCE[this.index].gold_A)
                    cb()
                })
            }

        }
    }
    goldAnim(node: cc.Node, price: number)
    {
        let goldAnim: cc.Node = cc.instantiate(this.reduce);
        node.addChild(goldAnim);
        goldAnim.y = -40;
        goldAnim.x = 0;
        goldAnim.children[0].getComponent(cc.Label).string = "-" + price.toFixed(0);
        goldAnim.children[0].color = cc.Color.BLACK
        cc.tween(goldAnim)
            .to(1, { y: goldAnim.y - 20, opacity: 100 })
            .call(() =>
            {
                goldAnim.destroy();
            })
            .start()
    }
    onTouchS()
    {
        this.appearance = GameSys.game.xGet(Config.APPEARANCE)[this.index]
        if (this.touch[2])
            return

        let cb = () =>
        {
            this.touch[2] = true;
            this.touch[1] = false;
            this.touch[0] = false;
            this.anim(2)
            GameSys.game.xSet(Config.APPEARANCECHANGE, {
                index: this.index,
                state: 2,
                geta: this.appearance.geta,
                gets: true,
            })
            this.S_lab.string = ""
            GameSys.audio.playSFX("audios/shengji_2");
            this.lock_S.node.children[this.lock_A.nowState].children[0].active = false
            GameSys.game.xSet(Config.ALLRED)
        }
        if (this.appearance.gets)
        {
            GameSys.audio.playSFX("audios/shengji_2");
            this.anim(2)
            GameSys.game.xSet(Config.APPEARANCECHANGE, {
                index: this.index,
                state: 2,
                geta: this.appearance.geta,
                gets: this.appearance.gets
            })
            this.touch[2] = true;
            this.touch[1] = false;
            this.touch[0] = false;
        }
        else
        {
            if (this.watchvideoS)
            {
                GameSys.watchVideo(3, cb)
            }
            else
            {
                GameSys.useGold(-APPEARANCE[this.index].gold_S, () =>
                {
                    this.goldAnim(this.goldS, APPEARANCE[this.index].gold_S)
                    cb()
                })
            }

        }
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
