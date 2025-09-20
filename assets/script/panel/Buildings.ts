import PopupBase from "../common/component/popups/PopupBase";
import { BUILDINGS, Config, In_Save_Buildings } from "../common/manager/Config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Buildings extends PopupBase<string>
{
    @property(cc.Prefab)
    item: cc.Prefab = null;
    @property(cc.Node)
    content: cc.Node = null;
    onLoad()
    {
        for (let i = 0; i <= BUILDINGS[BUILDINGS.length - 1].index; i++)
        {
            let item = cc.instantiate(this.item)
            item.parent = this.content;
        }
    }
    onTouchClose()
    {
        this.hide();
    }
}
