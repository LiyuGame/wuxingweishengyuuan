import Shop from "../../panel/Shop";
import Caches from "../manager/Caches";
import { Config, PopupPath } from "../manager/Config";
import GameSys from "../manager/GameSys";
import PopupManager, { PopupCacheMode, PopupShowPriority } from "../manager/PopupManager";
import TouchBlocker from "../manager/TouchBlocker";
import HollowOut from "./effects/HollowOut";

let BINDER_NAME: string = 'newGuide'
const { ccclass, property } = cc._decorator;

interface In_Info
{
    hand: cc.Vec2,
    lab: string,
    pos: cc.Vec2,
    width: number,
    height: number
}
@ccclass
export default class NewGuide extends cc.Component
{
    @property(cc.Node)
    xuankuang: cc.Node = null;
    @property(cc.Node)
    client: cc.Node = null;
    @property(cc.Node)
    hand: cc.Node = null;

    @property(HollowOut)
    private hollowOut: HollowOut = null;

    @property(TouchBlocker)
    private touchBlocker: TouchBlocker = null;

    @property(cc.Node)
    private startBtn: cc.Node = null;
    @property(cc.Node)
    private startBtn_1: cc.Node = null;

    @property(cc.Node)
    private oneBtn: cc.Node = null;

    @property(cc.Node)
    private twoBtn: cc.Node = null;

    @property(cc.Node)
    private threeBtn: cc.Node = null;

    @property(cc.Node)
    private fourBtn: cc.Node = null;

    @property(cc.Node)
    private fiveBtn: cc.Node = null;

    @property(cc.Node)
    private sixBtn: cc.Node = null;
    @property(cc.Node)
    private sevenBtn_1: cc.Node = null;

    @property(cc.Node)
    private sevenBtn: cc.Node = null;


    @property(cc.Node)
    private eightBtn: cc.Node = null;
    @property(cc.Node)
    nineBtn: cc.Node = null;
    @property(cc.Node)
    tenBtn: cc.Node = null;
    @property(cc.Node)
    shiyiBtn: cc.Node = null;
    @property(cc.Node)
    shierBtn: cc.Node = null;
    @property(cc.Node)
    shisanBtn: cc.Node = null;
    @property(cc.Node)
    shisiBtn: cc.Node = null;
    @property(cc.Node)
    shiwuBtn: cc.Node = null;
    @property(cc.Node)
    shiliuBtn: cc.Node = null;
    @property(cc.Node)
    shiqiBtn: cc.Node = null;
    @property(cc.Node)
    shibaBtn: cc.Node = null;
    @property(cc.Node)
    shijiu: cc.Node = null;
    @property(cc.Node)
    ershi: cc.Node = null;
    @property(cc.Node)
    eryi: cc.Node = null;
    @property(cc.Node)
    erer: cc.Node = null;
    @property(cc.Node)
    ersan: cc.Node = null;
    @property(cc.Node)
    ersi: cc.Node = null;
    @property(cc.Node)
    erwu: cc.Node = null;
    @property(cc.Node)
    erliu: cc.Node = null;
    @property(cc.Node)
    erqi: cc.Node = null;
    @property(cc.Node)
    erba: cc.Node = null;
    @property(cc.Node)
    erjiu: cc.Node = null;
    @property(cc.Node)
    sanshi: cc.Node = null;
    @property(cc.Node)
    sanyi: cc.Node = null;
    @property(cc.Node)
    saner: cc.Node = null;
    protected onLoad()
    {

    }

