const { ccclass, property } = cc._decorator;

import Props from "../kernels/Props";
import Logger from "../manager/Log";
import GameSys from "../manager/GameSys";


@ccclass
export default class SDK extends Props
{
    public Instance = null;
    constructor()
    {
        super();
        // banner
        this.xSet("bannerAd", null, false);
        this.xSet("createBanner", {}, false);
        this.xSet("hideBanner", null, false);
        this.xSet("destroyBanner", null, false);
        this.xSet("moreGames", null, false);
        this.xSet("startRec", null, false);
        this.xSet("stopRec", null, false);
        //分享
        this.xSet("preloadAdVideos", null, false)
        this.xSet("getAntiAddiction", null, false)
        this.xSet("favoriteGuide", null, false)
        this.xSet("share", null, false);
        this.xSet("showInter", null, false)
        this.xSet('shortcut', null, false)
        this.xSet('showNativeAd', null, false)
        this.xSet("hideNative", null, false)

        Logger.info("初始化sdk服务成功")
    }

    public static sdkInstance: any = null;

    public config: any = {
        switch: true
    }
    public async load(_channel_id: number, _game_name: string)
    {
        return new Promise(async resolve =>
        {
            try
            {
                let config: any = await GameSys.http.get("/api/getConfig", {
                    channel_id: _channel_id,
                    game_name: _game_name
                })
                this.config = config.config;
                console.log("加载信息", this.config);
                resolve(true);
            } catch (err)
            {
                resolve(false);
                console.log("加载失败", JSON.parse(err));
            }
        })
    }
    public videoNum: number = 0;

    public async watchVideo()
    {
        return new Promise(resolve =>
        {
            this.Instance.createRewardedVideoAd(res =>
            {
                if (!res)
                {
                    resolve(false);
                } else
                {
                    // GameSys.sdk.xSet("preloadAdVideos");
                    resolve(true);
                }
            });

        });
    }

    public static clickTime: number = 0;
    public async shareApp()
    {
        if (GameSys.channel == "blank")
        {
            return true;
        }
        return new Promise(resolve =>
        {
            this.Instance.shareAppMessage(res =>
            {
                if (!res)
                {
                    resolve(false);
                } else
                {
                    resolve(true);
                }
            });
        });
    }
    public async issueVideo()
    {
        return new Promise(resolve =>
        {
            this.Instance.issueVideo(res =>
            {
                if (!res)
                {
                    resolve(false);
                } else
                {
                    resolve(true);
                }
            });
        });
    }
    public static async createImage(_url: string)
    {
        return (await this.sdkInstance.createImage(_url));
    }

}
