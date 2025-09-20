import { BUILDINGS, Config, In_BUILDINGS, In_Save_Buildings } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Loo'
@ccclass
export default class Loo extends cc.Component
{
    @property(cc.Node)
    hide: cc.Node = null;
    @property(cc.Node)
    mask: cc.Node[] = [];
    @property(cc.Node)
    time_node: cc.Node[] = []
    @property(cc.Node)
    loo_item: cc.Node[] = [];
    @property
    upper: number = 3;
    @property
    lower: number = 0
    @property
    index: number = 0
    //换一种思路，不去生成，就置为false
    private buildings: In_Save_Buildings[] = []
    onLoad()
    {
        this.buildings = GameSys.game.xGet(Config.BUILDINGS);
        // console.log("洗手池处判断", this.buildings);
        //前三个0,1,2表示的是洗手池
        for (let j = 0; j < BUILDINGS.length; j++)
        {

        }
        for (let i = this.lower; i < this.upper; i++)
        {
            if (this.buildings[i].level !== 0 || this.buildings[i].upgrade != 0)
            {
                //TODO:这里要考虑一下，去除遮罩的动画，每个遮罩只能执行一次
                this.mask[i - this.index * 3].active = false;
                this.loo_item[i - this.index * 3].active = true;//TODO先这样写，后续写到继续修改
            }
            if (this.buildings[i].upgrade != 0)
            {
                this.time_node[i - this.index * 3].active = true
            }
        }
        GameSys.game.xBind(Config.BUILDINGSUPDATE, this.change_state.bind(this), BINDER_NAME)
        // / GameSys.game.xBind(Config.HIDEBUILDINGS, this.change_hide.bind(this), BINDER_NAME)
    }
    change_hide(_data: { index: number, v: boolean })
    {
        if (_data.index >= this.lower && _data.index < this.upper)
        {
            this.hide.active = _data.v
        }
    }
    change_state(index: number)
    {
        //改变状态
        if (index >= this.lower && index < this.upper)
        {
            //012
            //第一次建筑,这里涉及到升级时间
            if (this.buildings[index].level == 0)
            {
                this.mask[index - this.index * 3].active = false;
                cc.tween(this.mask[index - this.index * 3])
                    .to(0.5, { y: this.mask[index - this.index * 3].y + 400 })
                    .call(() =>
                    {
                        let y = this.loo_item[index - this.index * 3].y
                        this.loo_item[index - this.index * 3].y += 400;
                        cc.tween(this.loo_item[index - this.index * 3])
                            .to(0.5, { y: y })
                            .call(() =>
                            {
                                this.time_node[index - this.index * 3].active = true;
                            })
                            .start()
                    })
                    .start()
                this.loo_item[index - this.index * 3].active = true;
            }
            else
            {
                this.time_node[index - this.index * 3].active = true;
                // this.time_node[index].getComponent().init(_index)
            }
        }
    }
    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
