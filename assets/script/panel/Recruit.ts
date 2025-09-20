import PopupBase from "../common/component/popups/PopupBase";
import Caches from "../common/manager/Caches";
import { Config, In_RECRUIT, RECRUIT } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import RecruitItem from "./Recruit_Item";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'RecruitNEW'
@ccclass
export default class Recruit extends PopupBase<string>
{
    @property(cc.PageView)
    page_1: cc.PageView = null;
    @property(cc.Node)
    content_1: cc.Node = null;//已招募面板
    @property(cc.Prefab)
    item: cc.Prefab = null;

    private recuit: number[];
    onLoad()
    {
        this.addChild();
    }
    onEnable()
    {

        // console.log("查看", this.recruit)
        // this.content_1.destroyAllChildren();
        // this.content_2.destroyAllChildren();
        this.node.zIndex = 10;

        if (Caches.get(Caches.newGuide))
        {
            GameSys.game.xSet(Config.OPPO, true)
            GameSys.showBanner();
            GameSys.showInter();
        }
    }
    start()
    {
    }
    onDisable()
    {
        if (Caches.get(Caches.newGuide))
        {
            GameSys.hideBanner();
        }
    }
    addChild()
    {
        this.recuit = GameSys.game.xGet(Config.RECRUIT);
        for (let i = 0; i < Math.ceil(RECRUIT.length / 5); i++)
        {
            let page_recruit = this.content_1.children[i]
            for (let j = 0; j < page_recruit.childrenCount; j++)
            {
                if (i * 5 + j < RECRUIT.length)
                {
                    // console.log("====", page_recruit.children[j])
                    let item: cc.Node = cc.instantiate(this.item)
                    page_recruit.children[j].addChild(item);
                    item.setPosition(cc.v2(0, 0))
                    item.getComponent(RecruitItem).init(this.recuit[i * 5 + j], RECRUIT[i * 5 + j])
                }
            }
        }
    }

    onTouchLeft()
    {
        this.page_1.scrollToPage(this.page_1.getCurrentPageIndex() - 1, 0.3)
    }
    onTouchRight()
    {
        this.page_1.scrollToPage(this.page_1.getCurrentPageIndex() + 1, 0.3)
    }
    onTouchClose()
    {
        this.hide();
    }
    onDestroy()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
