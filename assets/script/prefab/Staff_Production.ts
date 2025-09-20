import AStar from "../common/component/AStar";
import { Config, JSON_PATH, RECRUIT, STAFF_MOVE_LOO, STAFF_MOVE_TOILET_1, STAFF_MOVE_TOILET_2, STAFF_MOVE_TOILET_3 } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";
import MathManager from "../common/manager/MathManager";
import StaticManager from "../common/manager/StaticManager";
import Staff from "./Staff";

const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = 'Staff_Production'
@ccclass
export default class Staff_Production extends AStar
{
    @property(cc.Prefab)
    staff: cc.Prefab = null;

    private recruit: number[] = []
    public all_move: cc.Vec2[] = [];

    static instance: Staff_Production;
    static getInstance(): Staff_Production
    {
        this.instance = this.instance ? this.instance : new Staff_Production();
        return this.instance
    }
    onLoad()
    {
        super.onLoad();
        this.recruit = GameSys.game.xGet(Config.RECRUIT);
        this.Map_Path = []
        this.Map_Path = MathManager.getInstance().transformArray(JSON_PATH)
        this.limit_pos()
        this.add_staff()
    }
    onEnable()
    {
        // GameSys.game.xBind(Config.RECRUITCHANGE, this.recruit_change.bind(this), BINDER_NAME)
    }
    //判断职员可以走到哪里，因为有等级限制
    limit_pos()
    {
        //根据当前解锁了几个 分批次往里加
        MathManager.getInstance().visitLinearArray(STAFF_MOVE_LOO, (i) =>
        {
            this.all_move.push(STAFF_MOVE_LOO[i])
        })
        // MathManager.getInstance().visitLinearArray(STAFF_MOVE_TOILET_1, (i) =>
        // {
        //     this.all_move.push(STAFF_MOVE_TOILET_1[i])
        // })
        // MathManager.getInstance().visitLinearArray(STAFF_MOVE_TOILET_2, (i) =>
        // {
        //     this.all_move.push(STAFF_MOVE_TOILET_2[i])
        // })
        // MathManager.getInstance().visitLinearArray(STAFF_MOVE_TOILET_3, (i) =>
        // {
        //     this.all_move.push(STAFF_MOVE_TOILET_3[i])
        // })
    }

    //判断已经存在职员的情况下 添加职员
    add_staff()
    {
        MathManager.getInstance().visitLinearArray(this.recruit, (i) =>
        {
            if (this.recruit[i] != 0)
            {
                let posStart = this.all_move[Math.floor(Math.random() * this.all_move.length)];
                let staff: cc.Node = cc.instantiate(this.staff);
                staff.parent = this.node;
                staff.scale = 0.23
                staff.getComponent(Staff).initPath(posStart, RECRUIT[i], i)
                StaticManager.getInstance().staff.push(i)
            }
        })
    }
    //点击招募的情况下添加
    recruit_change(_data: { index: number, state: number })
    {
        if (_data.state == 1)
        {
            //加加加
            let posStart = this.all_move[Math.floor(Math.random() * this.all_move.length)];
            let staff: cc.Node = cc.instantiate(this.staff);
            staff.parent = this.node;
            staff.scale = 0.23
            staff.getComponent(Staff).initPath(posStart, RECRUIT[_data.index], _data.index)
            StaticManager.getInstance().staff.push(_data.index)
        }
    }
    //解雇

    onDestory()
    {
        GameSys.game.xUnbind(BINDER_NAME)
    }
}
