import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import MathManager from "../common/manager/MathManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'LockWarhouse'
@ccclass
export default class LockWarhouse extends cc.Component
{
    @property()
    id: number = 0;

    onLoad()
    {
        GameSys.game.xBind(Config.WAREHOUSECHNAGE, this.change_state.bind(this), BINDER_NAME)
        this.change_state()
    }
    change_state()
    {
        let warhouse: number[] = GameSys.game.xGet(Config.WAREHOUSE);
        MathManager.getInstance().visitLinearArray(warhouse, (i) =>
        {
            if (warhouse[i] == this.id - 1)
            {
                this.node.getComponent(cc.Sprite).enabled = true;
            }

        })
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
