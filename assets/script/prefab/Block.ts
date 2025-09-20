import { Config } from "../common/manager/Config";
import DataManager from "../common/manager/DataManager";
import GameSys from "../common/manager/GameSys";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Block'
@ccclass
export default class Block extends cc.Component
{
    @property(cc.Label)
    lab: cc.Label = null;
    @property(cc.Node)
    select: cc.Node = null;
    @property(cc.Node)
    item: cc.Node[] = [];

    onEnable()
    {
        this.node.zIndex = 10

        for (let i = 0; i < this.item.length; i++)
        {
            this.item[i].color = cc.Color.WHITE;
        }
        this.select.position = this.item[0].position;
        GameSys.game.xBind(Config.GARBAGEOPACITY, this.change_select.bind(this), BINDER_NAME)

        if (DataManager.getInstance().cleanGarbageInfo)
        {
            this.lab.string = DataManager.getInstance().cleanGarbageInfo.item_tips1
        }
    }

    change_select(index: number)
    {
        if (index == -1) return
        if (index == 3)
        {
            this.select.active = false;
            this.lab.string = "清洁完成"
            console.log("完成")
            return;
        }
        if (index == 2)
        {
            return;
        }
        this.item[index].color = cc.Color.GRAY;
        index = index + 1;
        cc.tween(this.select)
            .to(0.1, { position: this.item[index].position })
            .call(() =>
            {
                if (index - 1 == 0)
                {
                    this.lab.string = DataManager.getInstance().cleanGarbageInfo.item_tips2
                }
                if (index - 1 == 1)
                {
                    this.lab.string = DataManager.getInstance().cleanGarbageInfo.item_tips3
                }
            })
            .start();
    }
    onDisable()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }

}
