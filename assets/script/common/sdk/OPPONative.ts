import { Config } from "../manager/Config";
import GameSys from "../manager/GameSys";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = ''
@ccclass
export default class OPPONatived extends cc.Component
{
    onLoad() { }
    onDestory()
    {
        console.log("销毁节点")
        // GameSys.game.xSet(Config.OPPO, false)
    }
}
