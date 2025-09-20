import Caches from "../manager/Caches";
import { Config } from "../manager/Config";
import GameSys from "../manager/GameSys";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Time extends cc.Component
{

    public taskList: Array<any> = [];
    public signInState: Array<number> = [];

    async onLoad()
    {
        let curDate = Math.floor((await this.getTime() as number) / 1000 / 24 / 60 / 60);
        if (!Caches.get(Caches.curDate))//头一次进入游戏
        {
            Caches.set(Caches.curDate, curDate);
        }
        let sub: number = curDate - Caches.get(Caches.curDate);
        if (sub >= 1)
        {
            Caches.set(Caches.oppoBanner, 1)
            Caches.set(Caches.oppoNatived, 1)
            Caches.set(Caches.curDate, curDate);
        }
        // await this.time()
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
        // this.online();
    }
    public task()
    {
        for (let i in this.tasks)
        {
            this.taskList.push({
                state: 0,
                title: this.tasks[i].title,
                introduce: this.tasks[i].introduce,
                amount: this.tasks[i].amount,
                award: this.tasks[i].award,
                index: i,
            })
        }
    }
    public async getTime()
    {
        return new Promise(async resolve =>
        {
            // let res: any = await GameSys.http.get("http://123.56.5.6/time");
            let res: any = new Date().getTime();
            if (typeof res == "string")
            {
                res = parseInt(res);
            }
            resolve(res);
        })
    }
    async online()
    {
        await this.time();
        let onlineTime = this.timeCout
        console.log("上线时间", onlineTime)
        let offline: any = Caches.get(Caches.offline)
        console.log("离线时长", offline)
        if (!offline)
        {
            //新玩家
            console.log("新")
            return;
        }
        let timeInterval: number = onlineTime - offline;
        console.log("离线时长" + timeInterval);
        //大于两小时

        let goldOffline: number[] = GameSys.game.xGet(Config.GOLDOFFLINE);
        if (timeInterval >= 2 * 60 * 60)
        {
            GameSys.gold((Math.abs(goldOffline[1]) / goldOffline[2]) * (2 * 60 * 60))
        }
        else
        {
            GameSys.gold((Math.abs(goldOffline[1]) / goldOffline[2]) * (timeInterval))
        }
        for (let i = 0; i < goldOffline.length; i++)
        {
            GameSys.game.xGet(Config.GOLDOFFLINECHANGE, {
                index: i,
                state: 0
            })
        }
    }
    async offline()
    {
        // await this.time();
        this.timeCout = new Date().getTime();
        let offline = Math.floor(this.timeCout / 1000)

        Caches.set(Caches.offline, offline);//离线保存时间
    }
    timeCout: number = 0;
    public async time()
    {
        return new Promise(resolve =>
        {
            GameSys.http.getTime("https://www.dingxuanxx.com/time" + '?_=' + Date.now(), (data) =>
            {
                if (data.error)
                {
                    //获取失败，就去获取本地时间
                    this.timeCout = new Date().getTime();
                    resolve(Math.floor(this.timeCout / 1000))
                }
                this.timeCout = data.data.time
                resolve(this.timeCout)
                // console.log("时间", data.data.time)
                // console.log("时间", Math.floor(new Date().getTime() / 1000))
            });
        })
    }
    //重置签到
    resetSignIn()
    {
        for (let i = 0; i < this.signInState.length; i++)
        {
            GameSys.game.xSet(Config.SIGNINCHANGE, {
                index: i,
                state: 0,
            })
        }
        GameSys.game.xSet(Config.SIGNINCHANGE, {
            index: 0,
            state: 1,
        })
    }
    public tasks: any = {
        0: {
            title: "获得钥匙",
            introduce: "观看三次视频",
            amount: 3,
            award: 1,
        },
        1: {
            title: "需要提示",
            introduce: "观看一次提示",
            amount: 1,
            award: 1,
        },
        2: {
            title: "难不倒我",
            introduce: "跳过一次关卡",
            amount: 1,
            award: 1,
        },
        3: {
            title: "小菜一碟",
            introduce: "不求助，不失败，不跳过连闯三关",
            amount: 3,
            award: 1,
        },
        4: {
            title: "智慧之子",
            introduce: "5秒内完成一关",
            amount: 1,
            award: 1,
        },
        5: {
            title: "手气真好",
            introduce: "获得一次转盘奖励",
            amount: 1,
            award: 1,
        },
        6: {
            title: "机智如我",
            introduce: "完成5次闯关",
            amount: 5,
            award: 1,
        }
    }
}
