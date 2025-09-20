import { CLEAN_POS, Config, Finally_Toilet, In_RECRUIT, In_Save_Buildings, JSON_PATH, LOO_POS, Pre_Toilet, WAREHOUSE } from "../common/manager/Config";
import DataManager from "../common/manager/DataManager";
import GameSys from "../common/manager/GameSys";
import MathManager from "../common/manager/MathManager";
import StateManager from "../common/manager/StateManager";
import StaticManager from "../common/manager/StaticManager";
import UtilsManager from "../common/manager/UtilsManager";
import Production from "./Production";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Staff'
@ccclass
export default class Staff extends cc.Component
{
    @property(dragonBones.ArmatureDisplay)
    dragonName: dragonBones.ArmatureDisplay = null;
    @property(StateManager)
    state: StateManager = null;
    @property(cc.Sprite)
    circle: cc.Sprite = null;

    private dragons: dragonBones.AnimationState;
    private grid: number = 40;//格子大小
    private curPos: cc.Vec2 = cc.v2(0, 0)
    private endPos: cc.Vec2 = cc.v2(0, 0)
    private working: boolean = false;//是否正在工作，休息也算成工作
    private index: number = 0;
    private recruit: In_RECRUIT;
    public time: number = 1;
    private ID: number = 0;
    private value: number = 0;
    private dragonsName: string[] = ["员工-红色", "员工-大蒜", "员工-绿绿的", "员工-紫色", "员工-海盗", "员工-粉色洋葱", "员工-疤瘌眼", "员工-小眼镜"]
    async initPath(startPos: cc.Vec2, recruit: In_RECRUIT, _index: number)
    {
        this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
        this.index = _index;
        this.recruit = recruit;
        this.ID = recruit.ID - 1;
        this.dragonName.armatureName = this.dragonsName[this.ID];
        // this.node.getComponent(cc.Sprite).spriteFrame = await UtilsManager.loadImage(`staff/staff_${recruit.ID}`) as cc.SpriteFrame
        this.node.x = 2 + startPos.x * (this.grid + 2) + this.grid / 2
        this.node.y = 2 + startPos.y * (this.grid + 2) + this.grid / 2
        this.curPos.x = startPos.x
        this.curPos.y = startPos.y
        this.time = 1
        this.leave(false, this.endPos)
        // console.log(this.ID)
        GameSys.game.xBind(Config.RECRUITCHANGE, this.dismissal_change.bind(this), this.ID.toString())
        GameSys.game.xBind(Config.FIXLOO, this.fixLoo.bind(this), this.ID.toString())
    }
    //移动完以后，让他在场景中走来走去
    onLoad()
    {

    }
    dismissal_change(_data: { index: number, state: number })
    {
        if (_data.index == this.ID && _data.state == 0)
        {
            // console.error("====", this.ID, _data.index)
            this.node.destroy()
            GameSys.game.xUnbind(this.ID.toString())
        }
    }
    //还是让需要清洁的位置每隔一秒下发通知吧，不要让清洁人员每隔一秒去遍历
    fixLoo(_data: { index: number, value: number })
    {
        // console.log("最后没进来吗", this.working, this.index, _data.value)
        if (this.working)//处于休息或者工作时，不召唤他
            return
        if (_data.value == this.index)
        {

            DataManager.getInstance().setLeisure(_data.index, false)
            this.value = _data.value;
            this.working = true
            let indexOf = StaticManager.getInstance().staff.indexOf(_data.value)
            StaticManager.getInstance().staff.splice(indexOf, 1)
            // console.error("去清洁了", StaticManager.getInstance().staff)
            this.time = 0.5;
            let time = 0;
            let interval: number = 0;

            for (let i = 0; i < GameSys.game.xGet(Config.WAREHOUSE).length; i++)
            {
                time += WAREHOUSE[GameSys.game.xGet(Config.WAREHOUSE)[i]].result_1
                interval += WAREHOUSE[GameSys.game.xGet(Config.WAREHOUSE)[i]].result_2
            }
            this.interval = (this.recruit.time - interval) * 10
            let repeat = (this.recruit.efficiency - time) * 10
            // console.error("+++++", CLEAN_POS[_data.index])
            this.leave(true, CLEAN_POS[_data.index], () =>
            {
                let pos = this.node.position;
                let callbck = () =>
                {
                    this.circle.node.active = true;
                    this.circle.node.scale = 0.4;
                    this.circle.fillRange = 0;
                    let _cb = () =>
                    {
                        this.circle.fillRange += 1 / repeat;
                        if (this.circle.fillRange >= 1)
                        {
                            this.unschedule(_cb)
                            let cb = () =>
                            {
                                let buildings: In_Save_Buildings[] = GameSys.game.xGet(Config.BUILDINGS)

                                this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                                GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                                    index: _data.index,
                                    level: buildings[_data.index].level,
                                    dirty: 0,
                                    upgrade: buildings[_data.index].upgrade
                                })
                                DataManager.getInstance().setLeisure(_data.index, true)
                                StaticManager.getInstance().use_buildings[_data.index] = false;
                                console.error("清洁完成", _data.index / 3)
                                if (Math.floor(_data.index / 3) == 0)
                                {
                                    GameSys.game.xSet(Config.LEAVELOO, 0);
                                }
                                else if (Math.floor(_data.index / 3) == 1)
                                {
                                    GameSys.game.xSet(Config.LEAVETOILETONE, 1);
                                }
                                else if (Math.floor(_data.index / 3) == 2)
                                {
                                    GameSys.game.xSet(Config.LEAVETOILETTWO, 2);
                                } else if (Math.floor(_data.index / 3) == 3)
                                {
                                    GameSys.game.xSet(Config.LEAVETOILETTHERE, 3);
                                }
                                // GameSys.game.xSet(Cosnfig.LEAVELOO, Math.floor(_data.index / 3));//存在的问题是，顾客还没获得货物的情况下，this.unsc
                                this.time_boolean = true;
                                this.circle.node.scale = 0.4;
                                this.circle.fillRange = 0;
                                this.time = 1;
                                this.leave(false, this.endPos)
                            }
                            if (_data.index < 3)
                            {
                                this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("洗手池使用-后", 1)
                                this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, (event) =>
                                {
                                    // console.log("后使用完成")
                                    cc.tween(this.node)
                                        .to(1, { position: pos })
                                        .call(() =>
                                        {
                                            cb && cb()
                                        })
                                        .start()
                                })
                            }
                            else
                            {
                                this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("卫生间使用-后", 1)
                                this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, (event) =>
                                {
                                    // console.log("后使用完成")
                                    cb && cb()
                                })
                            }
                        }
                    }
                    this.schedule(_cb, 0.1, repeat, 0.1)
                }
                if (_data.index < 3)
                {
                    this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("洗手池使用-前", 1)
                    this.node.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, (event) =>
                    {
                        // console.log("后使用完成")
                        this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("洗手池使用-中", 0)
                        callbck && callbck();
                    })
                }
                else
                {
                    this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-左上", 0)
                    cc.tween(this.node)
                        .to(1, { position: Pre_Toilet[_data.index] })
                        .call(() =>
                        {
                            this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("卫生间使用-前", 0)
                            callbck && callbck();
                        })
                        .start()

                }
            })
        }
    }
    leave(work: boolean, endPos: cc.Vec2, _callback?: Function)
    {
        this.unscheduleAllCallbacks()
        Production.getInstance().posStart = this.curPos;
        // console.log("==========", Production.getInstance().gridsList)
        Production.getInstance().limit_pos();
        if (!work)
        {
            this.state.stateChange(0)
            let index = Math.floor(Math.random() * (Production.getInstance().all_move.length))
            endPos = Production.getInstance().all_move[index];
        }
        else
        {
            this.state.stateChange(1)
        }
        Production.getInstance().posEnd = endPos;
        Production.getInstance().Map_Path = [];
        Production.getInstance().Map_Path = MathManager.getInstance().transformArray(JSON_PATH)

        Production.getInstance().initMap();
        Production.getInstance().findPath(this.curPos, endPos)
        let path = Production.getInstance().path;
        let index = path.length - 1;
        if (index > 0)
        {
            if (Production.getInstance().posEnd.x > Production.getInstance().posStart.x)
            {
                this.node.scaleX = 0.17
                this.node.scaleY = 0.17
                this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
            }
            else
            {
                this.node.scaleX = -0.17
                this.node.scaleY = 0.17
                this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
            }
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
                    if (!work)
                    {
                        this.leave(false, endPos)
                    }
                    return;
                }
                this.scheduleOnce(() =>
                {
                    if (index - 1 >= 0)
                    {

                        if (path[index].x == 11 && path[index].y == 15)
                        {
                            if (endPos.x > path[index].x)
                            {
                                this.node.scaleX = 0.17
                                this.node.scaleY = 0.17
                            }
                            else
                            {
                                this.node.scaleX = -0.17
                                this.node.scaleY = 0.17
                            }
                            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                        }
                        if (path[index - 1].x == 10 && path[index - 1].y == 11)
                        {
                            if (path[index].x == 10 && path[index].y == 10)
                            {
                                this.node.scaleX = 0.17
                                this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-左上", 0)
                            }
                        }
                        if (path[index].x == 17 && path[index].y == 15)
                        {
                            if (endPos.x > path[index].x)
                            {
                                this.node.scaleX = 0.17
                                this.node.scaleY = 0.17
                            }
                            else
                            {
                                this.node.scaleX = -0.17
                                this.node.scaleY = 0.17
                            }
                            this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-右下", 0)
                        }
                        if (path[index - 1].x == 17 && path[index - 1].y == 11)
                        {
                            if (path[index].x == 17 && path[index].y == 10)
                            {
                                this.node.scaleX = 0.17
                                this.node.scaleY = 0.17
                                this.dragons = this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("移动-左上", 0)
                            }
                        }
                    }
                }, 0.5)


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
                //zuo1楼梯
                if (path[index].x == 10 && path[index].y == 15)
                {
                    x += this.grid / 2
                    y -= this.grid / 2
                }
                //zuo1楼梯
                if (path[index].x == 9 && path[index].y == 14)
                {
                    x += this.grid / 2
                    y -= this.grid / 2
                }
                //zuo1楼梯
                if (path[index].x == 10 && path[index].y == 12)
                {
                    x -= this.grid / 2
                    y -= this.grid / 2
                }
                //zuo1楼梯
                if (path[index].x == 10 && path[index].y == 10)
                {
                    y -= this.grid / 2
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
                if (!work)
                {
                    this.leave(false, endPos)
                }
            }
        }
        this.unschedule(_cb)

        this.schedule(_cb, this.time)
    }

    private time_circle: number = 0
    private time_boolean: boolean = false
    private interval: number = 0;
    update(dt: number)
    {
        if (!this.time_boolean)
            return
        this.time_circle += dt;
        if (this.time_circle >= 0.1)
        {
            this.circle.fillRange += 1 / this.interval;
            if (this.circle.fillRange >= 1)
            {
                console.log("没回去吗")
                this.time_boolean = false;
                this.circle.node.active = false;
                this.working = false;
                StaticManager.getInstance().staff.push(this.value)
            }
            this.time_circle = 0
        }
    }
    onDestory()
    {

        GameSys.game.xUnbind(this.ID.toString())
    }
}
