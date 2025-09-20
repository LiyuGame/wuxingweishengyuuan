import { Config } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = ''
@ccclass
export default class Builds_State extends cc.Component
{
    @property()
    index: number = 0
    onEnable()
    {
        // console.error(this.node.name)
        // if (this.index == 0)
        // {
        //     GameSys.game.xSet(Config.BUILDINGSAPP, false)
        //     GameSys.game.xSet(Config.BUILDINGSUP, true)
        // }
        // else
        // {
        //     GameSys.game.xSet(Config.BUILDINGSUP, false)
        //     GameSys.game.xSet(Config.BUILDINGSAPP, true)
        // }
    }
}
