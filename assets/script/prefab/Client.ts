import Caches from "../common/manager/Caches";
import { BUILDINGS, CLIENT, Config, EARNINGS, Finally_Toilet, Garbage, HandDown, In_BUILDINGS, In_Client, In_Save_Buildings, In_Save_Shop, JSON_PATH, LEAVE_POS, LOO_LOOKON, LOO_POS, LOO_QUEUE, PopupPath, Pre_Toilet, SETTLE, SHOP, SHOP_AGAIN, SHOP_POS, SHOP_QUEUE, TOILET_POS_1, TOILET_POS_2, TOILET_POS_3, TOILET_QUEUE_1, TOILET_QUEUE_2, TOILET_QUEUE_3 } from "../common/manager/Config";
import DataManager from "../common/manager/DataManager";
import GameSys from "../common/manager/GameSys";
import MathManager from "../common/manager/MathManager";
import PoolManager from "../common/manager/PoolManager";
import PopupManager, { PopupCacheMode, PopupShowPriority } from "../common/manager/PopupManager";
import StaticManager from "../common/manager/StaticManager";
import UtilsManager from "../common/manager/UtilsManager";
import Production from "./Production";

const { ccclass, property } = cc._decorator;
interface inbuildings
{
    level: number,
    index: number,
}
let BINDER_NAME = "client"
@ccclass
export default class Client extends cc.Component
{
    @property(dragonBones.ArmatureDisplay)
    dragonName: dragonBones.ArmatureDisplay = null;
    @property(cc.Node)
    info: cc.Node = null;

    @property(cc.Sprite)
    spr: cc.Sprite = null;

    private gotoloo: boolean = false;
    private notLeave: boolean = false;//判断是否离开
    private buildings: In_Save_Buildings[] = [];//
    private dragons: dragonBones.AnimationState;
    private odds: number[] = []
    private props: In_Client[] = []
    private index: number = 0;
    private curPos: cc.Vec2 = cc.v2(0, 0)
    private endPos: cc.Vec2 = cc.v2(0, 0)
    private typeIndex: number = 0;//房间类型下标，0洗手台，1左一，2右一，3右二
    private lower: number = 0;
    private upper: number = 3;
    //购买货物中
    private buy_time = 0;
    private fall_index: number = 0;
    private goods: number = 0;

    private grid: number = 40;//格子大小
    private v: number = 0;//生成顾客的种类
    private _posIndex: number;
    private count: number = 0;
    // private use_end: boolean = false;

    // private animation: string[] = ["", "移动-左上", "移动-右下", "卫生间使用-前", "卫生间使用-后", "洗手池使用-前", "洗手池使用-中", "洗手池使用-后", "结账"]
    /**
     * 
     * @param path A*最短路径
     * @param startPos 开始位置
     * @param v 生成顾客的样式
     * @param _index 当前生成的第几个顾客
     * @param _posIndex 当前顾客处于16个位置的哪个位置
     */
    private time: number = 0.7
    private dragonsName: string[] = ["顾客-背锅侠", "顾客-狐狸", "顾客-树妖"]
    initPath(path: any[], startPos: cc.Vec2, _posIndex: number, count: number)
    {
        if (!Caches.get(Caches.newGuide))
        {
            console.log("时间")
            this.time = 0.2;
        }
        this.dragonName.armatureName = this.dragonsName[Math.floor(Math.random() * 3)]
        this.count = count
        this.change_propAdds();
        let index = path.length - 1;
        this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-左上", 0)
        let _cb = () =>
        {
            if (path.length > 0)
            {
                // console.log("判别方向", path[index].type)
                //写在这里容易一跳一跳
                index--
                if (index < 0)
                {
                    this.unschedule(_cb)
                    this.onTouchBuy();
                    return;
                }
                if (path[index].x == 19 && path[index].y == 8)
                {
                    this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                }
                if (path[index].x == 22 && path[index].y == 11)
                {
                    this.showProp();
                }
                this.curPos.x = path[index].x
                this.curPos.y = path[index].y
                this.node.zIndex = 24 - path[index].y
                // this.node.stopAllActions();
                cc.tween(this.node)
                    .to(this.time, { x: 2 + path[index].x * (this.grid + 2) + this.grid / 2, y: 2 + path[index].y * (this.grid + 2) + this.grid / 2 })
                    .start()
            }
            else
            {
                this.unschedule(_cb)
            }
        }
        this.unschedule(_cb)
        this._posIndex = _posIndex
        this.node.x = 2 + startPos.x * (this.grid + 2) + this.grid / 2
        this.node.y = 2 + startPos.y * (this.grid + 2) + this.grid / 2
        this.schedule(_cb, this.time)
        GameSys.game.xBind(Config.PROPADDS, this.change_propAdds.bind(this), this.count.toString());
    }
    onLoad()
    {
        if (!Caches.get(Caches.newGuide))
        {
            GameSys.game.xBind(Config.NEWGUIDECON, this.move.bind(this), BINDER_NAME)
        }
    }
    //#region  保留
    private shop_queue: number = -1;
    queue_shop()
    {
        this.dragonName.armatureName = this.dragonsName[Math.floor(Math.random() * 3)]

        let flag_queue: number = -1;
        MathManager.getInstance().visitLinearArray(StaticManager.getInstance().shop_queue, (i) =>
        {
            if (StaticManager.getInstance().shop_queue[i])
            {
                flag_queue = i;
            }
        })
        //开始排队
        this.curPos = cc.v2(27, 1)
        this.node.x = 2 + this.curPos.x * (this.grid + 2) + this.grid / 2
        this.node.y = 2 + this.curPos.y * (this.grid + 2) + this.grid / 2
        if (flag_queue != -1)
        {
            StaticManager.getInstance().shop_queue[flag_queue + 1] = true
            let endpos = SHOP_QUEUE[flag_queue + 1];
            this.shop_queue = flag_queue + 1;
            this.leave(endpos);
        }
        else
        {
            StaticManager.getInstance().shop_queue[0] = true
            let endpos = SHOP_QUEUE[0];
            this.shop_queue = 0;
            this.leave(endpos);
        }
        GameSys.game.xBind(Config.SHOP_POS_CHANGE, this.shop_change.bind(this), BINDER_NAME)
    }

