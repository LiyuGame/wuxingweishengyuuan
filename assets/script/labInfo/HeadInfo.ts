import { APPEARANCE, Config, In_Save_Apperance, LEVELLOCK, LOCK_ROOM, LOO_LOOKON, PopupPath, RECRUIT, STAFF_MOVE_TOILET_1, WAREHOUSE } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import PopupManager, { PopupCacheMode, PopupShowPriority } from "../common/manager/PopupManager";
import StaticManager from "../common/manager/StaticManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'HeadInfo'
@ccclass
export default class HeadInfo extends cc.Component
{
    @property(cc.Prefab)
    goldAnim: cc.Prefab = null;
    @property(cc.Node)
    goldPar: cc.Node = null;

    @property(cc.Node)
    experience: cc.Node = null;

    @property({ type: cc.Label, tooltip: CC_DEV && '当前等级' })
    public lvl_lab: cc.Label = null;
    @property({ type: cc.Label, tooltip: CC_DEV && '当前金币' })
    public gold_lab: cc.Label = null;
    @property({ type: cc.Node, tooltip: CC_DEV && '金币位置' })
    public gold_pos: cc.Node = null;
    @property({ type: cc.ProgressBar, tooltip: CC_DEV && '经验条' })
    public progress: cc.ProgressBar = null;

    private appearance: In_Save_Apperance[] = []

    onEnable()
    {
        this.lvl_lab.string = "LV:" + GameSys.level.toString();
        let canvas = cc.find('Canvas')
        GameSys.game.xSet(Config.GOLDPOS, canvas.convertToNodeSpaceAR(this.gold_pos.convertToWorldSpaceAR(cc.v3(0, 0, 0))))

        GameSys.game.xBind(Config.GOLD, this.change_lvl.bind(this), BINDER_NAME)

        this.gold_lab.string = GameSys.game.xGet(Config.GOLD).v.toFixed(0).toString()
        this.progress.progress = GameSys.game.xGet(Config.GOLD).v / LEVELLOCK[GameSys.level].gold
        // this.add_gold();
    }
    online()
    {

    }
    offline()
    {

    }

