import GameSys from "../manager/GameSys";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Share extends cc.Component
{
    onLoad()
    {
        this.node.active = GameSys.share;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchShare.bind(this))
    }

    async onTouchShare()
    {
        GameSys.audio.playSFX("audios/click");

        let res = await GameSys.sdk.shareApp() as boolean;
        if (res)
        {

        }
        else
        {

        }
    }

}
