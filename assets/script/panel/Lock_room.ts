import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StaticManager from "../common/manager/StaticManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'lock_room'
@ccclass
export default class Lock_Room extends cc.Component
{
    @property(cc.Node)
    toilet_3: cc.Node = null;
    @property(cc.Node)
    heye: cc.Node = null;
    @property(cc.Node)
    toilet_3_32: cc.Node = null;

    onLoad()
    {
        if (StaticManager.getInstance().open_buildings.length >= 4)
        {
            this.toilet_3_32.active = true
            this.toilet_3.active = true;
            this.heye.active = true;
        }
        GameSys.game.xBind(Config.LOCKROOM, this.changeSate.bind(this), BINDER_NAME)
    }
    changeSate()
    {
        this.toilet_3.active = true;
        let y = this.toilet_3.y
        let heyeY = this.heye.y
        this.toilet_3.y = y + 200;
        this.heye.y = heyeY + 200
        cc.tween(this.toilet_3)
            .to(1, { y: y })
            .start()
        cc.tween(this.heye)
            .to(1, { y: heyeY })
            .start()
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
