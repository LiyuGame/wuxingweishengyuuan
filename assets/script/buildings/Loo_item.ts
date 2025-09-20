import Caches from "../common/manager/Caches";
import { BUILDINGS, CLEANGARBAGE, Config, In_BUILDINGS, In_Garbage, In_Hand_Down, In_Save_Buildings, LOO_POS, PopupPath, WUPIN, WUZI } from "../common/manager/Config";
import DataManager from "../common/manager/DataManager";
import GameSys from "../common/manager/GameSys";
import MathManager from "../common/manager/MathManager";
import PopupManager, { PopupCacheMode, PopupShowPriority } from "../common/manager/PopupManager";
import StaticManager from "../common/manager/StaticManager";
import UtilsManager from "../common/manager/UtilsManager";
import Garbage_Smear from "../prefab/Garbage";
import Loo_goods from "./Loo_goods";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Loo_item'
@ccclass
export default class Loo_Item extends cc.Component
{
    @property(cc.Prefab)
    graphics: cc.Prefab = null;
    @property(cc.Prefab)
    goods: cc.Prefab = null;
    @property(cc.Node)
    red: cc.Node = null
    @property(cc.Sprite)
    spr: cc.Sprite = null;
    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;
    @property(cc.Label)
    dirty_lab: cc.Label = null;

    @property(cc.Sprite)
    circle: cc.Sprite = null;

    //标记清楚
    @property
    index: number = 0;

    initPar: cc.Node = null;
    //换一种思路，不去生成，就置为false
    private buildings_save: In_Save_Buildings[] = []
    private buildings: In_BUILDINGS;

