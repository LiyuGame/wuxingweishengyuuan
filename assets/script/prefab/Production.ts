import AStar, { Grid, GRIDTYPE } from "../common/component/AStar";
import Caches from "../common/manager/Caches";
import { BUILDINGS, Config, JSON_PATH, RECRUIT, SHOP_POS, SHOP_QUEUE, STAFF_MOVE_LOO, STAFF_MOVE_TOILET_1, STAFF_MOVE_TOILET_2, STAFF_MOVE_TOILET_3, STAFF_MOVE_WAREHOUSE } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import MathManager from "../common/manager/MathManager";
import PoolManager from "../common/manager/PoolManager";
import StaticManager from "../common/manager/StaticManager";
import Client from "./Client";
import Staff from "./Staff";
const { ccclass, property } = cc._decorator;
let BINDER_NAME: string = 'Production'
@ccclass
export default class Production extends AStar
{
    @property(cc.Node)
    hand: cc.Node = null;
    @property(cc.Node)
    solicit: cc.Node = null;
    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Prefab)
    staff: cc.Prefab = null;
    @property(cc.Prefab)
    client: cc.Prefab = null;

    private recruit: number[] = []
    public all_move: cc.Vec2[] = [];

    static instance: Production

    static getInstance(): Production
    {
        this.instance = this.instance ? this.instance : new Production();
        return this.instance
    }

    private time: number[] = [8, 9, 10]
    // private time: number[] = [1, 1, 1, 1, 1, 1]
    private count: number = 1000;
    onLoad()
    {
        super.onLoad();
        this.recruit = GameSys.game.xGet(Config.RECRUIT);
        this.Map_Path = []
        this.Map_Path = MathManager.getInstance().transformArray(JSON_PATH)
        MathManager.getInstance().visitLinearArray(SHOP_POS, (i) =>
        {
            this.shop_pos[i] = 0;
        })
        GameSys.game.xSet(Config.SHOP_POS, this.shop_pos)
        PoolManager.getInstance().initPool(this.client, 100);//先存100个  后边有需要再修改
        if (!Caches.get(Caches.newGuide))
        {

        }
        else
        {
            this.create_customer()
            // this.create_customer()
            let time: number = this.time[Math.floor(Math.random() * this.time.length)];
            let cb = () =>
            {
                this.create_customer()
                time = this.time[Math.floor(Math.random() * this.time.length)];
                this.scheduleOnce(() =>
                {
                    cb()
                }, time)
            }
            this.scheduleOnce(cb, time)

            // console.log("商店占据位置", this.shop_pos)
            this.limit_pos()
            this.add_staff()
        }

    }

    onEnable()
    {
        GameSys.game.xBind(Config.SHOP_POS_CHANGE, this.shopChange.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.RECRUITCHANGE, this.recruit_change.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.LOCKROOM, this.limit_pos.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.SHOP_POS, this.shop_pos_bind.bind(this), BINDER_NAME)
        // console.log("使用时间", _data._index)
        if (!Caches.get(Caches.newGuide))
        {
            this.solicit.parent.active = false;
            this.hand.active = false;
            GameSys.game.xBind(Config.NEWGUIDECON, this.newGuide.bind(this), BINDER_NAME)
        }
        if (!Caches.get(Caches.hand))
        {
            this.hand.active = true;
        }
        else
        {
            this.hand.active = false;
        }
    }
    start()
    {
        this.solicit.on(cc.Node.EventType.TOUCH_START, this.onTochSolicit.bind(this))
    }
    newGuide(v: number)
    {
        if (v == 14)
        {
            this.create_customer()
        }
        if (v == 33)
        {
            this.solicit.parent.active = true;
            this.hand.active = true;
            GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                index: 0,
                level: 1,
                dirty: BUILDINGS[0].max_dirty - 10,
                upgrade: 0
            })
            GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                index: 3,
                level: 1,
                dirty: BUILDINGS[9].max_dirty - 10,
                upgrade: 0
            })
            this.create_customer()
            // this.create_customer()
            let time: number = this.time[Math.floor(Math.random() * this.time.length)];
            let cb = () =>
            {
                this.create_customer()
                time = this.time[Math.floor(Math.random() * this.time.length)];
                this.scheduleOnce(() =>
                {
                    cb()
                }, time)
            }
            this.scheduleOnce(cb, time)

            // console.log("商店占据位置", this.shop_pos)
            this.limit_pos()
            this.add_staff()
        }
    }
    hideAll(v: boolean)
    {
        if (v)
        {
            for (let i = 0; i < this.node.childrenCount; i++)
            {
                this.node.children[i].opacity = 0
            }
        }
        else
        {
            for (let i = 0; i < this.node.childrenCount; i++)
            {
                this.node.children[i].opacity = 255
            }
        }

    }
    /**
     * 生成顾客
     * @param count 生成数量
     * @param v 生成的顾客种类0-x
     */
    public shop_pos: number[] = []
    create_customer()
    {
        // console.log("====", i)
        let pos: number[] = this.shop_pos_change();
        if (pos.length <= 0)
        {
            //排队
            return
            let count: number = 0;
            MathManager.getInstance().visitLinearArray(StaticManager.getInstance().shop_queue, (i) =>
            {
                if (StaticManager.getInstance().shop_queue[i])
                {
                    count++;
                }
            })
            if (count == StaticManager.getInstance().loo_queue.length)
            {
                //就不再进人了
                return
            }
            let client: cc.Node = cc.instantiate(this.client)
            client.parent = this.node;
            if (GameSys.game.xGet(Config.HIDEALL))
            {
                client.opacity = 0;
            }
            else
            {
                client.opacity = 255
            }
            client.getComponent(Client).queue_shop();
            client.scale = 0.17
            return;
        }
        this.count++;
        // console.log("数量", this.count)
        let index = Math.floor(Math.random() * pos.length)
        this.shop_pos[pos[index]] = 1
        GameSys.game.xSet(Config.SHOP_POS, this.shop_pos)
        this.posEnd = SHOP_POS[pos[index]]
        // this.posEnd = cc.v2(42, 17)
        this.initMap();
        this.findPath(this.posStart, this.posEnd)

        // let client: cc.Node = PoolManager.getInstance().getBlock()
        let client: cc.Node = cc.instantiate(this.client)
        client.parent = this.node;
        if (GameSys.game.xGet(Config.HIDEALL))
        {
            client.opacity = 0;
        }
        else
        {
            client.opacity = 255
        }
        client.getComponent(Client).initPath(this.path, this.posStart, pos[index], this.count)
        client.scale = 0.17
        pos = []
    }
    shopChange(v: number)
    {
        this.shop_pos[v] = 0;
        GameSys.game.xSet(Config.SHOP_POS, this.shop_pos)
        // console.log("商店位置改变", this.shop_pos, v)
    }
    shop_pos_change(): number[]
    {
        let no_zero: number[] = [];
        MathManager.getInstance().visitLinearArray(this.shop_pos, (i) =>
        {
            if (this.shop_pos[i] != 1)
            {
                no_zero.push(i)
            }
        })
        // GameSys.game.xSet(Config.SHOP_POSFLAG, no_zero)
        // console.log(no_zero)
        return no_zero
    }
    shop_pos_bind()
    {
        this.shop_pos = GameSys.game.xGet(Config.SHOP_POS)
    }
    onTochSolicit()
    {
        GameSys.audio.playSFX("audios/button");
        this.mask.height += 8;
        if (this.mask.height > 40)
        {
            if (!Caches.get(Caches.hand))
            {
                Caches.set(Caches.hand, true)
                this.hand.active = false;
            }
            this.mask.height = 0;
            this.create_customer();
        }
    }
    //判断职员可以走到哪里，因为有等级限制
    limit_pos()
    {
        //根据当前解锁了几个 分批次往里加
        this.all_move = []
        MathManager.getInstance().visitLinearArray(STAFF_MOVE_LOO, (i) =>
        {
            this.all_move.push(STAFF_MOVE_LOO[i])
        })
        MathManager.getInstance().visitLinearArray(STAFF_MOVE_TOILET_1, (i) =>
        {
            this.all_move.push(STAFF_MOVE_TOILET_1[i])
        })

        MathManager.getInstance().visitLinearArray(STAFF_MOVE_WAREHOUSE, (i) =>
        {
            this.all_move.push(STAFF_MOVE_WAREHOUSE[i])
        })
        if (StaticManager.getInstance().open_buildings.length == 3)
        {
            MathManager.getInstance().visitLinearArray(STAFF_MOVE_TOILET_2, (i) =>
            {
                this.all_move.push(STAFF_MOVE_TOILET_2[i])
            })
        }
        if (StaticManager.getInstance().open_buildings.length == 4)
        {
            MathManager.getInstance().visitLinearArray(STAFF_MOVE_TOILET_3, (i) =>
            {
                this.all_move.push(STAFF_MOVE_TOILET_3[i])
            })
        }
    }

    //判断已经存在职员的情况下 添加职员
    add_staff()
    {
        MathManager.getInstance().visitLinearArray(this.recruit, (i) =>
        {
            setTimeout(() =>
            {
                if (this.recruit[i] != 0)
                {
                    let posStart = this.all_move[Math.floor(Math.random() * this.all_move.length)];
                    let staff: cc.Node = cc.instantiate(this.staff);
                    staff.parent = this.node;
                    staff.scale = 0.23
                    staff.getComponent(Staff).initPath(posStart, RECRUIT[i], i)
                    StaticManager.getInstance().staff.push(i)
                }
            }, i * 500)
        })
    }
    //点击招募的情况下添加
    recruit_change(_data: { index: number, state: number })
    {
        // console.log("招募", _data.index)
        if (_data.state == 1)
        {
            //加加加
            let posStart = this.all_move[Math.floor(Math.random() * this.all_move.length)];
            let staff: cc.Node = cc.instantiate(this.staff);
            staff.parent = this.node;
            staff.scale = 0.23
            staff.getComponent(Staff).initPath(posStart, RECRUIT[_data.index], _data.index)
            StaticManager.getInstance().staff.push(_data.index)
            // console.log(StaticManager.getInstance().staff)
        }
        else
        {
            let indexOf = StaticManager.getInstance().staff.indexOf(_data.index)
            StaticManager.getInstance().staff.splice(indexOf, 1)
            console.log("解雇", StaticManager.getInstance().staff)
        }
    }
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
