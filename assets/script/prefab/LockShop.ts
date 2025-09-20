import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'LockShop'
@ccclass
export default class LockShop extends cc.Component
{
    @property()
    lock: number = 0;

    onLoad()
    {
        GameSys.game.xBind(Config.LEVEL, this.change_state.bind(this), BINDER_NAME)
        this.change_state()
    }
    change_state()
    {
        if (GameSys.level >= this.lock)
        {
            this.node.getComponent(cc.Sprite).enabled = true;
        }
        else
        {
            this.node.getComponent(cc.Sprite).enabled = false;
        }
    }
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
