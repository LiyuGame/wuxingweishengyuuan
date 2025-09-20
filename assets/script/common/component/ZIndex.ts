const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = ''
@ccclass
export default class NewClass extends cc.Component
{

    @property()
    index: number = 0;

    onLoad()
    {
        this.node.zIndex = this.index
    }
    onDestory() { }
}
