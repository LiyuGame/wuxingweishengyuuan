import GameSys from "../manager/GameSys";
import { Config } from "../manager/Config";
import PopupBase from "./popups/PopupBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IssueVideo extends PopupBase<string>
{
    @property(cc.Node)
    close: cc.Node = null;
    // @property(cc.Label)
    // lab_: cc.Label = null;
    public hasReleased: boolean = false;
    onEnable()
    {
        this.hasReleased = false;
        // let gold: number[] = GameSys.game.xGet(Config.GOLDOFFLINE)
        // console.log("+++++++++++", gold);
        // this.lab_.string = (Math.ceil((Math.abs(gold[1] - gold[0])) / gold[2]) * (Math.floor(Math.random() * 40) + 20) + 100).toString()
        GameSys.showBanner();
        cc.tween(this.close)
            .to(0.3, { scale: 1.2 })
            .delay(0.1)
            .to(0.3, { scale: 1 })
            .delay(0.1)
            .union().repeatForever()
            .start()

        this.node.zIndex = 300
    }
    async onTouch()
    {
        if (this.hasReleased)
        {
            GameSys.game.xSet(Config.TIP, "当前视频已发布")
            return;
        }
        //TODO:发布视频
        let res: boolean = await GameSys.sdk.issueVideo() as boolean;
        if (res)
        {
            this.hasReleased = true;
            GameSys.game.xSet(Config.TIP, "传送成功")
            // GameSys.gold(parseInt(this.lab_.string))
        }
        else
        {
            GameSys.game.xSet(Config.TIP, '传送失败')
        }
    }
    onTouchClose()
    {
        GameSys.hideBanner();
        GameSys.game.xSet(Config.TTOVER)
        this.hide();
    }
}
