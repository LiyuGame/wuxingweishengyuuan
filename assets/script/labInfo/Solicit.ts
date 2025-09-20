import StateManager from "../common/manager/StateManager";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = ''
@ccclass
export default class Solicit extends cc.Component
{

    @property(StateManager)
    state_1: StateManager = null;
    @property(StateManager)
    state_2: StateManager = null;

    onLoad()
    {
        let index: number = 0;
        this.schedule(() =>
        {
            index++;
            index = index % 2
            this.state_1.stateChange(index)
            this.state_2.stateChange(index)
        }, 0.5)

        let y = this.state_2.node.y;
        cc.tween(this.state_2.node)
            .to(0.3, { y: y + 25 })
            .to(0.2, { y: y })
            .delay(3)
            .union().repeatForever()
            .start()
    }
    onDestory() { }
}
