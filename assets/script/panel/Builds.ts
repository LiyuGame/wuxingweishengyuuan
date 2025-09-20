import PopupBase from "../common/component/popups/PopupBase";
import Caches from "../common/manager/Caches";
import { BUILDINGS, Config, In_BUILDINGS, In_Save_Buildings, TipLab } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StateManager from "../common/manager/StateManager";
import StaticManager from "../common/manager/StaticManager";
import Appearance from "./Appearance";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'fiveBuilds'
@ccclass
export default class Builds extends PopupBase<string>
{

    @property(cc.ToggleContainer)
    toggle: cc.ToggleContainer = null;
    @property(cc.Node)
    checkMark_1: cc.Node = null;
    @property(cc.Node)
    checkMark_2: cc.Node = null;

    @property(cc.ScrollView)
    scroll_0: cc.ScrollView = null;
    @property(cc.ScrollView)
    scroll_1: cc.ScrollView = null;

    @property(cc.Label)
    lvl_lab: cc.Label = null;

    @property(cc.Label)
    max_pre_lab: cc.Label = null;
    @property(cc.Label)
    max_next_lab: cc.Label = null;

    @property(cc.Label)
    change_pre_lab: cc.Label = null;
    @property(cc.Label)
    change_next_lab: cc.Label = null;
    @property(cc.Label)
    time_pre_lab: cc.Label = null;
    @property(cc.Label)
    time_next_lab: cc.Label = null;
    @property(cc.Label)
    gold_next_lab: cc.Label = null;

    @property(cc.Node)
    detail: cc.Node = null;
    @property(StateManager)
    button_state: StateManager = null
    @property(cc.Node)
    appearance: cc.Node = null

