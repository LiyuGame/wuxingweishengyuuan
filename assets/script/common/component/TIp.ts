import { Config } from "../manager/Config";
import GameSys from "../manager/GameSys";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Tip extends cc.Component
{
    @property(cc.Label)
    public label: cc.Label = null;

    init(_label: string)
    {
        this.label.string = _label;
        this.node.zIndex = 120;
        cc.tween(this.node)
            .to(0.2, { y: this.node.y + 100 })
            .delay(0.5)
            .to(0.5, { opacity: 0 })
            .call(() =>
            {
                this.label.string = '';
                this.node.destroy();
            })
            .start()
    }
}
