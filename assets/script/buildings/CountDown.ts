import { Config, In_Save_Buildings } from "../common/manager/Config";
import GameSys from "../common/manager/GameSys";

/*
倒计时处理脚本
*/
const { ccclass, property } = cc._decorator;

let BINDER_NAME: string = ''
@ccclass
export default class CountDown extends cc.Component
{
    @property(cc.Label)
    time_lab: cc.Label = null;
    @property
    index: number = 0;

    private time_remain: number = 0;//时间剩余
    private buildings: In_Save_Buildings
    onEnable()
    {
        // cc.game.on(cc.game.EVENT_SHOW, () =>
        // {
        //     console.log("切前台")
        //     this.online();
        // })
        // cc.game.on(cc.game.EVENT_HIDE, () =>
        // {
        //     console.log("切后台")
        //     this.offline();
        // })
        this.online()
    }
    private startTime: boolean = false;//开始计时
    time_change()
    {

    }
    online()
    {
        this.node.width = 100;
        this.node.height = 100
        this.node.opacity = 180;
        this.buildings = GameSys.game.xGet(Config.BUILDINGS)[this.index]
        // console.error("开始更新", this.buildings)
        this.time_remain = this.buildings.upgrade;
        console.log("上线查看", this.buildings.upgrade)
        this.startTime = true;
        this.time_lab.string = this.fomatTime(this.time_remain);
        this.countTime(this.time_remain)
    }


    offline()
    {
        this.startTime = false;
        this.buildings = GameSys.game.xGet(Config.BUILDINGS)[this.index]
        this.time_remain = this.buildings.upgrade;
        console.log("离线", this.time_remain)
        GameSys.game.xSet(Config.BUILDINGSCHANGE, {
            index: this.index,
            level: this.buildings.level,
            dirty: this.buildings.dirty,
            upgrade: this.time_remain//正在升级
        })
    }
    /**
     * 
     * @param _time 当前多少秒
     */
    private countTime(_time: number)
    {
        if (_time < 0)
        {
            return;
        }
        this.unscheduleAllCallbacks();
        this.time_lab.node.active = true
        this.schedule(() =>
        {
            if (_time > 0)
            {
                _time--;
                // console.log("升级中", _time)
                if (_time !== 0)
                {
                    GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                        index: this.index,
                        level: this.buildings.level,
                        dirty: this.buildings.dirty,
                        upgrade: _time//正在升级
                    })
                }
                this.time_lab.string = this.fomatTime(_time);
                if (_time == 0)
                {
                    //倒计时结束
                    console.log("倒计时结束")
                    GameSys.audio.playSFX("audios/shengji_1");
                    GameSys.game.xSet(Config.BUILDINGSCHANGE, {
                        index: this.index,
                        dirty: 0,
                        level: this.buildings.level + 1,
                        upgrade: 0//升级完成
                    })
                    GameSys.game.xSet(Config.BUILDINGSSELECT, this.index)
                    if (Math.floor(this.index / 3) == 0)
                    {
                        GameSys.game.xSet(Config.LEAVELOO, 0);
                    }
                    else if (Math.floor(this.index / 3) == 1)
                    {
                        GameSys.game.xSet(Config.LEAVETOILETONE, 1);
                    }
                    else if (Math.floor(this.index / 3) == 2)
                    {
                        GameSys.game.xSet(Config.LEAVETOILETTWO, 2);
                    } else if (Math.floor(this.index / 3) == 3)
                    {
                        GameSys.game.xSet(Config.LEAVETOILETTHERE, 3);
                    }
                    //TODO:当前node关闭，并且洗手间的样式更改
                    this.node.active = false;
                    GameSys.game.xSet(Config.ALLRED)
                }
            }
        }, 1, _time)
    }
    // 格式化时间
    fomatTime(_time: number): string
    {
        let time: string = '';
        if (_time < 60)
        {
            if (_time < 10)
            {
                time = "00:0" + _time
            }
            else
            {
                time = "00:" + _time
            }
        }
        else
        {
            let minute: number = Math.floor(_time / 60);
            let second: number = _time - minute * 60;
            let minuteL: string = "";
            let secondL: string = "";

            if (minute < 60)
            {
                if (minute < 10)
                {
                    minuteL = "0" + minute;
                }
                else
                {
                    minuteL = minute + ""
                }
            }
            if (second < 60)
            {
                if (second < 10)
                {
                    secondL = "0" + second;
                } else
                {
                    secondL = second + "";
                }
            }
            time = minuteL + ":" + secondL;
        }
        console.log("更新", time)
        return time
    }
    onDestory() { }
}