    private builings: In_Save_Buildings[]
    private first: boolean = false;
    onLoad()
    {
        GameSys.game.xBind(Config.BUILDINGSDETAILS, this.change_detail.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.APPITEM, this.change_select.bind(this), BINDER_NAME)
        if (!Caches.get(Caches.newGuide))
        {
            GameSys.game.xBind(Config.NEWGUIDECON, this.change_data.bind(this), BINDER_NAME)
        }

    }
    onEnable()
    {
        // this.detail.active = false;
        // this.appearance.active = false
        this.node.zIndex = 20
        this.scroll_0.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMonitor.bind(this))
        this.scroll_1.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMonitor_1.bind(this))

        this.chagne_check()
        // if (!Caches.get(Caches.newGuide))
        // {
        //     if (GameSys.game.xGet(Config.NEWGUIDECON) == 2)
        //     {
        //         this.detail.active = true;

        //         this.button_state.stateChange(0);
        //         this.lvl_lab.string = "LV:0——LV:1"
        //         this.gold_next_lab.string = "0"
        //         this.time_next_lab.string = '8'
        //         this.time_pre_lab.string = "0"

        //         this.max_next_lab.string = '30000'
        //         this.max_pre_lab.string = "0";

        //         this.change_next_lab.string = '10'
        //         this.change_pre_lab.string = "0"

        //     }
        // }
        this.detail.scale = 0
        console.log(GameSys.game.xGet(Config.APPITEM).state)

        if (GameSys.game.xGet(Config.APPITEM).state)
        {
            this.toggle.toggleItems[0].isChecked = false;
            this.toggle.toggleItems[1].isChecked = true;
            this.change_select({ index: GameSys.game.xGet(Config.APPITEM).index, state: GameSys.game.xGet(Config.APPITEM).state })
        }
    }
    start()
    {

    }
    change_data(v: number)
    {
        if (v == 3)
        {

            this.detail.active = true;
            cc.tween(this.detail)
                .to(0.1, { scale: 1 })
                .start()
            this.button_state.stateChange(0);
            this.lvl_lab.string = "LV:0——LV:1"
            this.gold_next_lab.string = "0"
            this.time_next_lab.string = BUILDINGS[0].use_time.toString()
            this.time_pre_lab.string = "0"

            this.max_next_lab.string = BUILDINGS[0].max_dirty.toString()
            this.max_pre_lab.string = "0";

            this.change_next_lab.string = BUILDINGS[0].change_dirty.toString()
            this.change_pre_lab.string = "0"
        }
        if (v == 6)
        {
            this.detail.active = true;
            cc.tween(this.detail)
                .to(0.1, { scale: 1 })
                .start()
            this.button_state.stateChange(0);
            this.lvl_lab.string = "LV:0——LV:1"
            this.gold_next_lab.string = "0"
            this.time_next_lab.string = BUILDINGS[9].use_time.toString()
            this.time_pre_lab.string = "0"

            this.max_next_lab.string = BUILDINGS[9].max_dirty.toString()
            this.max_pre_lab.string = "0";

            this.change_next_lab.string = BUILDINGS[9].change_dirty.toString()
            this.change_pre_lab.string = "0"
        }
    }
    chagne_check()
    {
        if (this.checkMark_1.active)
        {
            GameSys.game.xSet(Config.BUILDINGSUP, true)
            GameSys.game.xSet(Config.SCREENPOS, GameSys.game.xGet(Config.SCREENPOS))
        }
        if (this.checkMark_2.active)
        {
            GameSys.game.xSet(Config.MAGNIFY, {
                index: GameSys.game.xGet(Config.MAGNIFY).index,
                state: true
            })
        }
    }
    change_select(data: { index?: number, state: boolean })
    {
        // console.log("emmm", data, this.appearance.active)
        if (data.state)
        {
            if (!this.appearance.active)
            {
                this.appearance.active = true;
                this.appearance.getComponent(Appearance).init(GameSys.game.xGet(Config.APPITEM).index)
            }
        }
        else
        {
            this.appearance.active = false
        }

    }
    private room: In_BUILDINGS[] = []//相同的建筑物推进来
    private index: number = 0;
    private lvl: number = 0
    change_detail(data: { index: number, state: number })
    {
        //0,1,2,3,4,5,6,7,8,9,10,11,12
        // console.error("解锁条件", data.state)
        if (!this.detail.active)
        {
            this.detail.active = true;
        }
        cc.tween(this.detail)
            .to(0.1, { scale: 0 })
            .to(0.1, { scale: 1 })
            .start()
        if (data.state != -1)
        {
            this.button_state.node.active = true
            this.button_state.stateChange(data.state)

        }
        else
        {
            this.button_state.node.active = false
        }
        this.room = []
        this.index = data.index;
        this.builings = GameSys.game.xGet(Config.BUILDINGS)
        let buildings = this.builings[data.index];
        this.lvl = buildings.level
        for (let i = 0; i < BUILDINGS.length; i++)
        {
            if (BUILDINGS[i].index == buildings.index)
            {
                //相同的建筑物推进来
                this.room.push(BUILDINGS[i])
            }
        }
        // console.log("测试", this.room)
        if (buildings.level < 3)
        {
            if (buildings.level == 0)
            {
                this.lvl_lab.string = "LV:0——LV:1"
                // this.gold_pre_lab.string = "0"
                this.gold_next_lab.string = this.room[0].gold.toString();

                this.time_pre_lab.string = '0'
                this.time_next_lab.string = this.room[0].use_time.toString()

                this.max_pre_lab.string = '0'
                this.max_next_lab.string = this.room[0].max_dirty.toString();

                this.change_pre_lab.string = '0'
                this.change_next_lab.string = this.room[0].change_dirty.toString();
            }
            else
            {
                this.lvl_lab.string = `LV:${buildings.level}——LV:${buildings.level + 1}`

                // this.gold_pre_lab.string = this.room[buildings.level - 1].gold.toString();//0
                this.gold_next_lab.string = this.room[buildings.level].gold.toString();//1

                this.time_pre_lab.string = this.room[buildings.level - 1].use_time.toString();//0
                this.time_next_lab.string = this.room[buildings.level].use_time.toString();//0

                this.max_pre_lab.string = this.room[buildings.level - 1].max_dirty.toString();
                this.max_next_lab.string = this.room[buildings.level].max_dirty.toString();

                this.change_pre_lab.string = this.room[buildings.level - 1].change_dirty.toString();
                this.change_next_lab.string = this.room[buildings.level].change_dirty.toString();
            }
        }
        else
        {
            this.button_state.node.active = false
            this.lvl_lab.string = "LV:3——LV:∞"

            this.gold_next_lab.string = "∞"
            // this.gold_pre_lab.string = this.room[this.room.length - 1].gold.toString();

            this.time_next_lab.string = '∞'
            this.time_pre_lab.string = this.room[this.room.length - 1].use_time.toString()

            this.max_next_lab.string = '∞'
            this.max_pre_lab.string = this.room[this.room.length - 1].max_dirty.toString();

            this.change_next_lab.string = '∞'
            this.change_pre_lab.string = this.room[this.room.length - 1].change_dirty.toString();
        }

        if (this.button_state.node.active)
        {
            GameSys.judgeGold(this.room[buildings.level].gold, () =>
            {
                console.log("金币不足")
                this.watchvideo = true;
                this.button_state.node.children[this.button_state.nowState].children[0].active = true
            }, () =>
            {
                console.log("金币足够")
                this.watchvideo = false;
                this.button_state.node.children[this.button_state.nowState].children[0].active = false
            })
        }
    }
    watchvideo: boolean = false;

    onTouchHide()
    {
        GameSys.game.xSet(Config.HIDEALL, false)
        GameSys.game.xSet(Config.BUILDINGSUP, false)
        GameSys.game.xSet(Config.BUILDINGSAPP, {
            index: GameSys.game.xGet(Config.BUILDINGSAPP).index,
            state: false
        })
        GameSys.game.xSet(Config.MAGNIFY, {
            index: GameSys.game.xGet(Config.MAGNIFY).index,
            state: false
        })
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 13)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 14)
            }
        }
        GameSys.game.xSet(Config.HIDESHOP, true)
        this.hide();
    }
    //升级
    private buildings: In_Save_Buildings[] = []
    onTouchUpdrage()
    {
        this.buildings = GameSys.game.xGet(Config.BUILDINGS);
        if (this.buildings[this.room[0].index].upgrade != 0)
        {
            //正在升级不升级
            GameSys.game.xSet(Config.TIP, TipLab.upgrade_buildings);
            return;
        }
        let success = () =>
        {
            this.detail.active = false;
            // console.error("建设时间", this.room[this.lvl].upgrade_time)
            GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                index: this.room[0].index,
                level: this.buildings[this.room[0].index].level,
                dirty: this.buildings[this.room[0].index].dirty,
                upgrade: this.room[this.lvl].upgrade_time//正在升级
            })
            // this.change(this.lvl + 1)
            GameSys.game.xSet(Config.BUILDINGSUPDATE, this.room[0].index)
            GameSys.game.xSet(Config.ALLRED)

        }
        if (this.watchvideo)
        {
            GameSys.watchVideo(1, success)
        }
        else
        {
            GameSys.useGold(-parseFloat(this.gold_next_lab.string), () =>
            {
                success()
            })
        }
    }
    onTouchClose()
    {
        this.detail.active = false;
    }
    onTouchCloseApp()
    {
        this.appearance.active = false;
    }
    onMonitor(event: cc.Event.EventTouch)
    {
        if (event.getDeltaX() > 2)
        {
            //右移动
            for (let i = 0; i < this.scroll_0.content.childrenCount; i++)
            {
                cc.tween(this.scroll_0.content.children[i])
                    .to(0.05, { angle: -6 })
                    .to(0.05, { angle: 0 })
                    .start()
            }
        }
        else if (event.getDeltaX() < -2)
        {
            //左边移
            for (let i = 0; i < this.scroll_0.content.childrenCount; i++)
            {
                cc.tween(this.scroll_0.content.children[i])
                    .to(0.05, { angle: 6 })
                    .to(0.05, { angle: 0 })
                    .start()
            }
        }
    }
    onMonitor_1(event: cc.Event.EventTouch)
    {
        if (event.getDeltaX() > 0)
        {
            //右移动
            for (let i = 0; i < this.scroll_1.content.childrenCount; i++)
            {
                cc.tween(this.scroll_1.content.children[i])
                    .to(0.05, { angle: -6 })
                    .to(0.05, { angle: 0 })
                    .start()
            }
        }
        else
        {
            //左边移
            for (let i = 0; i < this.scroll_1.content.childrenCount; i++)
            {
                cc.tween(this.scroll_1.content.children[i])
                    .to(0.1, { angle: 6 })
                    .to(0.1, { angle: 0 })
                    .start()
            }
        }
    }
    onTaggle1()
    {
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.BUILDINGSAPP, {
            index: GameSys.game.xGet(Config.BUILDINGSAPP).index,
            state: false
        })
        GameSys.game.xSet(Config.BUILDINGSUP, true)
        GameSys.game.xSet(Config.MAGNIFY, {
            index: GameSys.game.xGet(Config.MAGNIFY).index,
            state: false
        })
        this.onTouchCloseApp()
    }
    onTaggle2()
    {
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.BUILDINGSUP, false)
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 9)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 10)
            }
        }
        this.detail.active = false;
        GameSys.game.xSet(Config.BUILDINGSAPP, {
            index: GameSys.game.xGet(Config.BUILDINGSAPP).index,
            state: true
        })
        if (!Caches.get(Caches.newGuide))
            return
        GameSys.game.xSet(Config.MAGNIFY, {
            index: GameSys.game.xGet(Config.MAGNIFY).index,
            state: true
        })
    }
    onDisable()
    {

    }
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
