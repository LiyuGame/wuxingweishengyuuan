import MathManager from "./MathManager";

/*一些静态控制变量存放*/
export default class StaticManager
{
    static instance: StaticManager

    static getInstance(): StaticManager
    {
        this.instance = this.instance ? this.instance : new StaticManager();
        return this.instance
    }
    //当前开放的建筑物
    open_buildings: number[] = []
    //使用的建筑物//这个数量写在哪里好呢，比如我们来新建一个DataManager来管理这些生成的东西吧，对就是这样
    use_buildings: boolean[] = [];
    //洗手间排队位置
    loo_queue: boolean[] = [];
    //左一厕所排队位置
    toilet_queue_1: boolean[] = []
    //右一厕所排队位置
    toilet_queue_2: boolean[] = []
    //右二厕所排队位置
    toilet_queue_3: boolean[] = []
    //清洁人员推入数组
    staff: number[] = []
    //等待人员推入数组
    shop_queue: boolean[] = [];

    //保存两个金币计数
    goldCount: number = -1;
    goldPreSecond: number = 0//两次间隔多少秒

    //房间掉落情况
    falllings: number[][] = [
        [0, 0], [0, 0], [0, 0],
        [0, 0], [0, 0], [0, 0],
        [0, 0], [0, 0], [0, 0],
        [0, 0], [0, 0], [0, 0],
    ]
    // change_state(pos: number, index: number, state: boolean)
    // {
    //     if (pos == 0)
    //     {
    //         this.loo_queue[index] = state;
    //     }
    //     else if (pos == 1)
    //     {
    //         this.toilet_queue_1[index] = state;
    //     } else if (pos == 2)
    //     {
    //         this.toilet_queue_2[index] = state;
    //     } else if (pos == 3)
    //     {
    //         this.toilet_queue_3[index] = state;
    //     }
    // }
    // flag(pos: number): number
    // {
    //     let flag_queue: number = -1
    //     if (pos == 0)
    //     {
    //         MathManager.getInstance().visitLinearArray(StaticManager.getInstance().loo_queue, (i) =>
    //         {
    //             if (StaticManager.getInstance().loo_queue[i])
    //             {
    //                 flag_queue = i;
    //             }
    //         })
    //     }
    //     else if (pos == 1)
    //     {
    //         MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_1, (i) =>
    //         {
    //             if (StaticManager.getInstance().toilet_queue_1[i])
    //             {
    //                 flag_queue = i;
    //             }
    //         })
    //     }
    //     else if (pos == 2)
    //     {
    //         MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_2, (i) =>
    //         {
    //             if (StaticManager.getInstance().toilet_queue_2[i])
    //             {
    //                 flag_queue = i;
    //             }
    //         })
    //     }
    //     else if (pos == 3)
    //     {
    //         MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_3, (i) =>
    //         {
    //             if (StaticManager.getInstance().toilet_queue_3[i])
    //             {
    //                 flag_queue = i;
    //             }
    //         })
    //     }
    //     return flag_queue;
    // }

    // count(pos: number): number
    // {
    //     let count: number = 0
    //     if (pos == 0)
    //     {
    //         MathManager.getInstance().visitLinearArray(StaticManager.getInstance().loo_queue, (i) =>
    //         {
    //             if (StaticManager.getInstance().loo_queue[i])
    //             {
    //                 count++;
    //             }
    //         })
    //     }
    //     else if (pos == 1)
    //     {
    //         MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_1, (i) =>
    //         {
    //             if (StaticManager.getInstance().toilet_queue_1[i])
    //             {
    //                 count++;
    //             }
    //         })
    //     }
    //     else if (pos == 2)
    //     {
    //         MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_2, (i) =>
    //         {
    //             if (StaticManager.getInstance().toilet_queue_2[i])
    //             {
    //                 count++;
    //             }
    //         })
    //     }
    //     else if (pos == 3)
    //     {
    //         MathManager.getInstance().visitLinearArray(StaticManager.getInstance().toilet_queue_3, (i) =>
    //         {
    //             if (StaticManager.getInstance().toilet_queue_3[i])
    //             {
    //                 count++;
    //             }
    //         })
    //     }
    //     return count
    // }
    // can_move(pos: number, index): boolean
    // {
    //     if (pos == 0)
    //     {
    //         return this.loo_queue[index]
    //     }
    //     else if (pos == 1)
    //     {
    //         return this.toilet_queue_1[index]
    //     }
    //     else if (pos == 2)
    //     {
    //         return this.toilet_queue_2[index]
    //     } else if (pos == 3)
    //     {
    //         return this.toilet_queue_3[index]
    //     }
    // }
}