    private room: string[] = ["洗手间", "卫生间1", "卫生间2", "卫生间3"]
    onEnable()
    {
        BINDER_NAME = BINDER_NAME + '_' + this.index.toString();//绑定做区分,Loo_item_0;Loo_item_1;Loo_item_2;
        this.judge_buildings();
        this.circle.node.opacity = 125
        //进来判断要不要清洁垃圾
        if (this.buildings)
        {
            // console.error("当前值", this.buildings_save[this.index].dirty, this.buildings.max_dirty, this.index)
            if (this.buildings_save[this.index].dirty >= this.buildings.max_dirty)
            {
                //没有空闲就一直访问，有空闲就停止

                let _cb = () =>
                {
                    this.count++;
                    if (StaticManager.getInstance().staff.length > 0)
                    {
                        let value = StaticManager.getInstance().staff[Math.floor(Math.random() * StaticManager.getInstance().staff.length)];//这里还是要做修整
                        GameSys.game.xSet(Config.FIXLOO, {
                            index: this.index,
                            value: value
                        })
                    }
                    // console.log("++++", this.index, this, this.count, StaticManager.getInstance().staff, DataManager.getInstance().getLeisure(this.index))

                    //还是这里有问题，想一想
                    if (!DataManager.getInstance().getLeisure(this.index))
                    {
                        this.unschedule(_cb)
                        return
                    }
                    if (this.count % 4 == 0)
                    {
                        //直接添加掉落
                        console.log("掉落")
                        DataManager.getInstance().setClean(this.index, true)
                        DataManager.getInstance().packagingGarbage(this.index);
                    }
                    // console.error("=====")
                }
                this.schedule(_cb, 1, 3)

            }
        }
        this.initPar = this.spr.node.parent;

        this.red.width = 60;
        this.red.height = 60;

        if (!Caches.get(Caches.newGuide))
        {
            GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                index: 0,
                dirty: 0,
                level: 1,
                upgrade: 0
            })
        }
    }
    start()
    {
        GameSys.game.xBind(Config.LOOTIME, this.change_dirty.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.BUILDINGSCHANGE, this.change_level.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.FALLINGRED, this.change_red.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME)

        GameSys.game.xBind(Config.FALLINGGOODS, this.add_fallings.bind(this), BINDER_NAME);
        GameSys.game.xBind(Config.GRAPHICS, this.change_graphics.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.RECRUITCHANGE, this.recruit_change.bind(this), BINDER_NAME)
    }
    hideAll(v: boolean)
    {
        if (v)
        {
            this.circle.node.opacity = 0
            this.node.children[1].opacity = 0
            this.progress.node.opacity = 0
            this.red.getComponent(cc.Sprite).enabled = false;
        }
        else
        {
            this.red.getComponent(cc.Sprite).enabled = true;
            this.node.children[1].opacity = 255
            this.progress.node.opacity = 255
            this.circle.node.opacity = 125
        }
    }
    change_update(data: { index: number, v: boolean })
    {
        if (this.index == data.index)
        {
            this.progress.node.active = !data.v;
            this.node.children[1].active = !data.v;
        }
    }
    async judge_buildings()
    {
        this.buildings_save = GameSys.game.xGet(Config.BUILDINGS);
        for (let i = 0; i < BUILDINGS.length; i++)
        {
            if (BUILDINGS[i].level == this.buildings_save[this.index].level && BUILDINGS[i].index == this.buildings_save[this.index].index)
            {
                //找到当前条目
                this.buildings = BUILDINGS[i];
                break;
            }
        }
        if (this.buildings)
        {
            if (this.buildings_save[this.index].level != 0)
            {
                this.dirty_lab.string = this.buildings_save[this.index].dirty.toFixed(0).toString() + "/" + this.buildings.max_dirty.toString();
                this.progress.progress = this.buildings_save[this.index].dirty / this.buildings.max_dirty;
                let path = 'buildings/' + this.buildings.icon
                this.spr.spriteFrame = await UtilsManager.loadImage(path) as cc.SpriteFrame;
            }
        }

    }
    change_red(index: number)
    {
        if (index == this.index)
        {
            let flag = false;
            for (let i = 0; i < 2; i++)
            {
                if (StaticManager.getInstance().falllings[this.index][i] == 1)
                {
                    flag = true;
                }
            }
            if (!flag)
            {
                if (!Caches.get(Caches.newGuide))
                {
                    console.error("++++", GameSys.game.xGet(Config.NEWGUIDECON))
                    if (GameSys.game.xGet(Config.NEWGUIDECON) == 28)
                    {
                        this.spr.node.children[0].active = true;
                    }
                }
            }
            this.red.active = flag
        }

    }
    async change_level(_data: { index: number, level: number, dirty: number, upgrade: number })
    {
        //判断是否升级
        //1.建筑页面点击升级的时候能进来,升级页面
        //2.改变肮脏值的时候也能进来，什么也不做
        // console.log("为甚么没有升级", this.buildings_save[this.index])
        if (this.index == _data.index)
        {
            this.judge_buildings();
        }
    }
    /**
     * 
     * @param time 使用时间
     * @param dirty 变脏值
     */
    private count: number = 0;
    change_dirty(_data: { time: number, dirty: number, _index: number, _cb: Function })
    {
        // console.error("===", _data._index, this.index)
        if (_data._index !== this.index)
            return;
        // console.log("使用时间", _data._index)
        if (!Caches.get(Caches.newGuide))
        {
            _data.time = 1;
        }
        this.circle.node.active = true;
        this.circle.fillRange = 0;
        let cb = () =>
        {
            this.circle.fillRange += 1 / (_data.time * 10);
            if (this.circle.fillRange >= 1)
            {
                //使用完了脏脏值加加加加
                this.unschedule(cb)

                GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                    index: this.index,
                    level: this.buildings_save[this.index].level,
                    dirty: this.buildings_save[this.index].dirty + parseInt(_data.dirty.toFixed(0)),
                    upgrade: this.buildings_save[this.index].upgrade
                })
                //这里判断肮脏是否已满，是否要维修
                // console.error("当前", this.buildings_save[this.index].dirty)
                this.dirty_lab.string = this.buildings_save[this.index].dirty.toFixed(0).toString() + "/" + this.buildings.max_dirty.toString();
                this.progress.progress = this.buildings_save[this.index].dirty / this.buildings.max_dirty;
                // console.log("肮脏值", this.buildings_save[this.index].dirty + parseInt(_data.dirty.toFixed(0)), this.buildings.max_dirty)
                let buildings = GameSys.game.xGet(Config.BUILDINGS);
                // console.error("当前值", buildings[this.index].dirty, this.buildings.max_dirty)
                if (buildings[this.index].dirty >= this.buildings.max_dirty)
                {

                    //没有空闲就一直访问，有空闲就停止
                    let _cb = () =>
                    {
                        this.count++;
                        if (StaticManager.getInstance().staff.length > 0)
                        {
                            let value = StaticManager.getInstance().staff[Math.floor(Math.random() * StaticManager.getInstance().staff.length)];//这里还是要做修整
                            GameSys.game.xSet(Config.FIXLOO, {
                                index: this.index,
                                value: value
                            })
                        }
                        //还是这里有问题，想一想
                        if (!DataManager.getInstance().getLeisure(this.index))
                        {
                            this.unschedule(_cb)
                            return
                        }
                        if (this.count % 4 == 0)
                        {
                            //直接添加掉落
                            DataManager.getInstance().setClean(this.index, true)
                            DataManager.getInstance().packagingGarbage(this.index);
                        }
                        // console.error("=====")
                    }
                    this.schedule(_cb, 1, 3)

                }
                else
                {
                    StaticManager.getInstance().use_buildings[this.index] = false;//这里释放了
                    // console.log("释放", this.index, StaticManager.getInstance().use_buildings)
                }
                if (Math.floor(this.index / 3) == 0)
                {
                    GameSys.game.xSet(Config.LEAVELOO, 0);
                }
                else if (Math.floor(this.index / 3) == 1)
                {
                    GameSys.game.xSet(Config.LEAVETOILETONE, 1);
                }
                else if (Math.floor(this.index / 3) == 2)
                {
                    GameSys.game.xSet(Config.LEAVETOILETTWO, 2);
                } else if (Math.floor(this.index / 3) == 3)
                {
                    GameSys.game.xSet(Config.LEAVETOILETTHERE, 3);
                }
                this.circle.fillRange = 0;
                this.circle.node.active = false;
                _data._cb && _data._cb()
            }
        }
        this.unschedule(cb)
        this.schedule(cb, 0.1, _data.time * 10, 1)
        // this.schedule(() =>
        // {

        // }, 1, 1)
        //1秒后开始计时，1秒执行一次回调，执行time次（注：time-1是time次，time是time+1次）
    }
    async onTouchShow()
    {
        if (!this.red.active)
            return;
        if (GameSys.game.xGet(Config.HIDEALL))
            return

        DataManager.getInstance().cleanGarbageInfo = null;
        let clean: boolean = false;
        for (let i = 0; i < CLEANGARBAGE.length; i++)
        {
            if (CLEANGARBAGE[i].name == this.pathname)
            {
                DataManager.getInstance().cleanGarbageInfo = CLEANGARBAGE[i];
                break;
            }
        }
        if (DataManager.getInstance().cleanGarbageInfo != null)
        {
            DataManager.getInstance().garbageNode = this.graphicsNode;
            console.log(DataManager.getInstance().garbageNode)

            clean = true
        }


        GameSys.game.xSet(Config.BLOCK, {
            state: true,
            spr: true,
            clean: clean
        })
        let canvas: cc.Node = cc.find('Canvas')
        // GameSys.game.xSet(Config.CLEAN, {
        //     state: true,
        //     index: Math.floor(this.index / 3)
        // })
        this.spr.node.parent = canvas;
        this.spr.node.setPosition(cc.v2(-88, 193))
        if (this.index < 3)
        {
            //洗手间
            this.spr.node.scale = 3
        }
        else if (this.index < 6)
        {
            this.spr.node.scale = 2
        }
        else if (this.index < 9)
        {
            this.spr.node.scale = 2
        }
        else if (this.index < 12)
        {
            this.spr.node.scale = -2
        }

        this.spr.node.zIndex = 15;
        for (let i = 0; i < this.spr.node.childrenCount; i++)
        {
            this.spr.node.children[i].active = true;
            this.spr.node.children[i].scale = 1 / this.spr.node.scale;
        }

        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 20)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 21)
                this.spr.node.children[0].active = false;
            }
        }

        if (Caches.get(Caches.newGuide))
        {
            GameSys.game.xSet(Config.OPPO, true)
        }

    }
    onTouchClose()
    {
        // console.log("关闭")
        // if (Caches.get(Caches.newGuide))
        // {
        //     GameSys.hideBanner();
        // }
        this.spr.node.children[0].active = false;
        GameSys.game.xSet(Config.BLOCK, {
            state: false,
            spr: false,
            clean: false
        })
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 28)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 29)
                this.spr.node.children[0].active = false;
            }
        }

        this.spr.node.parent = this.node;
        this.spr.node.setPosition(cc.v2(0, 0))
        this.spr.node.scale = 1
        // GameSys.game.xSet(Config.CLEAN, {
        //     state: false,
        //     index: Math.floor(this.index / 3)
        // })
        for (let i = 0; i < this.spr.node.childrenCount; i++)
        {
            this.spr.node.children[i].active = false;
            this.spr.node.children[i].scale = 1;
        }
        this.spr.node.parent = this.initPar;
        DataManager.getInstance().garbageFlag = 0
    }
    add_fallings(data: { path: In_Hand_Down, index: number })
    {
        if (this.index !== data.index)
            return
        // console.log("掉落了啊", this.index, _data.pos)
        let graphics: cc.Node = cc.instantiate(this.goods)
        this.spr.node.addChild(graphics);
        data.path.price = DataManager.getInstance().floating(data.path.price, data.path.percentage);
        graphics.getComponent(Loo_goods).init(data.path.price, data.path.name, data.index)

        // graphics.x = (Math.random() * (this.spr.node.height / 2)) * this.abs[Math.floor(Math.random() * 2)]
        // graphics.y = (Math.random() * (this.spr.node.width / 2)) * this.abs[Math.floor(Math.random() * 2)]
        graphics.active = false;
        // let pos: number = Math.floor(Math.random() * WUPIN[data.path.ID].length)
        graphics.setPosition(WUPIN[data.path.ID][0])
    }
    abs: number[] = [-1, 1]
    graphicsNode: cc.Node = new cc.Node();
    private pathname: string = ""
    countGarbage: number = 1000;
    change_graphics(data: { path: In_Garbage, index: number })
    {
        if (this.index !== data.index)
            return
        let graphics: cc.Node = cc.instantiate(this.graphics);
        this.spr.node.addChild(graphics);
        this.countGarbage++;
        let BINDER = `garbage_${this.countGarbage}`
        graphics.getComponent(Garbage_Smear).init(data.path.name, data.index, BINDER);
        this.pathname = ""
        this.pathname = data.path.name
        this.graphicsNode = null;
        this.graphicsNode = graphics;
        // graphics.x = (Math.random() * (this.spr.node.height / 2)) * this.abs[Math.floor(Math.random() * 2)]
        // graphics.y = (Math.random() * (this.spr.node.width / 2)) * this.abs[Math.floor(Math.random() * 2)]
        // let pos: number = Math.floor(Math.random() * WUZI[data.path.ID].length)
        graphics.setPosition(WUZI[data.path.ID][0])
        graphics.active = false;

        GameSys.game.xSet(Config.INFORM, {
            index: 2,
            v: this.room[Math.floor(this.index / 3)] + "要打扫",
            cb: () =>
            {
                this.onTouchShow()
            }
        })
    }
    private onClick()
    {
        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')

        PopupManager.show(PopupPath.loo, options, PopupCacheMode.Frequent, PopupShowPriority.None)
    }

    //点击招募的情况下添加
    recruit_change(_data: { index: number, state: number })
    {
        // console.log("招募", _data.index)
        if (_data.state == 0)
        {
            console.log("解雇")
            //解雇，判断是否肮脏度已满
            this.judge_buildings();
            this.circle.node.opacity = 125
            //进来判断要不要清洁垃圾
            if (this.buildings)
            {
                // console.error("当前值", this.buildings_save[this.index].dirty, this.buildings.max_dirty)
                if (this.buildings_save[this.index].dirty >= this.buildings.max_dirty)
                {
                    console.log("解雇", this.index)
                    DataManager.getInstance().setLeisure(this.index, true)
                    StaticManager.getInstance().use_buildings[this.index] = false;
                    //没有空闲就一直访问，有空闲就停止
                    let _cb = () =>
                    {
                        this.count++;
                        if (StaticManager.getInstance().staff.length > 0)
                        {
                            let value = StaticManager.getInstance().staff[Math.floor(Math.random() * StaticManager.getInstance().staff.length)];//这里还是要做修整
                            GameSys.game.xSet(Config.FIXLOO, {
                                index: this.index,
                                value: value
                            })
                        }
                        //还是这里有问题，想一想
                        if (!DataManager.getInstance().getLeisure(this.index))
                        {
                            this.unschedule(_cb)
                            return
                        }
                        if (this.count % 4 == 0)
                        {
                            //直接添加掉落
                            DataManager.getInstance().setClean(this.index, true)
                            DataManager.getInstance().packagingGarbage(this.index);
                        }
                        // console.error("=====")
                    }
                    this.schedule(_cb, 1, 3)

                }
            }
        }
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
