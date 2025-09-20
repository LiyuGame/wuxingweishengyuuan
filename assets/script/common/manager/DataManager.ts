import Changee_Appearance from "../../panel/Change_Appearance";
import Caches from "./Caches";
import { BUILDINGS, CLIENT, Config, Garbage, HandDown, In_CLEANGARBAGE, In_Client, LOCK_ROOM, LOO_QUEUE, SHOP_QUEUE, TOILET_QUEUE_1, TOILET_QUEUE_2, TOILET_QUEUE_3 } from "./Config";
import GameSys from "./GameSys";
import MathManager from "./MathManager";
import StaticManager from "./StaticManager";

export default class DataManager
{
    static instance: DataManager

    static getInstance(): DataManager
    {
        this.instance = this.instance ? this.instance : new DataManager();
        return this.instance
    }
    queue: number = 0;//控制人数
    stRectime: number = 0;
    //一些需要在进入游戏时提前改变的变量
    initData()
    {
        this.use_buildings();
        this.loo_queue()
        this.fallings_null = HandDown[0].chance;//初始10000
        this.garbgeCout = Garbage[0].chance;
        GameSys.game.xSet(Config.MAGNIFY, {
            index: 0,
            state: true
        })
        GameSys.game.xSet(Config.BUILDINGSAPP, {
            index: 0,
            state: false
        })
        GameSys.game.xSet(Config.APPITEM, {
            index: 0,
            state: false
        })
        GameSys.game.xSet(Config.BLOCK, {
            state: false,
            spr: false,
            clean: false
        })
        GameSys.game.xSet(Config.SCREENPOS, 0)
        this.garbageNode = new cc.Node();
    }

    //静态变量正在使用建筑,正在升级的建筑
    use_buildings()
    {
        //1.初始化静态使用建筑物布尔值
        let index = 0;
        MathManager.getInstance().visitLinearArray(BUILDINGS, (row) =>
        {
            //这样写的好处时能阻止建筑的升级不是固定三个的情况
            if (BUILDINGS[row].index > index)
            {
                index = BUILDINGS[row].index;
            }
        })
        for (let i = 0; i <= index; i++)
        {
            StaticManager.getInstance().use_buildings.push(false);
        }
        // console.error(GameSys.game.xGet(Config.LOCKROOM))
        MathManager.getInstance().visitLinearArray(LOCK_ROOM, (i) =>
        {
            if (GameSys.game.xGet(Config.LOCKROOM)[i])
            {
                StaticManager.getInstance().open_buildings.push(i)
            }
        })
    }
    //LOO_QUEUE洗手间排队位置
    loo_queue()
    {
        MathManager.getInstance().visitLinearArray(LOO_QUEUE, (row) =>
        {
            //这样写的好处时能阻止建筑的升级不是固定三个的情况
            StaticManager.getInstance().loo_queue.push(false)
        })
        MathManager.getInstance().visitLinearArray(TOILET_QUEUE_1, (row) =>
        {
            //这样写的好处时能阻止建筑的升级不是固定三个的情况
            StaticManager.getInstance().toilet_queue_1.push(false)
        })
        MathManager.getInstance().visitLinearArray(TOILET_QUEUE_2, (row) =>
        {
            //这样写的好处时能阻止建筑的升级不是固定三个的情况
            StaticManager.getInstance().toilet_queue_2.push(false)
        })
        MathManager.getInstance().visitLinearArray(TOILET_QUEUE_3, (row) =>
        {
            //这样写的好处时能阻止建筑的升级不是固定三个的情况
            StaticManager.getInstance().toilet_queue_3.push(false)
        })
        MathManager.getInstance().visitLinearArray(SHOP_QUEUE, (row) =>
        {
            StaticManager.getInstance().shop_queue.push(false)
        })
    }

