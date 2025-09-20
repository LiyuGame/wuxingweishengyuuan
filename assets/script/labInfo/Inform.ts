import Caches from "../common/manager/Caches";
import { Config } from "../common/manager/Config";
import DataManager from "../common/manager/DataManager";
import GameSys from "../common/manager/GameSys";
import InformPre from "./InformPre";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Inform'
@ccclass
export default class Inform extends cc.Component
{
    @property(cc.Prefab)
    inform: cc.Prefab = null;

    onLoad()
    {
        GameSys.game.xBind(Config.INFORM, this.change.bind(this), BINDER_NAME)
        GameSys.game.xBind(Config.HIDEALL, this.hideAll.bind(this), BINDER_NAME)
    }
    hideAll(v: boolean)
    {
        v ? this.node.opacity = 0 : this.node.opacity = 255
    }
    change(data: { index: number, v: string, cb: Function })
    {
        if (!Caches.get(Caches.newGuide))
            return;
        if (this.node.childrenCount >= 3)
            return
        if (DataManager.getInstance().getInform(data.index))//如果当前项已经在展示里面了就不再重复展示了
            return
        let inform: cc.Node = cc.instantiate(this.inform)
        inform.parent = this.node;
        inform.getComponent(InformPre).init(data.index, data.v, data.cb)

    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
