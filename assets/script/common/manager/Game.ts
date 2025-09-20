import Props from "../kernels/Props";
import Caches from "./Caches";
import { Config, In_Save_Apperance, In_Save_Buildings, In_Save_Shop } from "./Config";
import UtilsManager from "./UtilsManager";

let BINDER_NAME = "labyrinth";


export default class Game extends Props
{
    constructor()
    {
        super()
        this.bind_Event();
        this.bind_level();
        this.bind_gold();
        this.bind_lock();
        this.bind_signIn();
        this.bind_recruit();
        this.bind_buildings();
        this.bind_shop()
        this.bind_warehouse();
        this.bind_appearance()
        this.bind_goldOffline();
    }
    //事件绑定
    bind_Event()
    {
        for (let i = 0; i < Object.keys(Config).length; i++)
        {
            // console.log(Object.keys(Config)[i])
            this.xSet(Config[Object.keys(Config)[i]], null, null)
        }
    }
    //解锁房屋
    bind_lock()
    {
        let lock: any = Caches.get(Caches.lock)
        if (!lock)
        {
            let model: Array<boolean> = new Array<boolean>(10);
            for (let i: number = 0; i < model.length; i++)
            {
                model[i] = false;
            }
            model[0] = true;
            model[1] = true;
            lock = UtilsManager.clone(model);
            Caches.set(Caches.lock, lock)
        }
        this.xSet(Config.LOCKROOM, lock)
        this.xBind(Config.LOCKROOMCHANGE, this.change_lock.bind(this), BINDER_NAME)
    }
    change_lock(_data: { index: number, state: boolean })
    {
        let lock: boolean[] = this.xGet(Config.LOCKROOM)
        lock[_data.index] = _data.state;
        Caches.set(Caches.lock, lock)
    }
    //等级
    bind_level()
    {
        let level: number = Caches.get(Caches.level)
        if (!level && typeof level !== 'number')
        {
            level = 0;
            Caches.set(Caches.level, level)
        }
        this.xSet(Config.LEVEL, level)
        this.xBind(Config.LEVEL, this.change_level.bind(this), BINDER_NAME);
        // console.log("当前关卡", Caches.getInt(Caches.stage));
    }
    change_level(_data: number)
    {
        if (_data > Caches.get(Caches.level))
        {
            Caches.set(Caches.level, _data)
        }
        // this.xSet(Config.STAGE, Caches.get(Caches.stage))
    }

    //金币
    bind_gold()
    {
        let gold: any = Caches.get(Caches.gold)
        if (!gold && typeof gold != "number")
        {
            gold = 10;
            Caches.set(Caches.gold, gold)
        }
        this.xSet(Config.GOLD, { v: gold, index: 0 })
        this.xBind(Config.GOLD, this.change_gold.bind(this), BINDER_NAME);

        // console.log("初始化金币", Caches.getInt(Caches.gold));
    }
    change_gold(_data: { v: number, index: number })
    {
        // console.log(_data)
        // console.log("金币++++++++++", _data.v)
        Caches.set(Caches.gold, _data.v)
    }


    //金币离线绑定
    bind_goldOffline()
    {
        let goldoffline: any = Caches.get(Caches.goldOffline)
        if (!goldoffline)
        {
            goldoffline = [0, 0, 1]
            Caches.set(Caches.goldOffline, goldoffline)
        }
        this.xSet(Config.GOLDOFFLINE, goldoffline)
        this.xBind(Config.GOLDOFFLINECHANGE, this.change_goldOffline.bind(this), BINDER_NAME);

        // console.log("初始化金币", this.xGet(Config.GOLDOFFLINE));
    }
    change_goldOffline(_data: { index: number, state: number })
    {
        _data.state = parseInt(_data.state.toFixed(0));
        let goldOffline: Array<number> = this.xGet(Config.GOLDOFFLINE);
        // console.error(_data, goldOffline)
        goldOffline[_data.index] = _data.state;
        Caches.set(Caches.goldOffline, goldOffline)
    }


    //签到绑定
    bind_signIn()
    {
        let signInState: any = Caches.get(Caches.signInState);
        if (!signInState)
        {
            let model: Array<number> = new Array<number>(7);
            for (let i: number = 0; i < model.length; i++)
            {
                model[i] = 0;
            }
            model[0] = 1;
            signInState = UtilsManager.clone(model);
            Caches.set(Caches.signInState, signInState);
        }

        this.xSet(Config.SIGNIN, signInState);
        this.xBind(Config.SIGNINCHANGE, this.change_signInState.bind(this), BINDER_NAME);
    }
    change_signInState(_data: any)
    {
        let signInState: Array<number> = this.xGet(Config.SIGNIN);
        if (_data.index == 7)
        {
            for (let i = 0; i < signInState.length; i++)
            {
                signInState[i] = _data.state;
            }
            signInState[0] = 1;
        }
        else
        {
            signInState[_data.index] = _data.state;
        }
        Caches.set(Caches.signInState, signInState);
    }