    shop_change()
    {
        if (this.shop_queue == -1)
        {
            return
        }
        let cb = () =>
        {
            let pos: number[] = [];
            MathManager.getInstance().visitLinearArray(GameSys.game.xGet(Config.SHOP_POS), (i) =>
            {
                if (GameSys.game.xGet(Config.SHOP_POS)[i] != 1)
                {
                    pos.push(i)
                }
            })

            console.error("可能没东西", pos, GameSys.game.xGet(Config.SHOP_POS))
            if (pos.length > 0)
            {
                let index = Math.floor(Math.random() * pos.length)
                GameSys.game.xGet(Config.SHOP_POS)[pos[index]] = 1;

                GameSys.game.xSet(Config.SHOP_POS, GameSys.game.xGet(Config.SHOP_POS))
                let posShopEnd = SHOP_POS[pos[index]];
                let posEnd = cc.v2(22, 11)
                this.leave(posEnd, () =>
                {
                    this.showProp();
                    this.leave(posShopEnd, () =>
                    {
                        this._posIndex = pos[index]
                        this.onTouchBuy()
                    })
                })
            }

        }
        if (this.shop_queue != -1)
        {
            if (this.shop_queue == 0)
            {
                StaticManager.getInstance().shop_queue[0] = false;
                this.shop_queue = -1;
                cb && cb();
            }
            else
            {
                if (StaticManager.getInstance().shop_queue[this.shop_queue - 1] == false)
                {
                    StaticManager.getInstance().shop_queue[this.shop_queue] = false;
                    this.shop_queue = this.shop_queue - 1;
                    StaticManager.getInstance().shop_queue[this.shop_queue] = true;
                    cb && cb();
                }
            }
        }


    }
    //#endregion
    //道具几率

    change_propAdds()
    {
        this.odds = []
        let temp: number = 0;
        MathManager.getInstance().visitLinearArray(CLIENT, (i) =>
        {
            if (GameSys.level >= CLIENT[i].lock)
            {
                temp = temp + CLIENT[i].odds;
                this.odds.push(temp)
                this.props.push(CLIENT[i])
            }
        })
        // console.log("道具几率", this.props)
    }
    //道具展示
    async showProp()
    {
        let index = Math.random() * this.odds[this.odds.length - 1];
        // console.log("道具展示", index)
        // index = 0
        for (let i = 0; i < this.odds.length; i++)
        {
            if (index <= this.odds[i])
            {
                this.spr.node.active = true;
                this.spr.node.scale = 3.5
                // this.dragons.stop()
                this.index = this.props[i].ID
                // console.error("===", this.props[i], this.index)
                let spriteFrame: cc.SpriteFrame = await UtilsManager.loadImage("head/" + this.props[i].prop) as cc.SpriteFrame
                this.spr.spriteFrame = spriteFrame
                this.spr.node.setContentSize(spriteFrame.getOriginalSize())
                break;
            }
        }
    }