    change_lvl(_data: { v: number, index: number })
    {
        this.gold_lab.string = ''
        this.gold_lab.string = _data.v.toFixed(0).toString()
        this.appearance = GameSys.game.xGet(Config.APPEARANCE);

        if (_data.index > 0)
        {
            //改变进度条
            GameSys.game.xSet(Config.ALLRED)
            this.informApp(_data.v);
            let cb = () =>
            {
                if (GameSys.level < 39)
                {
                    this.progress.progress = _data.v / LEVELLOCK[GameSys.level].gold
                }

                let goldAnim: cc.Node = cc.instantiate(this.goldAnim);
                this.goldPar.addChild(goldAnim);
                goldAnim.y = 37;
                goldAnim.children[0].getComponent(cc.Label).string = "+" + _data.index.toFixed(0);
                cc.tween(goldAnim)
                    .to(1, { y: goldAnim.y + 100, opacity: 100 })
                    .call(() =>
                    {
                        goldAnim.destroy();
                    })
                    .start()
                this.informwarhouse(_data.v);
                if (_data.v >= LEVELLOCK[GameSys.level].gold)
                {
                    //升级,可以在这里加个动画TODO
                    GameSys.level++;

                    GameSys.game.xSet(Config.LEVEL, GameSys.level)
                    GameSys.game.xSet(Config.PROPADDS)
                    this.lvl_lab.string = "LV:" + GameSys.level.toString();

                    let len = StaticManager.getInstance().open_buildings.length
                    for (let i = len; i < LOCK_ROOM.length; i++)
                    {
                        if (GameSys.level >= LOCK_ROOM[i])
                        {
                            StaticManager.getInstance().open_buildings.push(i);
                            GameSys.game.xSet(Config.LOCKROOMCHANGE, {
                                index: i,
                                state: true
                            })
                        }
                    }
                    cb();
                }
            }
            cb();
        }
        else
        {
            this.progress.progress = _data.v / LEVELLOCK[GameSys.level].gold
            // let goldAnim: cc.Node = cc.instantiate(this.goldAnim);
            // this.goldPar.addChild(goldAnim);
            // goldAnim.y = 0;
            // goldAnim.children[0].getComponent(cc.Label).string = "-" + _data.index.toFixed(0);
            // cc.tween(goldAnim)
            //     .to(0.2, { y: goldAnim.y - 40 })
            //     .delay(0.2)
            //     .call(() =>
            //     {
            //         goldAnim.destroy();
            //     })
            //     .start()
        }

    }
    show: boolean = false
    onTouch()
    {
        if (this.show)
            return
        this.show = true;
        this.experience.active = true;
        this.experience.children[2].getComponent(cc.Label).string = GameSys.game.xGet(Config.GOLD).v.toFixed(0) + "/" + LEVELLOCK[GameSys.level].gold.toFixed(0) + "(" + ((GameSys.game.xGet(Config.GOLD).v / LEVELLOCK[GameSys.level].gold) * 100).toFixed(0) + "%" + ")"
        this.experience.children[0].width = this.experience.children[2].getComponent(cc.Label).string.length + 300
        // this.experience.children[1].getComponent(cc.Label).string = "当前收益:" + "金币/每分钟"
        cc.tween(this.experience)
            .delay(2)
            .call(() =>
            {
                this.experience.active = false;
                this.show = false
            })
            .start()
    }
    informApp(v: number)
    {

        let appSelect: number
        for (let i = 0; i < APPEARANCE.length; i++)
        {
            if (i < 6)//玄关
            {
                appSelect = 0;
            }
            else if (i < 11)//商店
            {
                appSelect = 1;
            }
            else if (i < 16)//仓库
            {
                appSelect = 4;
            }
            else if (i < 19)//污水
            {
                appSelect = 5;
            }
            else if (i < 24)//洗手池
            {
                appSelect = 2;
            }
            else if (i < 28)//卫生间1
            {
                appSelect = 3;
            }
            else if (i < 31)//卫生间2
            {
                appSelect = 6;
            }
            else if (i < 34)//卫生间3
            {
                appSelect = 7;
            }
            if (v >= APPEARANCE[i].gold_A && !this.appearance[i].geta)
            {
                // console.log("玄关楼梯", this.appearance[i])
                //大于goldA的解锁金币，且未解锁
                GameSys.game.xSet(Config.INFORM, {
                    index: 1,
                    v: "有可解锁外观",
                    cb: () =>
                    {
                        GameSys.game.xSet(Config.HIDEALL, true)
                        GameSys.game.xSet(Config.APPITEM, {
                            index: i,
                            state: true
                        })
                        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
                        PopupManager.show(PopupPath.buildings, options, PopupCacheMode.Frequent, PopupShowPriority.None)
                        GameSys.game.xSet(Config.HIDESHOP, false)
                        GameSys.game.xSet(Config.APPSELECT, appSelect)
                        GameSys.game.xSet(Config.MAGNIFY, {
                            index: appSelect,
                            state: true
                        })
                    }
                })
                break;
            }
            if (v >= APPEARANCE[i].gold_S && !this.appearance[i].gets)
            {
                //大于goldA的解锁金币，且未解锁
                GameSys.game.xSet(Config.INFORM, {
                    index: 1,
                    v: "有可解锁外观",
                    cb: () =>
                    {
                        GameSys.game.xSet(Config.HIDEALL, true)
                        GameSys.game.xSet(Config.APPITEM, {
                            index: i,
                            state: true
                        })
                        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
                        PopupManager.show(PopupPath.buildings, options, PopupCacheMode.Frequent, PopupShowPriority.None)
                        GameSys.game.xSet(Config.HIDESHOP, false)
                        GameSys.game.xSet(Config.APPSELECT, appSelect)
                        GameSys.game.xSet(Config.MAGNIFY, {
                            index: appSelect,
                            state: true
                        })
                    }
                })
                break;
            }
        }
    }
    informwarhouse(v: number)
    {
        for (let i = 0; i < WAREHOUSE.length; i++)
        {
            if (GameSys.level > WAREHOUSE[i].lock)
            {
                if (v >= WAREHOUSE[i].buy && GameSys.game.xGet(Config.WAREHOUSE).indexOf(WAREHOUSE[i].ID - 1) == -1)
                {
                    GameSys.game.xSet(Config.INFORM, {
                        index: 3,
                        v: "有新工具解锁",
                        cb: () =>
                        {
                            const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
                            PopupManager.show(PopupPath.warehouse, options, PopupCacheMode.Frequent, PopupShowPriority.None)
                        }
                    })
                    break;
                }
            }
        }
    }
    informRecurit(v: number)
    {
        for (let i = 0; i < RECRUIT.length; i++)
        {
            if (v >= RECRUIT[i].price && GameSys.game.xGet(Config.RECRUIT)[i] == 0)
            {
                GameSys.game.xSet(Config.INFORM, {
                    index: 4,
                    v: "有新员工招募",
                    cb: () =>
                    {
                        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
                        PopupManager.show(PopupPath.recruit, options, PopupCacheMode.Frequent, PopupShowPriority.None)
                    }
                })
                break;
            }
        }
    }
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
