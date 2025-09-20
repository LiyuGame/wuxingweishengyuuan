import PopupBase from "../common/component/popups/PopupBase";
import { BUILDINGS, Config, In_BUILDINGS, In_Save_Buildings, LOCK_ROOM } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Buils_Updrage'
@ccclass
export default class Buils_Updrage extends cc.Component
{
    @property(cc.Label)
    lock_lab: cc.Label = null;

    index: number = 0;

    private buildings: In_Save_Buildings[]
    onEnable()
    {
        this.index = parseInt(this.node.name)
        GameSys.game.xBind(Config.BUILDINGSUP, this.change_updrage.bind(this), BINDER_NAME)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch.bind(this))
    }
    clickFlag: boolean = true;
    private lock: number = -1;
    change_updrage(v: boolean)
    {
        this.lock_lab.node.active = v;
        this.node.active = v;
        this.node.getComponent(cc.Sprite).enabled = false;
        this.lock = -1;
        this.lock_lab.string = ""
        this.buildings = GameSys.game.xGet(Config.BUILDINGS)
        this.clickFlag = true;
        if (this.buildings[this.index].level == 0)
        {
            for (let i = 0; i < BUILDINGS.length; i++)
            {
                if (this.index == BUILDINGS[i].index && BUILDINGS[i].level == 1)
                {
                    //0级状态
                    if (GameSys.level >= BUILDINGS[i].lock)
                    {
                        this.node.getComponent(cc.Sprite).enabled = true;
                        this.clickFlag = false;
                        this.lock = 0;
                    }
                    else
                    {
                        this.lock_lab.string = "解锁LV:" + BUILDINGS[i].lock;
                        this.lock_lab.node.color = cc.Color.BLACK
                    }
                    break;
                }
            }
        }
        else if (this.buildings[this.index].level !== 3)
        {
            for (let i = 0; i < BUILDINGS.length; i++)
            {
                if (this.index == BUILDINGS[i].index && BUILDINGS[i].level == this.buildings[this.index].level)
                {
                    //0级状态
                    if (GameSys.level >= BUILDINGS[i].lock)
                    {
                        this.node.getComponent(cc.Sprite).enabled = true;
                        this.clickFlag = false;
                        this.lock = 1;
                    }
                    else
                    {
                        this.lock_lab.string = "解锁LV:" + BUILDINGS[i].lock;
                        this.lock_lab.node.color = cc.Color.BLACK
                    }
                    break;
                }
            }
        }
        else
        {
            this.node.getComponent(cc.Sprite).enabled = true;
        }
        if (this.index == 9 || this.index == 10 || this.index == 11)
        {
            if (GameSys.level < LOCK_ROOM[3])
            {
                this.lock_lab.node.active = false;
            }
        }

    }
    onTouch()
    {
        if (this.clickFlag)
            return
        GameSys.audio.playSFX("audios/close");
        GameSys.game.xSet(Config.BUILDINGSDETAILS, { index: this.index, state: this.lock })
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
