import PopupBase from "../common/component/popups/PopupBase";
import Caches from "../common/manager/Caches";
import { Config, In_Save_Shop, SHOP, SHOP_POS, TipLab } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import MathManager from "../common/manager/MathManager";
import StateManager from "../common/manager/StateManager";
import Shop_Item from "./Shop_item";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Shop'
@ccclass
export default class Shop extends PopupBase<string>
{
    @property(cc.Prefab)
    reduce: cc.Prefab = null;

    @property(cc.Node)
    touch_buy: cc.Node = null;
    @property(cc.PageView)
    page: cc.PageView = null;
    @property(cc.Prefab)
    page_pre: cc.Prefab = null;
    @property(cc.Prefab)
    item: cc.Prefab = null;
    @property(StateManager)
    button_state: StateManager = null;

    @property(cc.Label)
    commodity_name: cc.Label = null;
    @property(cc.Label)
    buy_lab: cc.Label = null;
    @property(cc.Label)
    sell_lab: cc.Label = null;
    @property(cc.Label)
    overlay_lab: cc.Label = null;
    @property(cc.Label)
    result_name: cc.Label = null;
    @property(cc.Label)
    result_lab: cc.Label = null;
    @property(cc.Label)
    jiesuan_lab: cc.Label = null;

    private shop: In_Save_Shop
    private index: number = 0;
    onLoad()
    {
        this.add_page();
        this.touch_buy.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this))
        this.touch_buy.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this))
        this.touch_buy.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this))
        GameSys.game.xBind(Config.SHOPCHANGE, this.change_shop.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.SELECTSHOP, this.change_data.bind(this), BINDER_NAME)
    }
    static instance: Shop

    static getInstance(): Shop
    {
        this.instance = this.instance ? this.instance : new Shop();
        return this.instance
    }
    onEnable()
    {
        this.shop = GameSys.game.xGet(Config.SHOP);
        this.node.zIndex = 10;
        GameSys.game.xSet(Config.SELECTSHOP, 0)
        this.index = GameSys.game.xGet(Config.SELECTSHOP)

        if (Caches.get(Caches.newGuide))
        {
            GameSys.game.xSet(Config.OPPO, true)
            GameSys.showBanner();
            GameSys.showInter();
        }
    }
    onDisable()
    {
        if (Caches.get(Caches.newGuide))
        {
            GameSys.hideBanner();
        }
    }
    add_page()
    {
        for (let i = 0; i < Math.ceil(SHOP.length / 8); i++)
        {
            let page = cc.instantiate(this.page_pre)
            this.page.addPage(page);
            for (let j = 0; j < 8; j++)
            {
                if (i * 8 + j < SHOP.length)
                {
                    let item: cc.Node = cc.instantiate(this.item)
                    item.parent = page;
                    item.getComponent(Shop_Item).init(SHOP[i * 8 + j], i * 8 + j, this.index)
                }
            }
        }
    }
    onTouchLeft()
    {
        this.page.scrollToPage(this.page.getCurrentPageIndex() - 1, 0.3)
    }
    onTouchRight()
    {
        this.page.scrollToPage(this.page.getCurrentPageIndex() + 1, 0.3)
    }
    change_shop()
    {
        this.overlay_lab.string = this.shop[this.index].count.toString() + "/" + SHOP[this.index].overlay.toString();
    }
    change_data(_index: number)
    {
        this.index = _index
        // this.result_name.string = ''
        // this.result_lab.string = ''
        // this.commodity_name.string = ''
        // this.buy_lab.string = ''
        // this.sell_lab.string = ''
        // this.overlay_lab.string = ''

        this.commodity_name.string = SHOP[_index].name;
        this.buy_lab.string = SHOP[_index].buy.toString();
        this.sell_lab.string = SHOP[_index].sell.toString();
        this.overlay_lab.string = this.shop[_index].count.toString() + "/" + SHOP[_index].overlay.toString();

        this.jiesuan_lab.string = (SHOP[_index].jiesuan * 100).toString() + "%"

        if (SHOP[_index].use_time == 0)
        {
            this.result_name.string = "清洁度"
            if (SHOP[_index].clean == 0)
            {
                this.result_lab.string = "无"
            }
            else
            {
                this.result_lab.string = `${SHOP[_index].clean * 100}%`
            }
        }
        else
        {
            this.result_name.string = "使用时间"
            this.result_lab.string = `${SHOP[_index].use_time}秒`
        }

        //判断当是否解锁
        if (GameSys.level >= SHOP[_index].lock)
        {
            this.button_state.stateChange(0)
        }
        else
        {
            this.button_state.node.children[1].children[0].getComponent(cc.Label).string = "解锁等级：" + SHOP[_index].lock
            this.button_state.stateChange(1)
        }
    }
    onTouchBuy()
    {
        if (this.shop[this.index].count < SHOP[this.index].overlay)
        {
            GameSys.game.xSet(Config.STOCKOUT, {
                index: this.index,
                v: false
            })
            GameSys.useGold(-SHOP[this.index].buy, () =>
            {
                GameSys.game.xSet(Config.SHOPCHANGE, {
                    ID: this.shop[this.index].ID,
                    count: this.shop[this.index].count + 1,
                })
                let goldAnim: cc.Node = cc.instantiate(this.reduce);
                this.touch_buy.addChild(goldAnim);
                goldAnim.y = 30;
                goldAnim.x = 0;
                goldAnim.children[0].getComponent(cc.Label).string = "-" + SHOP[this.index].buy.toFixed(0);
                cc.tween(goldAnim)
                    .to(1, { y: goldAnim.y + 50, opacity: 100 })
                    .call(() =>
                    {
                        goldAnim.destroy();
                    })
                    .start()

                this.overlay_lab.string = this.shop[this.index].count.toString() + "/" + SHOP[this.index].overlay.toString();
            })
        }
    }
    onTouchStart()
    {
        GameSys.audio.playSFX("audios/button");
        if (this.shop[this.index].count == SHOP[this.index].overlay)
        {
            GameSys.game.xSet(Config.TIP, TipLab.levelCap)
            return;
        }
        this.onTouchBuy();
        this.scheduleOnce(() =>
        {
            this.schedule(() =>
            {
                this.onTouchBuy();
            }, 0.05)
        }, 0.5)

    }
    onTouchEnd()
    {
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 16)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 17)
            }
        }
        this.unscheduleAllCallbacks();
    }
    onTouchLock()
    {
        //解锁
        GameSys.game.xSet(Config.TIP, "等级不够")
    }
    onTouchClose()
    {
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 17)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 18)
            }
        }
        this.hide();
    }

    onDestory()
    {

    }
}
