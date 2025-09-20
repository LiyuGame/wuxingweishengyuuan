import Tip from "./common/component/TIp";
import Caches from "./common/manager/Caches";
import { APPEARANCE, BUILDINGS, Config, IN_Apparance, In_Save_Apperance, In_Save_Buildings, PopupPath, RECRUIT, WAREHOUSE } from "./common/manager/Config";
import GameSys from "./common/manager/GameSys";
import MathManager from "./common/manager/MathManager";
import PoolManager from "./common/manager/PoolManager";
import PopupManager, { PopupCacheMode, PopupShowPriority } from "./common/manager/PopupManager";
import StaticManager from "./common/manager/StaticManager";
import UtilsManager from "./common/manager/UtilsManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME = 'start'
@ccclass
export default class Start extends cc.Component
{
    @property(cc.Prefab)
    oppo: cc.Prefab = null;
    @property(cc.Node)
    shop: cc.Node = null;
    @property(cc.Node)
    warehouse: cc.Node = null;
    @property(cc.Node)
    recuit: cc.Node = null;
    @property(cc.Node)
    builds: cc.Node = null;

    @property(cc.Node)
    notice: cc.Node = null;
    @property(cc.Node)
    newGuide: cc.Node = null;
    @property(cc.Prefab)
    blockPre: cc.Node = null;
    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Node)
    shop_red: cc.Node = null;
    @property(cc.Node)
    warehouse_red: cc.Node = null;
    @property(cc.Node)
    recuit_red: cc.Node = null;
    @property(cc.Node)
    builds_red: cc.Node = null;

    @property(cc.Sprite)
    spr: cc.Sprite = null
    public tip: cc.Prefab = null;

    block: cc.Node = null;;
    async onLoad()
    {
        // GameSys.gold(5000000);
        console.log("当前金币", GameSys.game.xGet(Config.GOLD).v)
        this.tip = await UtilsManager.loadPrefab(PopupPath.tip) as cc.Prefab;
        GameSys.game.xBind(Config.TIP, this.change_tip.bind(this), BINDER_NAME);
        GameSys.game.xBind(Config.STOCKOUT, this.change_red.bind(this), BINDER_NAME);


        GameSys.game.xBind(Config.BLOCK, this.change_block.bind(this), BINDER_NAME);
        GameSys.game.xBind(Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.ALLRED, this.allRed.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.HIDESHOP, this.hideshop.bind(this), BINDER_NAME)

        GameSys.game.xBind(Config.OPPO, this.change_oppo.bind(this), BINDER_NAME)
        // console.error("查看", Caches.get(Caches.notice), Caches.get(Caches.newGuide))
        if (!Caches.get(Caches.notice))
        {
            this.notice.active = true;
        }
        else
        {
            this.notice.active = false;
            if (!Caches.get(Caches.newGuide))
            {
                this.newGuide.active = true;
            }
        }
        this.allRed()

        if (Caches.get(Caches.newGuide))
        {
            GameSys.game.xSet(Config.OPPO, true)
        }
    }
    oppoNatived: cc.Node = null;
    oppoShow: boolean = false;
    change_oppo(v: boolean)
    {
        if (GameSys.channel != "oppo") return;
        if (this.oppoShow)
        {
            this.oppoShow = false;
            this.oppoNatived.destroy();
        }
        console.log('111');
        this.oppoNatived = cc.instantiate(this.oppo)
        this.oppoNatived.parent = this.node;
        this.oppoShow = true;
        GameSys.showNativeAd(this.oppoNatived.children[0]);
    }
    hideshop(v: boolean)
    {
        this.shop.active = v;
        this.warehouse.active = v;
    }
    allRed()
    {
        this.builds_red.active = false;
        this.warehouse_red.active = false;
        this.recuit_red.active = false;
        //仓库红点展示
        let flagwarehouse = 0;
        MathManager.getInstance().visitLinearArray(WAREHOUSE, (i) =>
        {
            if (WAREHOUSE[i].lock <= GameSys.level)
            {
                flagwarehouse++;
            }
        })
        // console.log(GameSys.level, flagwarehouse, GameSys.game.xGet(Config.WAREHOUSE))
        if (flagwarehouse > GameSys.game.xGet(Config.WAREHOUSE).length)
        {
            this.warehouse_red.active = true;
        }

        //招募红点展示
        let flagrecuit = 0;
        MathManager.getInstance().visitLinearArray(RECRUIT, (i) =>
        {
            if (RECRUIT[i].ID !== 3 && RECRUIT[i].ID !== 7)
            {
                GameSys.judgeGold(RECRUIT[i].price, () =>
                {

                }, () =>
                {
                    flagrecuit++;
                })
            }
        })
        let recuit: number[] = GameSys.game.xGet(Config.RECRUIT)
        let flagcount: number = 0
        MathManager.getInstance().visitLinearArray(recuit, (i) =>
        {
            if (recuit[i] !== 0 && i != 2 && i != 6)
            {
                flagcount++;
            }
        })
        if (recuit[2] == 0 || recuit[6] == 0)
        {
            this.recuit_red.active = true;
        }
        else
        {
            // console.log("+++", flagrecuit, flagcount)
            if (flagrecuit > flagcount)
            {
                this.recuit_red.active = true;
            }
        }

        //建筑和外观红点展示
        let buildings: In_Save_Buildings[] = GameSys.game.xGet(Config.BUILDINGS);
        for (let i = 0; i < BUILDINGS.length; i++)
        {
            if (BUILDINGS[i].lock <= GameSys.level)
            {
                if (buildings[BUILDINGS[i].index].level == 0)
                {
                    if (GameSys.game.xGet(Config.GOLD).v >= BUILDINGS[i].gold)
                    {
                        // console.log(BUILDINGS[i])
                        this.builds_red.active = true;
                        return;
                    }
                }
                else if (buildings[BUILDINGS[i].index].level !== 3 && BUILDINGS[i].level != 3)
                {
                    if (GameSys.game.xGet(Config.GOLD).v >= BUILDINGS[i + 1].gold)
                    {
                        // console.log(BUILDINGS[i])
                        this.builds_red.active = true;
                        return;
                    }
                }
            }
        }

        //升级外标
        let app: In_Save_Apperance[] = GameSys.game.xGet(Config.APPEARANCE);
        for (let i = 0; i < APPEARANCE.length; i++)
        {
            if (APPEARANCE[i].lock_A <= GameSys.level && APPEARANCE[i].gold_A <= GameSys.game.xGet(Config.GOLD).v && !app[i].geta)
            {
                // console.log(APPEARANCE[i])
                this.builds_red.active = true;
                return;
            }
            if (APPEARANCE[i].lock_S <= GameSys.level && APPEARANCE[i].gold_S <= GameSys.game.xGet(Config.GOLD).v && !app[i].gets)
            {
                // console.log(APPEARANCE[i])
                this.builds_red.active = true;
                return;
            }
        }
    }
    hideAll(v: boolean)
    {
        if (v)
        {
            this.shop_red.getComponent(cc.Sprite).enabled = false;
            this.warehouse_red.getComponent(cc.Sprite).enabled = false;
            this.recuit_red.getComponent(cc.Sprite).enabled = false;
            this.builds_red.getComponent(cc.Sprite).enabled = false;
        }
        else
        {
            this.shop_red.getComponent(cc.Sprite).enabled = true;
            this.warehouse_red.getComponent(cc.Sprite).enabled = true;
            this.recuit_red.getComponent(cc.Sprite).enabled = true;
            this.builds_red.getComponent(cc.Sprite).enabled = true;
        }
    }
    private blockDestory: boolean = false;
    private blockHave: boolean = false;
    change_block(data: { state: boolean, spr: boolean, clean: boolean })
    {
        if (!data.state)
        {
            if (!this.blockDestory && this.block != null)
            {
                this.blockDestory = true;
                this.blockHave = false;
                this.block.destroy();
            }
            return;
        }
        if (this.blockHave) return
        this.blockHave = true;
        this.blockDestory = false;
        this.block = cc.instantiate(this.blockPre)
        this.block.parent = this.node;
        this.block.children[0].active = data.spr;
        this.block.children[1].active = data.clean;
    }
    change_red(data: { index: number, v: boolean })
    {
        this.shop_red.active = data.v
    }
    private time: number = 0;
    change_tip(v)
    {
        if (this.time != 0)
            return
        this.time = 1;
        this.scheduleOnce(() =>
        {
            this.time = 0;
        }, 1)
        let tip = cc.instantiate(this.tip)
        this.node.addChild(tip);
        tip.getComponent(Tip).init(v)
    }
    onTouchRecruit()
    {
        if (GameSys.game.xGet(Config.HIDEALL))
            return;
        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
        PopupManager.show(PopupPath.recruit, options, PopupCacheMode.Frequent, PopupShowPriority.None)
    }
    onTouchBuildings()
    {
        if (GameSys.game.xGet(Config.HIDEALL))
            return;
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 0)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 1)
            }
            else
            {
                // GameSys.game.xSet(Config.NEWGUIDECON, 22)
            }
        }
        GameSys.game.xSet(Config.HIDEALL, true)
        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
        PopupManager.show(PopupPath.buildings, options, PopupCacheMode.Frequent, PopupShowPriority.None)
        GameSys.game.xSet(Config.HIDESHOP, false)
    }

    onTouchShop()
    {
        console.log("建筑", GameSys.game.xGet(Config.BUILDINGS))
        console.log("洗手loo_queue", StaticManager.getInstance().loo_queue)
        console.log("厕所toilet_queue_1", StaticManager.getInstance().toilet_queue_1)
        console.log("情况use_buildings", StaticManager.getInstance().use_buildings)

        if (GameSys.game.xGet(Config.HIDEALL))
            return;
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 15)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 16)
            }
        }
        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
        PopupManager.show(PopupPath.shop, options, PopupCacheMode.Frequent, PopupShowPriority.None)
    }
    onTouchWarehouse()
    {
        if (GameSys.game.xGet(Config.HIDEALL))
            return;
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 29)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 30)
            }
        }
        console.log(StaticManager.getInstance().toilet_queue_1)
        const options = (Math.random() * 10000).toFixed(0).padStart(5, '0')
        PopupManager.show(PopupPath.warehouse, options, PopupCacheMode.Frequent, PopupShowPriority.None)
    }
    onTouchStart()
    {
        this.notice.active = false;
        this.newGuide.active = true;
        Caches.set(Caches.notice, true)
    }
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME);
    }
}
