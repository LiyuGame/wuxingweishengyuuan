import Caches from "../common/manager/Caches";
import { APPEARANCE, Config, LOCK_ROOM, LOO_LOOKON } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import Magnify from "../labInfo/Magnify";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Buildings_app'
@ccclass
export default class Buildings_app extends cc.Component
{
    index: number = 0
    label: cc.Node = new cc.Node;
    onLoad()
    {
        this.index = parseInt(this.node.name)
        GameSys.game.xBind(Config.BUILDINGSAPP, this.change_app.bind(this), BINDER_NAME)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch.bind(this))

        this.node.addChild(this.label);
        this.label.addComponent(cc.Label)
        this.label.getComponent(cc.Label).fontSize = 30
        this.label.getComponent(cc.Label).lineHeight = 30
        // this.label.getComponent(cc.Label).cacheMode = cc.Label.CacheMode.CHAR
        this.label.getComponent(cc.Label).string = APPEARANCE[this.index].name
        this.label.active = false;
        this.label.x = 0;
        this.label.y = -10;
    }
    private open: boolean = false
    change_app(data: { index: number, state: boolean })
    {
        if (data.index == this.node.parent.parent.getComponent(Magnify).index)
        {
            this.node.getComponent(cc.Sprite).enabled = data.state;
            this.open = true
            this.label.active = data.state
            // this.node.children[0].getComponent(cc.Label).string = APPEARANCE[this.index].name
        }
        else
        {
            if (this.open)
            {
                this.node.getComponent(cc.Sprite).enabled = false
                this.label.active = false;
                this.open = false;
            }
        }
        // if (this.index == 31 || this.index == 32 || this.index == 33)
        // {
        //     if (GameSys.level < LOCK_ROOM[3])
        //     {
        //         this.app.active = false;
        //     }
        // }

    }
    onTouch()
    {
        if (!this.node.getComponent(cc.Sprite).enabled)
            return
        if (!Caches.get(Caches.newGuide))
        {
            if (GameSys.game.xGet(Config.NEWGUIDECON) == 11)
            {
                GameSys.game.xSet(Config.NEWGUIDECON, 12)
            }
        }

        // console.log("测试", this.index)
        GameSys.game.xSet(Config.APPITEM, {
            index: this.index,
            state: true
        })
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
