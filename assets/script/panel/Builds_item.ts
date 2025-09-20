import Caches from "../common/manager/Caches";
import { Config, In_Save_Buildings } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StateManager from "../common/manager/StateManager";
import StaticManager from "../common/manager/StaticManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Buils_item'
@ccclass
export default class Buils_item extends cc.Component
{
    @property(StateManager)
    button_state: StateManager = null;
    @property(cc.Node)
    select: cc.Node = null;

    @property()
    index: number = 0;//0 1 2 3 4 5 6；//小卫生间，洗手间样式
    onEnable()
    {
        if (this.index < StaticManager.getInstance().open_buildings.length)
        {
            this.button_state.stateChange(0)
        }
        else
        {
            this.button_state.stateChange(1)
        }
        GameSys.game.xBind(Config.BUILDINGSSELECT, this.change_select.bind(this), BINDER_NAME)
        GameSys.game.xSet(Config.BUILDINGSSELECT, 0)
    }
    change_select(index)
    {
        if (this.index == index)
        {
            this.select.active = true;
        }
        else
        {
            this.select.active = false
        }
    }
    //固定屏幕位置
    onTouchDetails()
    {
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.BUILDINGSSELECT, this.index)
        GameSys.game.xSet(Config.SCREENPOS, this.index)

        if (this.index == 0)
        {
            if (!Caches.get(Caches.newGuide))
            {
                if (GameSys.game.xGet(Config.NEWGUIDECON) == 1)
                {
                    GameSys.game.xSet(Config.NEWGUIDECON, 2)
                }
            }
        }
        if (this.index == 1)
        {
            if (!Caches.get(Caches.newGuide))
            {
                if (GameSys.game.xGet(Config.NEWGUIDECON) == 5)
                {
                    GameSys.game.xSet(Config.NEWGUIDECON, 6)
                }
            }
        }
        // if (!Caches.get(Caches.newGuide))
        // {
        //     if (GameSys.game.xGet(Config.NEWGUIDECON) == 4)
        //     {
        //         GameSys.game.xSet(Config.NEWGUIDECON, 5)
        //     }
        // }
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