    //招募绑定
    bind_recruit()
    {
        let recruitState: any = Caches.get(Caches.recruit);
        if (!recruitState)
        {
            let model: Array<number> = new Array<number>(20);
            for (let i: number = 0; i < model.length; i++)
            {
                model[i] = 0;
            }
            recruitState = UtilsManager.clone(model);
            Caches.set(Caches.recruit, recruitState);
        }

        this.xSet(Config.RECRUIT, recruitState);
        this.xBind(Config.RECRUITCHANGE, this.change_recruitState.bind(this), BINDER_NAME);
    }
    change_recruitState(_data: any)
    {
        let recruitState: Array<number> = this.xGet(Config.RECRUIT);
        // console.log("解雇", _data)
        recruitState[_data.index] = _data.state;
        Caches.set(Caches.recruit, recruitState);
    }

    //建筑绑定
    bind_buildings()
    {
        let buildingsState: any = Caches.get(Caches.buildings);
        if (!buildingsState)
        {
            let model: In_Save_Buildings[] = [];
            for (let i: number = 0; i < 12; i++)
            {
                model.push({ index: i, dirty: 0, level: 0, upgrade: 0 })
            }
            model[0].level = 1;//第一个洗手池解锁
            model[3].level = 1;//第一个卫生间解锁
            buildingsState = UtilsManager.clone(model);
            Caches.set(Caches.buildings, buildingsState);
        }
        this.xSet(Config.BUILDINGS, buildingsState);
        this.xBind(Config.BUILDINGSCHANGE, this.change_buildings.bind(this), BINDER_NAME);
    }
    change_buildings(_data: { index: number, level: number, dirty: number, upgrade: number })
    {
        // console.error("测试", _data)
        let buildingsState: In_Save_Buildings[] = this.xGet(Config.BUILDINGS);
        buildingsState[_data.index].dirty = _data.dirty;
        buildingsState[_data.index].level = _data.level;
        buildingsState[_data.index].upgrade = _data.upgrade;
        Caches.set(Caches.buildings, buildingsState);
    }

    //商店绑定
    bind_shop()
    {
        let shopState: any = Caches.get(Caches.shop);
        if (!shopState)
        {
            let model: In_Save_Shop[] = [];
            for (let i: number = 0; i < 50; i++)
            {
                model.push({ ID: i, count: 0 })
            }
            model[0].count = 5;
            model[1].count = 5;
            model[2].count = 5;
            shopState = UtilsManager.clone(model);
            Caches.set(Caches.shop, shopState);
        }

        this.xSet(Config.SHOP, shopState);
        this.xBind(Config.SHOPCHANGE, this.change_Shop.bind(this), BINDER_NAME);
    }
    change_Shop(_data: In_Save_Shop)
    {
        let shopState: In_Save_Shop[] = this.xGet(Config.SHOP);
        // console.log(shopState)
        shopState[_data.ID].count = _data.count;
        Caches.set(Caches.shop, shopState);
    }
    //仓库绑定
    bind_warehouse()
    {
        let warehouseState: any = Caches.get(Caches.warehouse);
        if (!warehouseState)
        {
            let model: number[] = [];
            warehouseState = UtilsManager.clone(model)
            Caches.set(Caches.warehouse, warehouseState);
        }

        this.xSet(Config.WAREHOUSE, warehouseState);
        this.xBind(Config.WAREHOUSECHNAGE, this.change_warehouse.bind(this), BINDER_NAME);
    }
    change_warehouse(ID: number)
    {
        let warehouseState = this.xGet(Config.WAREHOUSE);
        console.log("仓库", warehouseState, ID)
        warehouseState.push(ID)
        Caches.set(Caches.warehouse, warehouseState);
    }

    //外观绑定
    bind_appearance()
    {
        let appearanceState: any = Caches.get(Caches.appearance);
        if (!appearanceState)
        {
            let model: In_Save_Apperance[] = [];
            for (let i: number = 0; i < 100; i++)
            {
                model.push({ index: 0, geta: false, gets: false })
            }
            appearanceState = UtilsManager.clone(model)
            Caches.set(Caches.appearance, appearanceState);
        }

        this.xSet(Config.APPEARANCE, appearanceState);
        this.xBind(Config.APPEARANCECHANGE, this.change_appearance.bind(this), BINDER_NAME);
    }
    change_appearance(data: { index: number, state: number, geta: boolean, gets: boolean })
    {
        let appearanceState: In_Save_Apperance[] = this.xGet(Config.APPEARANCE);
        appearanceState[data.index].geta = data.geta
        appearanceState[data.index].gets = data.gets
        appearanceState[data.index].index = data.state;
        Caches.set(Caches.appearance, appearanceState);
    }
}