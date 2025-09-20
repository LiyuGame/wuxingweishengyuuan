const { ccclass, property } = cc._decorator;
/**
 * 1.将脚本挂载item预制体上
 * 2.在属性面板指定事件数组回调，即可监听Item[进入]和[离开]ScrollView可视区域的事件
 */
@ccclass
export default class ScrollItem extends cc.Component
{
    @property({
        type: [cc.Component.EventHandler],
        displayName: "进入ScrollView时回调"
    })
    onEnterScrollViewEvents: cc.Component.EventHandler[] = [];
    @property({
        type: [cc.Component.EventHandler],
        displayName: "离开ScrollView回调"
    })
    onExitScrollViewEvents: cc.Component.EventHandler[] = [];
    @property({
        type: [cc.Component.EventHandler],
        displayName: "进入ScrollView后，位置发生改变时回调"
    })
    onPositionChangeEvents: cc.Component.EventHandler[] = [];

    isShowing: boolean = false;//1.进入和离开ScrollView期间为true 2.离开为false

    onEnter()
    {
        if (this.onEnterScrollViewEvents.length == 0)
        {
            return;
        }
        this.onEnterScrollViewEvents.forEach(event =>
        {
            event.emit([]);
        });
    }
    onExit()
    {
        if (this.onExitScrollViewEvents.length == 0)
        {
            return;
        }
        this.onExitScrollViewEvents.forEach(event =>
        {
            event.emit([]);
        });
    }
    /**
    * Item 进入 ScrollView 后，位置发生移动时回调，离开ScrollView后不会回调
    *
    * @param xOffsetPercent 相对于 ScrollView 可视区域中心点，X的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最左边，1：为可视区域最右边
    * @param yOffsetPercent 相对于 ScrollView 可视区域中心点，Y的偏移量百分比，取值范围：[0, 1]。其中，0：为在可视区域最下边，1：为可视区域最上边
    */
    onPos(xOffsetPercent: number, yOffsetPercent)
    {
        if (this.onPositionChangeEvents.length == 0)
        {
            return;
        }
        this.onPositionChangeEvents.forEach(event =>
        {
            event.emit([xOffsetPercent, yOffsetPercent]);
        });
    }
}
