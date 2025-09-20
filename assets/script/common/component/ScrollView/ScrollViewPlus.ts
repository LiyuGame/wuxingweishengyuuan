import ScrollItem from "./ScrollItem";

const { ccclass, property } = cc._decorator;
/**
 * 原理
 * 1.滚动时，判断子节点是否进入/离开了可视区域
 * 2.根据结果回调对应事件，可以实现类似以下功能
 *      *控制可视区域Item显示（透明度为255），非可视化区域Item隐藏（透明度改为0）
 */
@ccclass
export default class ScrollViewPlus extends cc.ScrollView
{
    @property({ tooltip: "是否计算在可视区域中Item的相对位置（可能会相对耗性能）" })
    caculatePos: boolean = false;

    onEnable()
    {
        super.onEnable();
        this.node.on("scrolling", this._onScrollDrawCallOpt.bind(this))
    }
    onDisable()
    {
        this.node.off("scrolling", this._onScrollDrawCallOpt.bind(this))
    }
    private _onScrollDrawCallOpt()
    {
        if (this.content.childrenCount == 0)
            return;
        this.optDc()
    }
    public optDc()
    {
        ScrollViewPlus.optDc(this, this.caculatePos)
    }
    /**
     * 1.进入可视区域时，对调对应content的子节点上挂载的ScrollItem 组件的 onEnterScorllViewEvents 数组事件
     * 2.退出可视区域时，回调对应content的子节点上挂载的ScrollItem 组件的 onExitScorllViewEvents 数组事件
     */
    static optDc(scrollView: cc.ScrollView, caculatePos: boolean)
    {
        //获取ScrollView.node的左下角坐标在世界坐标系中的坐标
        let sLeftBottomPoint: cc.Vec2 = scrollView.node.parent.convertToWorldSpaceAR(
            cc.v2(
                scrollView.node.x - scrollView.node.anchorX * scrollView.node.width,
                scrollView.node.y - scrollView.node.anchorY * scrollView.node.height
            ));
        //求出ScrollView可视区域在世界坐标系中的矩形（包围盒）
        let sBoxRect: cc.Rect = cc.rect(sLeftBottomPoint.x, sLeftBottomPoint.y, scrollView.node.width, scrollView.node.height)//左下角和右上角的位置
        // 遍历 ScrollView Content 内容节点的子节点，对每个子节点的包围盒做和 ScrollView 可视区域包围盒做相交判断
        scrollView.content.children.forEach((childNode: cc.Node) =>
        {
            //没有绑定指定组件的子节点不处理
            let item = childNode.getComponent(ScrollItem);
            if (item == null)
            {
                return;
            }
            //判断是否相交，相交显示，否则影藏
            let childNodeBox = childNode.getBoundingBoxToWorld();
            if (childNodeBox.intersects(sBoxRect))
            {
                if (!item.isShowing)
                {
                    item.isShowing = true;
                    item.onEnter();//进入可视区
                }
                if (caculatePos)
                {
                    if (item.isShowing)
                    {
                        item.onPos(
                            (childNodeBox.x - (sBoxRect.x - childNodeBox.width / 2)) / (childNodeBox.width + sBoxRect.width),
                            (childNodeBox.y - (sBoxRect.x - childNodeBox.height / 2)) / (childNodeBox.height + sBoxRect.height)
                        )
                    }
                }
            }
            else
            {
                if (item.isShowing)
                {
                    item.isShowing = false;
                    item.onExit();
                }
            }
        })
    }
}
