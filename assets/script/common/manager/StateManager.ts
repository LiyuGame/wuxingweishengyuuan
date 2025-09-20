const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("按钮组件/StateManager")
export default class StateManager extends cc.Component
{
    public nowState: number = 0;
    static use_buildings: any;
    //public allState: number = 0;

    start()
    {
        //this.allState = this.node.childrenCount;
    }

    async stateChange(v: number)
    {
        for (let i: number = 0; i < this.node.children.length; i++)
        {
            this.node.children[i].active = false;
        }
        if (v >= 0 && v < this.node.children.length)
        {
            this.nowState = v;
            this.node.children[v].active = true;
            return this.node.children[v];
        }
    }
    //全部展示
    stateAll(v: number)
    {
        if (v >= 0 && v < this.node.children.length)
        {
            for (let i: number = 0; i < v; i++)
            {
                this.node.children[i].active = true;
            }
        }
    }
    //全部隐藏
    stateHide()
    {
        for (let i: number = 0; i < this.node.children.length; i++)
        {
            this.node.children[i].active = false;
        }
    }
}
