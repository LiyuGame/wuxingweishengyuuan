import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import MathManager from "../common/manager/MathManager";
import PoolManager from "../common/manager/PoolManager";
import GoldAnim from "../labInfo/GoldAnim";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Counter'
@ccclass
export default class Counter extends cc.Component
{
    @property(cc.Prefab)
    goldPre: cc.Prefab = null;

    onLoad()
    {
        console.log(this.node.name)
        PoolManager.getInstance().initGoldPool(this.goldPre, 200);

        GameSys.game.xBind(Config.INSTANTIATEGOLD, this.change_gold.bind(this), BINDER_NAME)
    }
    private count: number = 0;
    change_gold(_data: { price: number, pos: cc.Vec3, click: boolean })
    {
        let num: number = 0;
        if (_data.click)
        {
            if (_data.price < 10)
            {
                num = 1;
            }
            else if (_data.price < 50)
            {
                num = 2;
            }
            else
            {
                num = 5
            }
        }
        else
        {
            num = 1;
        }

        // _data.pos = this.node.convertToNodeSpaceAR(_data.pos)
        GameSys.audio.playSFX("audios/dropGold");
        for (let i = 0; i < num; i++)
        {
            this.count++;
            let bindername = `goldAnim${this.count}${i}`
            let jinbi_icon = PoolManager.getInstance().getGold();
            // let jinbi_icon: cc.Node = cc.instantiate(this.goldPre);
            jinbi_icon.x = _data.pos.x;
            jinbi_icon.y = _data.pos.y;
            // jinbi_icon.zIndex = 5
            this.node.addChild(jinbi_icon);
            jinbi_icon.getComponent(GoldAnim).init(_data.price / num, bindername, _data.click)
            // PoolManager.getInstance().saveGoldNode(jinbi_icon)
        }

        // this.count++;

        // let gold: cc.Node = PoolManager.getInstance().getGold();
    }

    //声音响应
    jinbi_shengyin()
    {
        let action1 = cc.delayTime(0.15);
        let action2 = cc.callFunc(() =>
        {
            // music.playSound("goldcollect");
        }, this, 10);
        let actionlist = cc.sequence(action1, action2).repeatForever();
        // this.font_coin.runAction(actionlist);

    }

    // //数字变化动画
    // num_action(num)
    // {
    //     this.bj_coin += num;

    //     let action1 = cc.scaleTo(0.1, 1.3);
    //     let action2 = cc.callFunc(() =>
    //     {
    //         this.font_coin.getComponent(cc.Label).string = this.bj_coin;
    //     }, this, 10);
    //     let action3 = cc.delayTime(0.1);
    //     let action4 = cc.scaleTo(0.1, 1);
    //     let action5 = cc.callFunc(() =>
    //     {
    //         this.font_coin.stopAllActions();
    //     }, this, 10);
    //     let actionlist = cc.sequence(action1, action2)
    // }
    onTouchGet()
    {
        // for (let i = 0; i < this.node.childrenCount; i++)
        // {
        //     if ((this.node.children[i].getComponent(GoldAnim)))
        //     {

        //         console.log(this.node.children[i].getComponent(GoldAnim))
        //         this.node.children[i].getComponent(GoldAnim).onTouchEnd()
        //     }
        // }
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