    garbgeCout: number = 0;
    //留下脏物
    garbage(_room: string)
    {
        let chance: number = Garbage[0].chance;
        let curRoom: number[] = [];
        let ID: number[] = [];
        ID.push(Garbage[0].ID)
        curRoom.push(Garbage[0].chance)
        for (let i = 1; i < Garbage.length; i++)
        {
            if (Garbage[i].room == _room)
            {
                chance += Garbage[i].chance;
                curRoom.push(chance);
                ID.push(Garbage[i].ID)
            }
        }
        let random: number = Math.random() * chance;
        let ID_index: number;
        for (let i = 0; i < curRoom.length; i++)
        {
            if (random <= curRoom[i])
            {
                ID_index = ID[i];
                break;
            }
        }
        if (ID_index != 0)
        {
            Garbage[0].chance = this.garbgeCout
        }
        else
        {
            Garbage[0].chance -= 500
            if (Garbage[0].chance < 0)
            {
                Garbage[0].chance = 0;
            }
        }
        // console.log("脏物", random, chance, curRoom, ID_index)
        return ID_index
    }
    //掉落物件
    fallings_null: number = 0;
    fallings(_room: string): number
    {
        let chance: number = HandDown[0].chance;
        let curRoom: number[] = []
        let ID: number[] = [];
        ID.push(HandDown[0].ID)
        curRoom.push(HandDown[0].chance)
        for (let i = 1; i < HandDown.length; i++)
        {
            if (HandDown[i].room == _room)
            {
                chance += HandDown[i].chance;
                curRoom.push(chance);
                ID.push(HandDown[i].ID)
            }
        }
        let random: number = Math.random() * chance;
        let ID_index: number;
        // console.log("掉落概率查看", random, curRoom)
        for (let i = 0; i < curRoom.length; i++)
        {
            if (random < curRoom[i])
            {
                ID_index = ID[i];
                break;
            }
        }
        if (ID_index != 0)
        {
            HandDown[0].chance = this.fallings_null
        }
        else
        {
            HandDown[0].chance -= 500
            if (HandDown[0].chance <= 0)
            {
                HandDown[0].chance = 0;
            }
        }
        return ID_index
    }
    /**
     * 
     * @param price 基础价格
     * @param pecentage 浮动
     */
    floating(price: number, pecentage: number)
    {
        let upper: number = price + price * 0.15;
        let lower: number = price - price * 0.15;
        return Math.ceil(Math.random() * (upper - lower) + lower);
    }

    queue_loo: boolean[] = [false, false]
    //队伍移动
    action()
    {
        let canMove: boolean = false;

        MathManager.getInstance().visitLinearArray(this.queue_loo, (i) =>
        {
            if (this.queue_loo[i] == false)
            {

            }

        })
    }
    //头顶道具
    odds()
    {
        let odds: number[]
        let temp: number = 0;
        let props: In_Client[]
        MathManager.getInstance().visitLinearArray(CLIENT, (i) =>
        {
            temp = temp + CLIENT[i].odds;
            odds.push(temp)
            props.push(CLIENT[i])
        })
        return [odds, props]
    }

