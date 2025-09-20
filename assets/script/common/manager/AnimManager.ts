enum AnimEnum
{
    red = 1,
    hand,
    hand_1,
    hand_2,
    hand_3,
    breathe
}
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("按钮组件/AnimManager")
export default class AnimManager extends cc.Component
{

    @property({ type: cc.Enum(AnimEnum) })
    anim: AnimEnum = AnimEnum.red;

    onEnable()
    {
        switch (this.anim)
        {
            case AnimEnum.red: {
                this.red();
                break;
            }
            case AnimEnum.hand: {
                this.hand();
                break;
            }
            case AnimEnum.hand_1: {
                this.hand_1();
                break;
            }
            case AnimEnum.hand_2: {
                this.hand_2();
                break;
            }
            case AnimEnum.hand_3: {
                this.hand_3();
                break;
            }
            case AnimEnum.breathe: {
                this.breathe();
                break;
            }
            default:
                break
        }
    }

    red()
    {
        this.node.stopAllActions()
        let scaleX = this.node.scaleX;
        let scaleY = 1
        scaleX = scaleX / Math.abs(scaleX);
        this.node.scaleX = scaleX;
        this.node.scaleY = 1
        cc.tween(this.node)
            .to(0.5, { opacity: 0, scaleX: scaleX * 1, scaleY: scaleY * 1 })
            .to(0.5, { opacity: 255, scaleX: scaleX * 1.3, scaleY: scaleY * 1.3 })
            .to(0.05, { angle: 15 })
            .to(0.05, { angle: 0 })
            .to(0.05, { angle: -15 })
            .to(0.05, { angle: 0 })
            .delay(0.5)
            .union().repeatForever()
            .start()
    }
    hand()
    {
        cc.tween(this.node)
            .to(0.5, { x: 86 })
            .to(0.5, { x: 0 })
            .delay(0.2)
            .union().repeatForever()
            .start()
    }
    hand_1()
    {
        cc.tween(this.node)
            .to(0.5, { angle: 10 })
            .to(0.5, { angle: 0 })
            .delay(0.2)
            .union().repeatForever()
            .start()
    }
    hand_2()
    {
        cc.tween(this.node)
            .to(0.5, { x: -198, y: -25 })
            .delay(0.5)
            .to(0.5, { x: -228, y: 0 })
            .union().repeatForever()
            .start()
    }
    hand_3()
    {
        cc.tween(this.node)
            .to(0.5, { y: this.node.y - 20 })
            .delay(0.5)
            .to(0.5, { y: this.node.y + 20 })
            .delay(0.5)
            .union().repeatForever()
            .start()
    }
    breathe()
    {
        cc.tween(this.node)
            .to(0.3, { scale: 1.2 })
            .delay(0.1)
            .to(0.3, { scale: 1 })
            .delay(0.1)
            .union().repeatForever()
            .start()
    }
}
