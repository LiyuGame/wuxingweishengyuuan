import Caches from "../common/manager/Caches";
import { Config, In_Save_Buildings, LOCK_ROOM } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import StateManager from "../common/manager/StateManager";
import StaticManager from "../common/manager/StaticManager";
import Lock_Room from "./Lock_room";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Buildings_facade'
@ccclass
export default class Buildings_Facade extends cc.Component
{
    @property(cc.Node)
    select: cc.Node = null;

    @property()
    index: number = 0;//0 1 2 3 4 5 6；//小卫生间，洗手间样式
    @property()
    posIndex: number = 0;

    onLoad()
    {
        GameSys.game.xBind(Config.APPSELECT, this.change_select.bind(this), BINDER_NAME)
        GameSys.game.xSet(Config.APPSELECT, 0)
        if (this.node.name == "toilet_3")
        {
            if (GameSys.level < LOCK_ROOM[3])
            {
                this.node.active = false;
                let unlock: cc.Node = this.node.getChildByName('unlock')
                unlock.active = true;
            }
            else
            {
                this.node.active = true;
            }
        }
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
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 10)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 11)
            }
        }

        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.APPSELECT, this.index)
        // GameSys.game.xSet(Config.SCREENPOS, this.posIndex)
        GameSys.game.xSet(Config.MAGNIFY, {
            index: this.index,
            state: true
        })
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