    //购买
    onTouchBuy()
    {
        let shop: In_Save_Shop = GameSys.game.xGet(Config.SHOP);
        // console.error("+++", shop[this.index], this.index)
        let cb_buy = () =>
        {
            let shop: In_Save_Shop = GameSys.game.xGet(Config.SHOP);
            // console.error("货物", shop[this.index])
            if (shop[this.index].count > 0)
            {
                this.dragons.stop()
                this.goods = -1
                GameSys.game.xSet(Config.SHOPCHANGE, {
                    ID: shop[this.index].ID,
                    count: shop[this.index].count - 1,
                })
                this.spr.node.active = false;
                this.node.scaleX = -0.17
                this.leave(SETTLE, () =>
                {
                    this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("结账", 1)
                    this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, (event) =>
                    {
                        this.goldAnim(SHOP[this.index].sell, true)
                        this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                        GameSys.game.xSet(Config.SHOP_POS_CHANGE, this._posIndex);//这里有货无货需要改变？？？TODO
                        this.dragons.play()
                        this.selectGo()

                        //TODO:如果买的是饮料就出去吧
                        // if (shop[this.index].ID == 4)
                        // {
                        //     this.leave_again()
                        // }
                        // else if (shop[this.index].ID == 3)//洗手间
                        // {
                        //     //更细一层判断  几个洗手间，几个在使用
                        // }
                        // else
                        // {
                        //     //TODO:这里做区分是去往哪个卫生间  可以考虑数组
                        //     this.goto_Loo()
                        // }
                    })
                })
            }
        }
        //TODO:1.判断是否有货
        if (shop[this.index].count <= 0)
        {
            //2):无货
            //TODO:提醒卖家进货
            // GameSys.game.xSet(Config.TIP, '无货');
            GameSys.game.xSet(Config.STOCKOUT, {
                index: this.index,
                v: true
            })//缺货
            GameSys.game.xSet(Config.INFORM, {
                index: 0,
                v: "商店商品不足",
                cb: () =>
                {
                    const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
                    PopupManager.show(PopupPath.shop, options, PopupCacheMode.Frequent, PopupShowPriority.None)
                }
            })
            let _cb = () =>
            {
                if (this.goods == -1)
                {
                    this.unschedule(_cb)
                    return;
                }
                this.goods++;

                if (this.goods >= 3)
                {
                    this.unschedule(_cb)

                    // this.leave_entirely()
                    this.selectGo()
                    return;
                }
                cb_buy();
            }
            this.schedule(_cb, 1, 3)
        }
        else
        {
            cb_buy();
        }

    }

    //判断能不能进入Loo还是直接排队
    judge_go(index: number)
    {
        if (this.typeIndex != index)
            return
        if (this.loo_queue == -1)
        {
            // console.log("+++++", index, this.typeIndex)
            return
        }
        this.buildings = GameSys.game.xGet(Config.BUILDINGS);
        let can_use: inbuildings[] = []
        for (let i = this.lower; i < this.upper; i++)
        {
            if (this.buildings[i].level != 0 && StaticManager.getInstance().use_buildings[i] == false)
            {
                for (let j = 0; j < BUILDINGS.length; j++)
                {
                    if (BUILDINGS[j].level == this.buildings[i].level && BUILDINGS[j].index == i)
                    {
                        if (this.buildings[i].dirty < BUILDINGS[j].max_dirty)
                        {
                            can_use.push({ level: this.buildings[i].level, index: i })
                            break;
                        }
                    }
                }
            }
        }
        // console.log("========", can_use, this.loo_queue, this.typeIndex)
        if (this.typeIndex == 0)
        {
            this.judge_gotLoo(can_use);
        }
        else if (this.typeIndex == 1)
        {
            this.judge_gotToilet_1(can_use)
        }
        else if (this.typeIndex == 2)
        {
            this.judge_gotToilet_2(can_use)
        }
        else if (this.typeIndex == 3)
        {
            this.judge_gotToilet_3(can_use)
        }
    }
    judge_gotLoo(can_use: inbuildings[])
    {        // console.error("哪里问题", this.loo_queue)
        if (can_use.length > 0)
        {
            if (this.loo_queue != -1)
            {
                // console.error("================", this.loo_queue)
                if (this.loo_queue == 0)
                {
                    StaticManager.getInstance().loo_queue[0] = false;
                    this.loo_queue = -1;
                    this.can_goTo(can_use[0], LOO_POS, this.typeIndex);
                }
                else
                {
                    if (StaticManager.getInstance().loo_queue[this.loo_queue - 1] == false)
                    {
                        StaticManager.getInstance().loo_queue[this.loo_queue] = false;
                        this.loo_queue = this.loo_queue - 1;
                        StaticManager.getInstance().loo_queue[this.loo_queue] = true;
                        this.endPos = LOO_QUEUE[this.loo_queue]
                        this.dragons.play()
                        // this.node.scaleX = -0.17
                        this.leave(this.endPos, () =>
                        {
                            //感觉应该是在这里面去判断
                            this.dragons.stop()
                        })
                    }
                }
            }
        }
        else
        {
            // console.log("走到这里了emm")
            if (StaticManager.getInstance().loo_queue[this.loo_queue - 1] == false)
            {
                if (StaticManager.getInstance().loo_queue[this.loo_queue - 1] == false)
                {
                    StaticManager.getInstance().loo_queue[this.loo_queue] = false;
                    this.loo_queue = this.loo_queue - 1;
                    StaticManager.getInstance().loo_queue[this.loo_queue] = true;
                    this.endPos = LOO_QUEUE[this.loo_queue]
                    this.dragons.play()
                    // this.node.scaleX = -0.17
                    this.leave(this.endPos, () =>
                    {
                        this.dragons.stop()
                    })
                }
            }
        }
    }
    judge_gotToilet_1(can_use: inbuildings[])
    {
        // console.warn("绑定", can_use, this.loo_queue)
        if (can_use.length > 0)
        {
            if (this.loo_queue != -1)
            {
                // console.error("================", this.loo_queue)
                if (this.loo_queue == 0)
                {
                    StaticManager.getInstance().toilet_queue_1[0] = false;
                    this.loo_queue = -1;
                    this.can_goTo(can_use[0], TOILET_POS_1, this.typeIndex);
                }
                else
                {
                    if (StaticManager.getInstance().toilet_queue_1[this.loo_queue - 1] == false)
                    {
                        StaticManager.getInstance().toilet_queue_1[this.loo_queue] = false;
                        this.loo_queue = this.loo_queue - 1;
                        StaticManager.getInstance().toilet_queue_1[this.loo_queue] = true;
                        this.endPos = TOILET_QUEUE_1[this.loo_queue]
                        this.dragons.play()
                        // this.node.scaleX = -0.17
                        this.leave(this.endPos, () =>
                        {
                            //感觉应该是在这里面去判断
                            this.dragons.stop()
                        })
                    }
                }
            }
        }
        else
        {
            // console.log("走到这里了emm", StaticManager.getInstance().toilet_queue_1)
            if (StaticManager.getInstance().toilet_queue_1[this.loo_queue - 1] == false)
            {
                StaticManager.getInstance().toilet_queue_1[this.loo_queue] = false;
                this.loo_queue = this.loo_queue - 1;
                StaticManager.getInstance().toilet_queue_1[this.loo_queue] = true;
                this.endPos = TOILET_QUEUE_1[this.loo_queue]
                this.dragons.play()
                // this.node.scaleX = -0.17
                this.leave(this.endPos, () =>
                {
                    this.dragons.stop()
                })
            }
        }
    }
    judge_gotToilet_2(can_use: inbuildings[])
    {
        if (can_use.length > 0)
        {
            if (this.loo_queue != -1)
            {
                // console.error("================", this.loo_queue)
                if (this.loo_queue == 0)
                {
                    StaticManager.getInstance().toilet_queue_2[0] = false;
                    this.loo_queue = -1;
                    this.can_goTo(can_use[0], TOILET_POS_2, this.typeIndex);
                }
                else
                {
                    if (StaticManager.getInstance().toilet_queue_2[this.loo_queue - 1] == false)
                    {
                        StaticManager.getInstance().toilet_queue_2[this.loo_queue] = false;
                        this.loo_queue = this.loo_queue - 1;
                        StaticManager.getInstance().toilet_queue_2[this.loo_queue] = true;
                        this.endPos = TOILET_QUEUE_2[this.loo_queue]
                        this.dragons.play()
                        // this.node.scaleX = -0.17
                        this.leave(this.endPos, () =>
                        {
                            //感觉应该是在这里面去判断
                            this.dragons.stop()
                        })
                    }
                }
            }
        }
        else
        {
            // console.log("走到这里了emm")
            if (StaticManager.getInstance().toilet_queue_2[this.loo_queue - 1] == false)
            {
                StaticManager.getInstance().toilet_queue_2[this.loo_queue] = false;
                this.loo_queue = this.loo_queue - 1;
                StaticManager.getInstance().toilet_queue_2[this.loo_queue] = true;
                this.endPos = TOILET_QUEUE_2[this.loo_queue]
                this.dragons.play()
                // this.node.scaleX = -0.17
                this.leave(this.endPos, () =>
                {
                    this.dragons.stop()
                })
            }
        }
    }
    judge_gotToilet_3(can_use: inbuildings[])
    {
        if (can_use.length > 0)
        {
            if (this.loo_queue != -1)
            {
                // console.error("================", this.loo_queue)
                if (this.loo_queue == 0)
                {
                    StaticManager.getInstance().toilet_queue_3[0] = false;
                    this.loo_queue = -1;
                    this.can_goTo(can_use[0], TOILET_POS_3, this.typeIndex);
                }
                else
                {
                    if (StaticManager.getInstance().toilet_queue_3[this.loo_queue - 1] == false)
                    {
                        StaticManager.getInstance().toilet_queue_3[this.loo_queue] = false;
                        this.loo_queue = this.loo_queue - 1;
                        StaticManager.getInstance().toilet_queue_3[this.loo_queue] = true;
                        this.endPos = TOILET_QUEUE_3[this.loo_queue]
                        this.dragons.play()
                        // this.node.scaleX = 0.17
                        this.leave(this.endPos, () =>
                        {
                            //感觉应该是在这里面去判断
                            this.dragons.stop()
                        })
                    }
                }
            }
        }
        else
        {
            // console.log("走到这里了emm")
            if (StaticManager.getInstance().toilet_queue_3[this.loo_queue - 1] == false)
            {
                StaticManager.getInstance().toilet_queue_3[this.loo_queue] = false;
                this.loo_queue = this.loo_queue - 1;
                StaticManager.getInstance().toilet_queue_3[this.loo_queue] = true;
                this.endPos = TOILET_QUEUE_3[this.loo_queue]
                this.dragons.play()
                // this.node.scaleX = 0.17
                this.leave(this.endPos, () =>
                {
                    this.dragons.stop()
                })
            }
        }
    }
    private loo_queue: number = -1;
    //写一个通用
    /**
     * 
     * @param can_use 某个类型可用的第一个
     * @param queue 某个房间的排队情况
     * @param pos 某个房间可用的位置
     * @param index 某个类型
     */
    can_goTo(can_use: inbuildings, target: cc.Vec2[], index: number)
    {
        this.unschedule(this.can_goTo)
        let buildings: In_BUILDINGS;
        for (let i = 0; i < BUILDINGS.length; i++)
        {
            if (BUILDINGS[i].level == can_use.level && BUILDINGS[i].index == can_use.index)
            {
                //找到当前条目
                buildings = BUILDINGS[i];
                StaticManager.getInstance().use_buildings[can_use.index] = true;
                // console.error(StaticManager.getInstance().use_buildings, can_use.index - index * 3)
                this.endPos = target[can_use.index - index * 3]
                this.leave(this.endPos, () =>
                {
                    this.spr.node.active = false
                    let pos = this.node.position;
                    let callback = () =>
                    {
                        GameSys.game.xSet(Config.LOOTIME, {
                            time: buildings.use_time + SHOP[this.index].use_time,
                            dirty: buildings.change_dirty + buildings.change_dirty * SHOP[this.index].clean,
                            _index: can_use.index,//0,1,2,3,4,5
                            _cb: () =>
                            {
                                if (!Caches.get(Caches.newGuide))
                                {
                                    if (GameSys.game.xGet(Config.NEWGUIDECON) == 19)
                                    {
                                        GameSys.game.xSet(Config.NEWGUIDECON, 20)
                                    }
                                }
                                DataManager.getInstance().packagingDrop(can_use.index, buildings.name);

                                if (index == 0)
                                {
                                    this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("洗手池使用-后", 1)
                                    this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, (event) =>
                                    {
                                        // console.log("后使用完成")
                                        // this.node.scaleX = -0.17
                                        this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                                        this.notLeave = true
                                        this.leave_again();
                                    })
                                }
                                else
                                {
                                    this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("卫生间使用-后", 1)
                                    this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, (event) =>
                                    {
                                        // console.log("后使用完成")
                                        this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                                        this.notLeave = true
                                        // this.node.stopAllActions();
                                        cc.tween(this.node)
                                            .to(1, { position: pos })
                                            .call(() =>
                                            {
                                                this.leave_again();
                                            })
                                            .start()
                                    })
                                }
                                //离开的时候一直看
                                //TODO：这里释放排队
                            }
                        })
                    }
                    if (index == 0)
                    {
                        this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("洗手池使用-前", 1)
                        this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, (event) =>
                        {
                            // console.log("前使用完成")
                            this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("洗手池使用-中", 0)
                            callback();
                        })
                    }
                    else
                    {
                        //可以再这里添加一些节点
                        //添加开门动画
                        // this.node.scaleX = 0.17
                        this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-左上", 0)
                        // callback()
                        // this.node.stopAllActions();
                        cc.tween(this.node)
                            .to(1, { position: Pre_Toilet[can_use.index] })
                            .call(() =>
                            {
                                this.node.scaleX = 0.17
                                this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("卫生间使用-前", 1)
                                cc.tween(this.node)
                                    .to(0.5, { position: Finally_Toilet[can_use.index] })
                                    .call(() =>
                                    {
                                        callback && callback()
                                    })
                                    .start()
                            })
                            .start()

                    }
                })
                return
            }
        }

    }

    //写一个公用
    /**
     * 
     * @param queue 某个房间可用的情况
     * @param cur_queue 当前是哪个排队进来
     * @param pos_queue 排队类型
     * @param lower 0  3  6  9
     * @param upper 3  6  9  12
     * @param index 某个类型
     */
    goto(pos_queue: cc.Vec2[], target: cc.Vec2[])
    {
        let flag_queue: number = -1;
        if (this.typeIndex == 0)
        {
            MathManager.getInstance().visitLinearArray(StaticManager.getInstance().loo_queue, (i) =>
            {
                if (StaticManager.getInstance().loo_queue[i])
                {
                    flag_queue = i;
                }
            })
        }
        else if (this.typeIndex == 1)
        {
            MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_1, (i) =>
            {
                if (StaticManager.getInstance().toilet_queue_1[i])
                {
                    flag_queue = i;
                }
            })
        }
        else if (this.typeIndex == 2)
        {
            MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_2, (i) =>
            {
                if (StaticManager.getInstance().toilet_queue_2[i])
                {
                    flag_queue = i;
                }
            })
        }
        else if (this.typeIndex == 3)
        {
            MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_3, (i) =>
            {
                if (StaticManager.getInstance().toilet_queue_3[i])
                {
                    flag_queue = i;
                }
            })
        }

        // console.warn(flag_queue)
        if (flag_queue != -1)//需要排队
        {
            if (this.typeIndex == 0)
            {
                StaticManager.getInstance().loo_queue[flag_queue + 1] = true
            }
            else if (this.typeIndex == 1)
            {
                StaticManager.getInstance().toilet_queue_1[flag_queue + 1] = true
            }
            else if (this.typeIndex == 2)
            {
                StaticManager.getInstance().toilet_queue_2[flag_queue + 1] = true
            }
            else if (this.typeIndex == 3)
            {
                StaticManager.getInstance().toilet_queue_3[flag_queue + 1] = true
            }
            this.endPos = pos_queue[flag_queue + 1]
            this.loo_queue = flag_queue + 1;
            // console.warn("|||||+++++", this.loo_queue)
            // console.log("++++", this.endPos);
            // this.arrive_loo = false;
            // this.node.scaleX = 0.17
            this.leave(this.endPos, () =>
            {
                this.dragons.stop()
                // this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
            })
        }
        else//不需要排队
        {
            this.buildings = GameSys.game.xGet(Config.BUILDINGS);
            let can_use: inbuildings[] = []
            // console.error(this.buildings)
            for (let i = this.lower; i < this.upper; i++)
            {
                if (this.buildings[i].level != 0 && StaticManager.getInstance().use_buildings[i] == false)
                {
                    for (let j = 0; j < BUILDINGS.length; j++)
                    {
                        if (BUILDINGS[j].level == this.buildings[i].level && BUILDINGS[j].index == i)
                        {
                            if (this.buildings[i].dirty < BUILDINGS[j].max_dirty)
                            {
                                can_use.push({ level: this.buildings[i].level, index: i })
                                break;
                            }
                        }
                    }
                }
            }
            // console.log("可用设备", can_use)
            //没有可用设备
            if (can_use.length == 0)
            {
                if (this.typeIndex == 0)
                {
                    StaticManager.getInstance().loo_queue[0] = true
                }
                else if (this.typeIndex == 1)
                {
                    StaticManager.getInstance().toilet_queue_1[0] = true
                }
                else if (this.typeIndex == 2)
                {
                    StaticManager.getInstance().toilet_queue_2[0] = true
                }
                else if (this.typeIndex == 3)
                {
                    StaticManager.getInstance().toilet_queue_3[0] = true
                }
                this.endPos = pos_queue[0];
                this.loo_queue = 0;
                // console.warn("|||||", this.loo_queue)
                // this.arrive_loo = false;
                // this.node.scaleX = 0.17
                this.leave(this.endPos, () =>
                {
                    this.dragons.stop()
                    this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                })
            }
            else
            {
                this.can_goTo(can_use[0], target, this.typeIndex)
            }
        }
        // console.error("生成", this.loo_queue, StaticManager.getInstance().toilet_queue_1)
    }
    //去往卫生间1。。。。
    goto_toilet_1()
    {
        //1.排队也排满了，是就赌气离开，并且不给小费
        let count = 0;
        this.typeIndex = 1

        this.lower = 3;
        this.upper = 6
        MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_1, (i) =>
        {
            if (StaticManager.getInstance().toilet_queue_1[i])
            {
                count++;
            }
        })
        if (count == StaticManager.getInstance().toilet_queue_1.length)
        {
            this.reconfirm()
            return
        }

        this.goto(TOILET_QUEUE_1, TOILET_POS_1)
        GameSys.game.xBind(Config.LEAVETOILETONE, this.judge_go.bind(this), this.count.toString());

    }
    //去往卫生间1。。。。
    goto_toilet_2()
    {
        let count = 0;
        this.typeIndex = 2
        this.lower = 6;
        this.upper = 9
        MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_2, (i) =>
        {
            if (StaticManager.getInstance().toilet_queue_2[i])
            {
                count++;
            }
        })
        if (count == StaticManager.getInstance().toilet_queue_2.length)
        {
            this.reconfirm()
            return
        }

        this.goto(TOILET_QUEUE_2, TOILET_POS_2)
        GameSys.game.xBind(Config.LEAVETOILETTWO, this.judge_go.bind(this), this.count.toString());

    } //去往卫生间1。。。。
    goto_toilet_3()
    {
        let count = 0;
        this.typeIndex = 3
        this.lower = 9;
        this.upper = 12
        MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_3, (i) =>
        {
            if (StaticManager.getInstance().toilet_queue_3[i])
            {
                count++;
            }
        })
        if (count == StaticManager.getInstance().toilet_queue_3.length)
        {
            this.reconfirm()
            return
        }

        this.goto(TOILET_QUEUE_3, TOILET_POS_3)
        GameSys.game.xBind(Config.LEAVETOILETTHERE, this.judge_go.bind(this), this.count.toString());

    }

    goto_Loo()
    {
        let count = 0;
        this.typeIndex = 0
        this.lower = 0;
        this.upper = 3
        MathManager.getInstance().visitLinearArray(StaticManager.getInstance().loo_queue, (i) =>
        {
            if (StaticManager.getInstance().loo_queue[i])
            {
                count++;
            }
        })
        if (count == StaticManager.getInstance().loo_queue.length)
        {
            this.reconfirm();
            return
        }
        this.gotoloo = true;
        this.goto(LOO_QUEUE, LOO_POS)

        GameSys.game.xBind(Config.LEAVELOO, this.judge_go.bind(this), this.count.toString());
    }
    reconfirm()
    {
        this.buildings = GameSys.game.xGet(Config.BUILDINGS);
        let can_use: inbuildings[] = []
        // console.error(this.buildings[3],"+++",BUILDINGS[])
        for (let i = this.lower; i < this.upper; i++)
        {
            if (this.buildings[i].level != 0 && StaticManager.getInstance().use_buildings[i] == false)
            {
                for (let j = 0; j < BUILDINGS.length; j++)
                {
                    if (BUILDINGS[j].level == this.buildings[i].level && BUILDINGS[j].index == i)
                    {
                        if (this.buildings[i].dirty < BUILDINGS[j].max_dirty)
                        {
                            can_use.push({ level: this.buildings[i].level, index: i })
                            break;
                        }
                    }
                }
            }
        }
        if (can_use.length !== 0)
        {
            // console.log("有可用设备")
            // GameSys.game.xSet(Config.LEAVELOO, this.typeIndex)
        }
        else
        {
            // console.log("mei有可用设备",)
        }
        this.info.active = true;
        this.spr.node.active = false;
        this.leave_entirely();
    }
    //离开前确认
    leave_again()
    {
        this.endPos = SHOP_AGAIN[Math.floor(Math.random() * SHOP_AGAIN.length)]
        this.leave(this.endPos, () =>
        {
            //TODO:离开前给小费
            //可以做一个金币扔上去的动画
            // this.gold.parent = this.node;
            // this.gold.setPosition(cc.v2(-60, 457))
            StaticManager.getInstance().goldCount++;

            let earnings: number = this.earnings();
            GameSys.game.xSet(Config.GOLDOFFLINECHANGE, {
                index: StaticManager.getInstance().goldCount % 2,
                state: earnings,
            })
            if (StaticManager.getInstance().goldCount % 2 == 1)
            {
                let time = Math.ceil((new Date().getTime() - StaticManager.getInstance().goldPreSecond) / 1000)
                GameSys.game.xSet(Config.GOLDOFFLINECHANGE, {
                    index: 2,
                    state: time
                })
            }
            else
            {
                StaticManager.getInstance().goldPreSecond = new Date().getTime()
            }
            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("结账", 1)
            this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, (event) =>
            {
                this.goldAnim(this.earnings(), false)
                this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                this.leave_entirely();
            })

        })
    }
    //彻底离开
    leave_entirely()
    {
        this.endPos = LEAVE_POS;
        // GameSys.game.xUnbind(this.count.toString())
        this.leave(this.endPos, () =>
        {
            // this.count = 0;
            // this.notLeave = false;
            // this.dragons = null;

            // this.odds = [];
            // this.props = []
            // this.index = 0;
            // this.curPos = cc.v2(0, 0)
            // this.endPos = cc.v2(0, 0)
            // this.typeIndex = 0;
            // this.lower = 0;
            // this.upper = 3;
            // this._posIndex = 0;
            // this.goods = 0;
            // this.buildings = []
            // this.loo_queue = -1
            // this.buy_time = 0;
            // this.fall_index = 0;
            // // this.unscheduleAllCallbacks();
            // // this.node.stopAllActions();
            // this.node.x = 0;
            // this.node.y = 0;
            // this.spr.node.active = false
            // this.spr.node.scale = 1
            // this.recycle_customer();
            // this.info.active = false
            // this.gotoloo = false;
            this.node.destroy();
        })
    }
    onDestroy()
    {
        GameSys.game.xUnbind(this.count.toString())
        GameSys.game.xUnbind(BINDER_NAME);
    }
    //结算收益
    earnings(): number
    {
        let earnings: number = EARNINGS[GameSys.level].level_earnings * GameSys.level + SHOP[this.index].jiesuan * GameSys.level;
        let level: number = 0;
        MathManager.getInstance().visitLinearArray(GameSys.game.xGet(Config.BUILDINGS), (i) =>
        {
            level += GameSys.game.xGet(Config.BUILDINGS)[i].level
        })
        // console.log("金币收益", earnings)
        return earnings += level * EARNINGS[GameSys.level].build_earnings
    }
    leave(endPos: cc.Vec2, _callback?: Function)
    {
        // this.node.stopAllActions();
        this.unschedule(this.leave)
        this.unscheduleAllCallbacks()
        Production.getInstance().posStart = this.curPos;
        Production.getInstance().posEnd = endPos;
        Production.getInstance().Map_Path = []
        Production.getInstance().Map_Path = MathManager.getInstance().transformArray(JSON_PATH)
        Production.getInstance().initMap();
        Production.getInstance().findPath(this.curPos, endPos)
        let path = Production.getInstance().path;
        // console.log(this.curPos, LEAVE_POS)
        let index = path.length - 1;
        let time = 0.5
        if (!Caches.get(Caches.newGuide))
        {
            time = 0.1
        }
        let _cb = () =>
        {
            if (path.length > 0)
            {
                index--
                if (index < 0)
                {
                    this.unschedule(_cb)
                    _callback && _callback()

                    return;
                }
                this.scheduleOnce(() =>
                {
                    if (!this.notLeave)
                    {
                        if (path[index].x == 17 && path[index].y == 10)
                        {
                            this.node.scaleX = 0.17
                            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-左上", 0)
                        }
                        if (!this.gotoloo)
                        {
                            if (path[index].x == 17 && path[index].y == 16)
                            {
                                this.node.scaleX = 0.17
                                this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                            }
                        }
                        if (path[index].x == 16 && path[index].y == 15)
                        {
                            this.node.scaleX = -0.17
                            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                        }
                        if (path[index].x == 33 && path[index].y == 22)
                        {
                            this.node.scaleX = -0.17
                            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                        }
                    }
                    else
                    {
                        if (path[index].x == 36 && path[index].y == 18)
                        {
                            this.node.scaleX = 0.17
                            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-左上", 0)
                        }
                        if (path[index].x == 33 && path[index].y == 23)
                        {
                            this.node.scaleX = -0.17
                            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                        }
                        if (path[index].x == 6 && path[index].y == 17)
                        {
                            this.node.scaleX = 0.17
                            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                        }
                    }
                }, time)

                let x = 2 + path[index].x * (this.grid + 2) + this.grid / 2
                let y = 2 + path[index].y * (this.grid + 2) + this.grid / 2
                //楼梯口修正
                if (path[index].x == 17 && path[index].y == 11)
                {
                    x += this.grid / 2
                    y -= this.grid / 2
                }
                //楼梯拐角修正
                if (path[index].x == 18 && path[index].y == 12)
                {
                    x = 2 + 19 * (this.grid + 2) + this.grid / 2
                    y = 2 + 12 * (this.grid + 2) + this.grid / 2
                }
                //第三个卫生间位置修正
                if (path[index].x == 37 && path[index].y == 18)
                {
                    x -= this.grid / 2
                    y += this.grid / 2
                }
                //出去位置修正
                if (path[index].x == 18 && path[index].y == 7)
                {
                    x += this.grid / 2
                }
                this.curPos.x = path[index].x
                this.curPos.y = path[index].y
                this.node.zIndex = 24 - path[index].y
                cc.tween(this.node)
                    .to(this.time, { x: x, y: y })
                    .start()

            }
            else
            {
                this.unschedule(_cb)
            }
        }
        this.unschedule(_cb)
        this.schedule(_cb, this.time)
    }

    onDisable()
    {
        // console.log("回收了", BINDER_NAME)
        // GameSys.game.xUnbind(BINDER_NAME)
    }
    /**
    * 
    * @param v 对象池下标
    * @param node 回收的节点
    * @param _index 销毁节点数组
    */
    recycle_customer()
    {
        PoolManager.getInstance().clearNodeList(this.node)
    }

    async selectGo()
    {
        //随便去哪 爱去哪去哪
        GameSys.game.xSet(Config.SHOP_POS_CHANGE, this._posIndex);
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 14)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 15)
            }
        }
        else
        {

            //应该有个判断
            let flag_2 = false;
            let flag_3 = false;
            for (let i = 6; i < 9; i++)
            {
                this.buildings = GameSys.game.xGet(Config.BUILDINGS);
                if (this.buildings[i].level != 0)
                {
                    flag_2 = true;
                }
            }
            for (let i = 9; i < 12; i++)
            {
                this.buildings = GameSys.game.xGet(Config.BUILDINGS);
                if (this.buildings[i].level != 0)
                {
                    flag_3 = true;
                }
            }
            let open_buildings: number[] = [0, 1]
            if (flag_2)
            {
                open_buildings.push(2)
            }
            if (flag_3)
            {
                open_buildings.push(3)
            }
            // console.error("查看", open_buildings)
            this.fall_index = open_buildings[Math.floor(Math.random() * open_buildings.length)];
            // this.fall_index = 2
            this.conmove();
        }
    }
    move()
    {
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 18)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 19)
                this.fall_index = 0;
                this.conmove();

            }
        }
    }
    async conmove()
    {
        // this.fall_index = 1;
        this.spr.node.active = true;
        this.spr.node.scale = 1.5;
        let spriteFrame: cc.SpriteFrame = null;

        if (this.fall_index == 0)
        {
            spriteFrame = await UtilsManager.loadImage("staffState/loo") as cc.SpriteFrame
        }
        else
        {
            spriteFrame = await UtilsManager.loadImage("staffState/toilet") as cc.SpriteFrame
        }
        this.spr.spriteFrame = spriteFrame
        this.spr.node.setContentSize(spriteFrame.getOriginalSize())

        this.node.scaleX = -0.17
        // this.goto_Loo()
        if (this.fall_index == 0)
        {
            this.goto_Loo();
        }
        else if (this.fall_index == 1)
        {
            this.goto_toilet_1();
        }
        else if (this.fall_index == 2)
        {
            this.goto_toilet_2();
        }
        else if (this.fall_index == 3)
        {
            this.goto_toilet_3();
        }
    }
    goldAnim(price: number, click: boolean)
    {
        if (parseInt(price.toFixed(0)) !== 0)
        {
            let canvas: cc.Node = cc.find("Canvas")
            let target: cc.Node = canvas.getChildByName("zone").getChildByName("target");
            let pos: cc.Vec3 = target.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)))
            GameSys.game.xSet(Config.INSTANTIATEGOLD, {
                price: price,
                pos: pos,
                click: click
            })
        }
    }
}