    //封装掉落
    packagingDrop(index: number, name: string)
    {
        let flag = false;
        for (let i = 0; i < 2; i++)
        {
            if (StaticManager.getInstance().falllings[index][i] == 0)
            {
                flag = true;
            }
        }

        if (flag)//可以继续掉落
        {
            //可以遗落物品
            if (StaticManager.getInstance().falllings[index][0] == 0)
            {
                let ID = DataManager.getInstance().fallings(name)
                if (!Caches.get(Caches.newGuide))
                {
                    ID = 4;
                }
                if (ID != 0)
                {
                    for (let i = 1; i < HandDown.length; i++)
                    {
                        if (HandDown[i].ID == ID)
                        {
                            //产生掉落
                            // console.log("发生掉落", HandDown[i])

                            GameSys.game.xSet(Config.FALLINGGOODS, {
                                // price: DataManager.getInstance().floating(HandDown[i].price, HandDown[i].percentage),
                                path: HandDown[i],
                                index: index,
                            })
                            StaticManager.getInstance().falllings[index][0] = 1
                            GameSys.game.xSet(Config.FALLINGRED, index)
                            break;
                        }
                    }
                }
            }
            //可以掉落脏物
            if (StaticManager.getInstance().falllings[index][1] == 0)
            {
                let garbgeId = DataManager.getInstance().garbage(name)
                if (!Caches.get(Caches.newGuide))
                {
                    garbgeId = 7;
                }
                if (garbgeId != 0)
                {
                    for (let i = 0; i < Garbage.length; i++)
                    {
                        if (Garbage[i].ID == garbgeId)
                        {
                            //掉落脏物
                            GameSys.game.xSet(Config.GRAPHICS, {
                                //TODO:周日继续TODO
                                path: Garbage[i],
                                index: index,
                            })
                            StaticManager.getInstance().falllings[index][1] = 1
                            GameSys.game.xSet(Config.FALLINGRED, index)
                        }
                    }
                }
            }
        }
    }
    //判断当前是否有空闲
    leisure: boolean[] = [true, true, true, true, true, true, true, true, true, true, true, true];

    //判断当前是否有需要打扫
    needClean: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false];
    setClean(index: number, state: boolean)
    {
        this.needClean[index] = state;
    }
    getClean(index: number): boolean
    {
        console.log("不会吧", this.needClean)
        return this.needClean[index];
    }

    setLeisure(index: number, state: boolean)
    {
        this.leisure[index] = state;
    }
    getLeisure(index: number): boolean
    {
        return this.leisure[index];
    }
    //封装垃圾
    packagingGarbage(index: number)
    {
        let flag = false;
        for (let i = 0; i < 2; i++)
        {
            if (StaticManager.getInstance().falllings[index][i] == 0)
            {
                flag = true;
            }
        }
        // console.warn(index, StaticManager.getInstance().falllings)
        if (flag)//可以继续掉落
        {
            //可以掉落脏物
            if (StaticManager.getInstance().falllings[index][1] == 0)
            {
                let garbgeId = 7;
                if (index < 3)
                {
                    garbgeId = 7;
                }
                else
                {
                    garbgeId = 1
                }
                for (let i = 0; i < Garbage.length; i++)
                {
                    if (Garbage[i].ID == garbgeId)
                    {
                        //掉落脏物
                        GameSys.game.xSet(Config.GRAPHICS, {
                            //TODO:周日继续TODO
                            path: Garbage[i],
                            index: index,
                        })
                        StaticManager.getInstance().falllings[index][1] = 1
                        GameSys.game.xSet(Config.FALLINGRED, index)
                    }
                }
            }
        }
    }

    //通知
    inform: number[] = []

    getInform(v: number): boolean
    {
        if (this.inform.indexOf(v) == -1)
        {
            this.inform.push(v)
            return false
        }
        else
        {
            return true;
        }
    }
    spliceInform(v: number)
    {
        this.inform.splice(this.inform.indexOf(v), 1);
    }


    garbageItem: cc.Node
    garbageNode: cc.Node;
    cleanGarbageInfo: In_CLEANGARBAGE = null;
    checkOnTarget(location)
    {
        let node: cc.Node = this.garbageNode;
        // console.log("---", node)
        //获取target节点在父容器的包围盒，返回一个矩形对象
        if (node.name == "")
        {
            console.log("====")
            return false
        }
        let rect: cc.Rect = node.getBoundingBoxToWorld();
        //console.log(node)
        let point = location
        //if (cc.rectContainsPoint(rect, targetPoint)) {
        //Creator2.0使用rect的成员contains方法
        if (rect.contains(point))
        {
            return true;
        } else
        {
            return false
        }
    }
    garbageFlag: number = 0;

    oppoNatived: cc.Node;
}