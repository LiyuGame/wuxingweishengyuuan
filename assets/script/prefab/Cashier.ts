import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Cashier'
@ccclass
export default class Cashier extends cc.Component
{
    onLoad()
    {
        GameSys.game.xBind(Config.HIDEALL, this.change_hide.bind(this), BINDER_NAME)
    }
    change_hide(v: boolean)
    {
        v ? this.node.opacity = 0 : this.node.opacity = 255
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