    onEnable()
    {
        // this.startBtn.on('touchend', this.onStartBtnClick, this);
        // this.startBtn_1.on('touchend', this.onOneBtnClick, this);
        // // this.twoBtn.on('touchend', this.onTwoBtnClick, this);
        // this.threeBtn.on('touchend', this.onThreeBtnClick, this);
        // this.fourBtn.on('touchend', this.onFourBtnClick, this);
        this.fiveBtn.on('touchend', this.onTouch5, this);
        this.nineBtn.on('touchend', this.onTouch9, this);
        // this.sixBtn_1.on('touchend', this.onSixBtnClick, this);
        // this.sevenBtn.on('touchend', this.onSevenBtnClick, this);
        // this.eightBtn.on('touchend', this.onEightBtnClick, this);
        // this.nineBtn.on('touchend', this.onNineBtnClick, this);
        this.threeBtn.on('touchend', this.onTouchThree, this)
        this.fourBtn.on('touchend', this.onTouchFour, this)
        this.sevenBtn_1.on('touchend', this.onTouchSeven, this)
        this.eightBtn.on('touchend', this.onTouch8, this)
        GameSys.game.xSet(Config.NEWGUIDECON, 0)
        this.node.zIndex = 50;
        GameSys.game.xBind(Config.NEWGUIDECON, this.continue.bind(this), BINDER_NAME)
    }
    onDisable()
    {
        GameSys.game.xUnbind(BINDER_NAME);
    }
    cachujixu(v: number)
    {
        this.hand.setPosition(cc.v2(0, 300));
        this.change(this.shiqiBtn, this.shiwuBtn)
    }
    async change(pre: cc.Node, next: cc.Node)
    {
        pre.active = false
        next.active = true;
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 1)
        {
            await this.hollowOut.rectTo(0.5, next.getPosition(), next.width + 10, next.height + 10, 5, 5);
            this.touchBlocker.setTarget(next); // 设置可点击节点
        } else
        {
            await this.hollowOut.rectTo(1.2, next.getPosition(), next.width + 10, next.height + 10, 5, 5);
            this.touchBlocker.setTarget(next); // 设置可点击节点
        }
    }
    private info: In_Info[] = [
        { hand: cc.v2(0, 0), lab: "点击按钮1\n进行升级", pos: cc.v2(0, 0), width: 180, height: 140 },
        { hand: cc.v2(-242.856, -363.254), lab: "选择升级区域", pos: cc.v2(-97.379, -360.702), width: 180, height: 100 },
        { hand: cc.v2(-149.302, 291.34), lab: "点击升级按钮", pos: cc.v2(-36.624, 291), width: 180, height: 100 },
        { hand: cc.v2(0, -161.628), lab: "点击解锁按钮", pos: cc.v2(147.635, -159.076), width: 180, height: 100 },
        // { hand: cc.v2(266, -380), lab: "点击按钮\n进行升级", pos: cc.v2(145.516, -398.656), width: 180, height: 140 },
        { hand: cc.v2(-149.302, 291.34), lab: "恭喜成功\n解锁洗手间", pos: cc.v2(-36.624, 291), width: 180, height: 100 },

        { hand: cc.v2(-83.148, -373.598), lab: "下一步\n前往卫生间", pos: cc.v2(58.911, -340.62), width: 180, height: 100 },
        { hand: cc.v2(-129.142, 291.412), lab: "点击升级区域", pos: cc.v2(-16.439, 297.354), width: 180, height: 100 },
        { hand: cc.v2(0, -161.628), lab: "点击解锁按钮", pos: cc.v2(147.635, -159.076), width: 180, height: 100 },
        { hand: cc.v2(-129.142, 291.412), lab: "恭喜成功\n解锁卫生间", pos: cc.v2(-16.439, 297.354), width: 180, height: 100 },
        { hand: cc.v2(136.404, -293.74), lab: "点击按钮\n进入外观", pos: cc.v2(278.463, -260.662), width: 180, height: 100 },
        { hand: cc.v2(-242.856, -363.254), lab: "选择外观区域", pos: cc.v2(-97.379, -360.702), width: 180, height: 100 },
        { hand: cc.v2(-146.881, -167.205), lab: "点击查看", pos: cc.v2(-30, -152), width: 140, height: 100 },
        { hand: cc.v2(-10.177, -111.442), lab: "点击更换外观", pos: cc.v2(127.882, -128.364), width: 180, height: 100 },
        { hand: cc.v2(335.332, -329.663), lab: "点击关闭", pos: cc.v2(208.397, -296.585), width: 140, height: 100 },
        { hand: cc.v2(0, 0), lab: "开始营业啦，顾客正在选择商品", pos: cc.v2(0, -417.443), width: 450, height: 100 },

        { hand: cc.v2(307.78, -287.679), lab: "点击商店", pos: cc.v2(205.983, -270.5), width: 140, height: 100 },
        { hand: cc.v2(0, -238.271), lab: "长按可快速补货哦", pos: cc.v2(172.767, -221.092), width: 250, height: 100 },

        { hand: cc.v2(320.374, 427.01), lab: "点击关闭", pos: cc.v2(213.014, 444.189), width: 140, height: 100 },
        { hand: cc.v2(0, 0), lab: "顾客正在前往洗手池", pos: cc.v2(0, -417.443), width: 250, height: 100 },
        { hand: cc.v2(0, 0), lab: "顾客正在前往洗手池", pos: cc.v2(0, -417.443), width: 250, height: 100 },
        { hand: cc.v2(-306.493, 304.62), lab: "洗手池每次被使用后会增加清洁度。\n清洁度到最大值时设施将无法使用，\n请尽快进行打扫。\n您也可以雇佣员工进行打扫", pos: cc.v2(42.361, 201.372), width: 600, height: 180 },
        { hand: cc.v2(-205, -367), lab: "点击使用高效去污器", pos: cc.v2(0, -250), width: 250, height: 100 },
        { hand: cc.v2(-158, 230), lab: "将高效去污器拖至这里\n并滑动看看吧", pos: cc.v2(51, 145), width: 300, height: 100 },

        { hand: cc.v2(0, -367), lab: "很棒哦，继续点击使用\n清洁剂", pos: cc.v2(0, -250), width: 300, height: 100 },
        { hand: cc.v2(-158, 230), lab: "将清洁剂拖至这里\n并滑动看看吧", pos: cc.v2(51, 145), width: 300, height: 100 },

        { hand: cc.v2(205, -367), lab: "加油哦，垃圾快清理\n干净了点击使用抹布", pos: cc.v2(0, -250), width: 360, height: 100 },
        { hand: cc.v2(-158, 230), lab: "将抹布拖至这里\n并滑动看看吧", pos: cc.v2(51, 145), width: 300, height: 100 },

        { hand: cc.v2(-8.382, 265.62), lab: "垃圾清理干净了，点\n击收集顾客遗留物品", pos: cc.v2(36.163, 88.873), width: 300, height: 100 },
        { hand: cc.v2(125.442, 395.507), lab: "点击关闭", pos: cc.v2(101.763, 221.384), width: 140, height: 100 },
        { hand: cc.v2(-296.505, -285.515), lab: "点击仓库", pos: cc.v2(-178.143, -271.501), width: 140, height: 100 },


        { hand: cc.v2(97.056, 205.661), lab: "点击购买", pos: cc.v2(215.418, 219.675), width: 140, height: 100 },
        { hand: cc.v2(317.078, 428.782), lab: "点击关闭", pos: cc.v2(207.671, 442.796), width: 140, height: 100 },

    ]
    // private handePos: cc.Vec2[] = [
    //     cc.v2(266, -380), cc.v2(0, -194), cc.v2(-270, 176), cc.v2(-92, -382), cc.v2(-94, 186),
    //     cc.v2(0, -194), cc.v2(-87, 222), cc.v2(333, -331), cc.v2(0, 0), cc.v2(300, -292),
    //     cc.v2(0, -274), cc.v2(315, 416), cc.v2(0, 0), cc.v2(-300, 300), cc.v2(0, 0),
    //     cc.v2(-180, 88), cc.v2(96, 400), cc.v2(-300, -266), cc.v2(65, 195), cc.v2(320, 414),
    //     cc.v2(283, -409), cc.v2(136, -326), cc.v2(-50, 260), cc.v2(-10, -200),
    // ]
    async continue(v: number)
    {
        if (Caches.get(Caches.newGuide))
            return
        console.error(v)
        if (v >= 32)
        {
            console.log("结束")
            this.node.active = false;
            Caches.set(Caches.newGuide, true)
            GameSys.game.xSet(Config.TIP, "卫生道长，开启你的管理工作吧！")
            GameSys.game.xSet(Config.NEWGUIDECON, 33)
            return
        }
        this.xuankuang.setPosition(this.info[v].pos)
        this.xuankuang.width = this.info[v].width;
        this.xuankuang.height = this.info[v].height;
        // this.xuankuang.children[0].getComponent(cc.Label).string = this.info[v].lab

        this.onTouchLableTyper(this.info[v].lab)
        if (v == 14 || v == 19)
        {
            this.hand.parent = this.client.children[0];
            this.hand.setPosition(cc.v2(0, 453));
            this.hand.scale = 1;
        }
        else
        {
            this.hand.parent = this.node
            this.hand.scale = 0.3
            this.hand.setPosition(this.info[v].hand)
        }
        if (v == 1)
        {
            this.change(this.oneBtn, this.twoBtn)
        }
        //TODO:睡一觉继续
        if (v == 2)
        {
            this.change(this.twoBtn, this.threeBtn)
        }
        if (v == 5)
        {
            this.change(this.fiveBtn, this.sixBtn)
        }
        if (v == 6)
        {
            this.change(this.sixBtn, this.sevenBtn)
        }
        if (v == 9)
        {
            this.change(this.nineBtn, this.tenBtn)
        }
        if (v == 10)
        {
            this.change(this.tenBtn, this.shiyiBtn)
        }
        if (v == 11)
        {
            this.change(this.shiyiBtn, this.shierBtn)
        }
        if (v == 12)
        {
            this.change(this.shierBtn, this.shisanBtn)
        }
        if (v == 13)
        {
            this.change(this.shisanBtn, this.shisiBtn)
        }
        if (v == 14)
        {
            this.change(this.shisiBtn, this.shiwuBtn)
        }
        if (v == 15)
        {
            this.change(this.shiwuBtn, this.shiliuBtn)
        }
        if (v == 16)
        {
            this.change(this.shiliuBtn, this.shiqiBtn)
        }
        if (v == 17)
        {
            this.change(this.shiqiBtn, this.shibaBtn)
        }
        if (v == 18)
        {
            this.change(this.shibaBtn, this.shijiu)
        }
        if (v == 19)
        {
            this.change(this.shijiu, this.ershi)
        }
        if (v == 20)
        {
            this.change(this.ershi, this.eryi)
        }
        if (v == 21)
        {
            this.change(this.eryi, this.erer)
        } if (v == 22)
        {
            this.change(this.erer, this.ersan)
        }
        if (v == 23)
        {
            this.change(this.ersan, this.ersi)
        }
        if (v == 24)
        {
            this.change(this.ersi, this.erwu)
        }
        if (v == 25)
        {
            this.change(this.erwu, this.erliu)
        }
        if (v == 26)
        {
            this.change(this.erliu, this.erqi)
        }
        if (v == 27)
        {
            this.change(this.erqi, this.erba)
        }
        if (v == 28)
        {
            this.change(this.erba, this.erjiu)
        }
        if (v == 29)
        {
            this.change(this.erjiu, this.sanshi)
        }
        if (v == 30)
        {
            this.change(this.sanshi, this.sanyi)
        }
        if (v == 31)
        {
            this.change(this.sanyi, this.saner)
        }
        if (v == 32)
        {
            console.log("新手结束")
        }
    }
    protected start()
    {
        this.hollowOut.node.active = true;
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.passAll(); // 放行所有点击

        this.onStartBtnClick()
    }

    private async onStartBtnClick()
    {

        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.oneBtn.getPosition(), this.oneBtn.width + 10, this.oneBtn.height + 10, 5, 5);
        this.touchBlocker.setTarget(this.oneBtn); // 设置可点击节点
    }

    async onTouchThree()
    {
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 2)
            return
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.NEWGUIDECON, 3)
        this.fourBtn.active = true;
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.fourBtn.getPosition(), this.fourBtn.width + 10, this.fourBtn.height + 10, 5, 5);
        this.touchBlocker.setTarget(this.fourBtn); // 设置可点击节点

    }
    async onTouchFour()
    {
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 3)
            return
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.NEWGUIDECON, 4)
        this.fourBtn.active = false;
        // this.fiveBtn.active = true
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.threeBtn.getPosition(), this.threeBtn.width + 10, this.threeBtn.height + 10, 5, 5);
        this.touchBlocker.setTarget(this.threeBtn); // 设置可点击节点
        this.scheduleOnce(() =>
        {
            this.threeBtn.children[1].active = false;
            cc.tween(this.threeBtn)
                .to(1, { y: this.threeBtn.y + 300, opacity: 0 })
                .call(() =>
                {
                    this.threeBtn.active = false
                    this.scheduleOnce(() =>
                    {
                        GameSys.game.xSet(Config.NEWGUIDECON, 5)
                    }, 0.2)
                })

                .start()
        }, 0.3)
    }
    onTouch5()
    {

    }
    onTouch9()
    {

    }
    async onTouchSeven()
    {
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 6)
            return
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.NEWGUIDECON, 7)
        this.eightBtn.active = true;
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.eightBtn.getPosition(), this.eightBtn.width + 10, this.eightBtn.height + 10, 5, 5);
        this.touchBlocker.setTarget(this.eightBtn); // 设置可点击节点

    }
    async onTouch8()
    {
        if (GameSys.game.xGet(Config.NEWGUIDECON) !== 7)
            return
        GameSys.audio.playSFX("audios/button");
        GameSys.game.xSet(Config.NEWGUIDECON, 8)
        this.eightBtn.active = false;
        // this.fiveBtn.active = true
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.blockAll(); // 屏蔽所有点击
        await this.hollowOut.rectTo(0.5, this.nineBtn.getPosition(), this.nineBtn.width + 10, this.nineBtn.height + 10, 5, 5);
        this.touchBlocker.setTarget(this.nineBtn); // 设置可点击节点
        this.scheduleOnce(() =>
        {
            this.sevenBtn.children[1].active = false;
            cc.tween(this.sevenBtn)
                .to(1, { y: this.sevenBtn.y + 300, opacity: 0 })
                .call(() =>
                {
                    this.sevenBtn.active = false
                    this.scheduleOnce(() =>
                    {
                        GameSys.game.xSet(Config.NEWGUIDECON, 9)
                    }, 0.2)
                })

                .start()
        }, 0.3)
    }

    private typerTimer: number = 0;//计时器ID
    onTouchLableTyper(strLab)
    {
        //this.richText.string = '';
        this.xuankuang.children[0].getComponent(cc.Label).string = '';
        let charArr = strLab.split('');
        let charIdx = 0;
        this.typerTimer && clearInterval(this.typerTimer);
        this.typerTimer = setInterval(() =>
        {
            if (charIdx >= charArr.length)
            {
                // console.log("打完了")
                this.typerTimer && clearInterval(this.typerTimer)
                // this.next.active = true;
                // cc.delayTime(0.2)
            }
            else
            {
                charIdx += 1;
                //返回数组的一个部分。
                //param开始数组指定部分的开头。
                //数组指定部分的结束。这是不包括索引“end”处的元素的。
                this.xuankuang.children[0].getComponent(cc.Label).string = charArr.slice(0, charIdx).join('')
            }
        }, 100);
    }
    async onNineBtnClick()
    {
        this.hollowOut.nodeSize(); // 将遮罩镂空设为节点大小
        this.touchBlocker.passAll(); // 放行所有点击
    }
}
