import GameSys from "../manager/GameSys";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Transit extends cc.Component
{
    onTouchClose()
    {
        let value: number = Math.random()
        if (value < 0.1)
        {
            this.node.parent.destroy()
            GameSys.sdk.xSet("hideNative")
        }
    }
    onDestroy()
    {
        this.node.parent.destroy()
        GameSys.sdk.xSet("hideNative")
    }
}