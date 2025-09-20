import Game from "./Game";
import { Config, TipLab } from "./Config";
import Audio from "../component/Audio";
import SDK from "../sdk/SDK";
import Http from "../net/Http";
import TTAPI from "../sdk/TTApi";
import OppoApi from "../sdk/OPPOApi";
import VIVOApi from "../sdk/VivoApi";
import DataManager from "./DataManager";
import BDApi from "../sdk/BDApi";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSys extends cc.Component
{
    static share: boolean = false;
    static hint: number = 0;
    static answer: number = 0;
    static shareDesc: "仙界厕所美景尽揽于此！！！"
    static shareTitle: "五星卫生院"
    static imageUrl: string = "http://123.56.5.6/static/game/lhmsShare.jpg";

    static game: Game = null;
    static audio: Audio = null;
    static sdk: SDK = null;
    static http: Http = null;
    static level: number = 0;//当前等级

    //static channel: string = "ml"
    //static channel: string = "vivo"
    //static channel: string = "wx"
    static channel: string = "oppo"
    // static channel: string = "vivo"
    // static channel: string = "blank"
    //static channel: string = "android"
    //static channel: string = "qq"
    // static channel: string = "baidu"
    // static channel: string = "tt"
    //static channel: string = "uc" 
    //static channel: string = "mz"
    //static channel: string = "qtt"
    //static channel: string = "kk"
    static async init()
    {
        this.game = new Game();
        this.audio = new Audio();
        this.http = new Http();
        this.sdk = new SDK();

        this.level = GameSys.game.xGet(Config.LEVEL);
        cc.log("当前等级", this.level)

        if (this.channel == "tt")
        {
            new TTAPI();
            this.share = true
        }
        else if (this.channel == "oppo")
        {
            new OppoApi();
            this.share = false
        } else if (this.channel == "vivo")
        {
            new VIVOApi();
            this.share = true
        }
        else if (this.channel == "baidu")
        {
            new BDApi();
            this.share = true
        }
    }
    static loadScene(v: string)
    {
        cc.director.loadScene(v)
    }
    static gold(_v: number): boolean
    {
        if (_v < 0)
        {
            if (this.game.xGet(Config.GOLD).v + _v < 0)
            {
                // this.game.xSet(Config.TIP, Tip.gold_not)
                return false;
            }
        }
        this.game.xSet(Config.GOLD, { v: this.game.xGet(Config.GOLD).v + _v, index: _v })
        return true;
    }
    static judgeGold(usegold: number, call: () => void, cb: () => void)
    {
        if (this.game.xGet(Config.GOLD).v < Math.abs(usegold))
        {
            call && call();
        }
        else
        {
            cb && cb()
        }
    }
    static useGold(_usegold: number, call: () => void)
    {
        if (this.game.xGet(Config.GOLD).v < Math.abs(_usegold))
        {
            this.game.xSet(Config.TIP, TipLab.gold_not);
            //TODO:可以弹出加加加加金币页面
        }
        else
        {
            this.gold(_usegold)
            //TODO:同时调用装修动画
            call && call();
        }
    }
    //添加至桌面
    static shortCut()
    {
        this.sdk.xSet('shortcut')
    }
    //原生
    static showNativeAd(native: cc.Node)
    {
        if (this.channel == "oppo" || this.channel == "vivo")
        {
            DataManager.getInstance().oppoNatived = native;
            this.sdk.xSet('showNativeAd')
        }
    }
    //插屏
    static showInter()
    {
        if (GameSys.channel == "blank")
        {
            return
        }
        this.sdk.xSet('showInter')
    }
    static showBanner()
    {
        if (GameSys.channel == "blank")
        {
            return
        }
        this.sdk.xSet('createBanner')
    }
    static hideBanner()
    {
        if (GameSys.channel == "blank")
        {
            return
        }
        if (this.channel != "oppo")
        {
            this.sdk.xSet("hideBanner")
        }
    }
    static async watchVideo(pos: number, success: () => void)
    {
        if (GameSys.channel == "blank")
        {
            success()
            return
        }

        // console.log("观看视频位置", pos)
        let res: boolean = await GameSys.sdk.watchVideo() as boolean;
        if (res)
        {
            success()
            if (this.channel == 'tt')
            {
                if (pos == 1)
                {
                    //提示区域的广告
                    this.statistical('video', `${1}提示视频成功`, pos)
                }
                else
                {
                    this.statistical('video', `${1}观看视频成功`, pos)
                }
            }
        }
        else
        {
            this.fail()
            if (this.channel == 'tt')
            {
                if (pos == 1)
                {
                    //提示区域的广告
                    this.statistical('video', `${1}提示视频失败`, -pos)
                }
                else
                {
                    this.statistical('video', `${1}观看视频失败`, -pos)
                }
            }
        }
    }
    static fail()
    {
        this.game.xSet(Config.TIP, TipLab.not_reward)
    }
    static startRec()
    {
        if (this.channel == 'tt')
        {
            this.sdk.xSet('startRec')
        }
    }
    static stopRec()
    {
        if (this.channel == 'tt')
        {
            this.sdk.xSet('stopRec')
        }
    }
    static statistical(v: string, _message: string, _pos: number)//数据统计
    {
        // if (this.TGDA)
        // {
        //     TDGA.onEvent(v, { message: _message, pos: _pos });
        //     return
        // }
        if (this.channel == "tt")
        {
            // console.log("埋点", v, _message, _pos)
            tt.reportAnalytics(v, {
                value: _message,
                pos: _pos
            });
        }
    }
    //包围盒
    static checkOnTarget(location)
    {
        // let node: cc.Node = DataManager.getInstance().garbageNode;
        // console.log("---", node)
        //获取target节点在父容器的包围盒，返回一个矩形对象
        // let rect = node.getBoundingBoxToWorld();
        //console.log(node)
        let point = location
        //if (cc.rectContainsPoint(rect, targetPoint)) {
        //Creator2.0使用rect的成员contains方法
        // if (rect.contains(point))
        // {
        //     return true;
        // } else
        // {
        //     return false
        // }
    }
}
