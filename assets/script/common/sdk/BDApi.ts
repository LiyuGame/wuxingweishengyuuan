import GameSys from "../manager/GameSys";
import Logger from "../manager/Log";

const { ccclass, property } = cc._decorator;

let BINDER_NAME = "sdk_bdapi";
@ccclass
export default class BDApi
{

    constructor()
    {
        this.onLoad();
        GameSys.sdk.Instance = this;
        Logger.info("百度环境----------");
        this.instantiationRewardAd();
        GameSys.sdk.xBind("createBanner", this.createBanner.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("destroyBanner", this.destroySelf.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("hideBanner", this.hideBanner.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("favoriteGuide", this.favoriteGuide.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("getAntiAddiction", this.getAntiAddiction.bind(this), BINDER_NAME);
    }

    public async onLoad()
    {
        await this.showShareMenu();
    }
    instantiationRewardAd()
    {
        console.log("视频实例化", this.videoNum % this.videoAds.length)
        this.rewardedVideoAd = swan.createRewardedVideoAd({
            adUnitId: this.videoAds[this.videoNum % this.videoAds.length],
            appSid: this.appSid
        });
    }
    public rewardedVideoAd: any = null;
    public videoNum: number = 0;

    public getAntiAddiction()
    {
        console.log("防沉迷", swan.getSystemInfoSync().platform);
        if (swan.getSystemInfoSync().platform == 'ios')
        {
            return;
        }
        else
        {
            let api = swan.getAntiAddiction();
            api.onAntiAddiction(function ({ state, msg })
            {
                console.log("防沉迷值: ", state);
                console.log("防沉迷描述: ", msg);
                if (state == 10001)
                {
                    console.log("非法定节假日游戏时间限制1.5小时")
                    GameSys.game.xSet("tip", "请适度游戏，天天向上");
                }
                if (state == 10002)
                {
                    console.log("法定节假日游戏时间限制3小时")
                    GameSys.game.xSet("tip", "请适度游戏，天天向上");
                }
                if (state == 10003)
                {
                    console.log("夜深了，孩子该睡了")
                    GameSys.game.xSet("tip", "请适度游戏，天天向上");
                }
            });
        }
    }
    // banner
    public isShowBanner: boolean = false;
    public oldBannerAd: any = {};

    public bannerPar: Array<string> = ["7363205"];
    public bannerIndex: number = 0;
    public index: number = 0;
    public appSid: string = "aa1a16a9";
    async createBanner()
    {
        this.bannerIndex++;
        if (this.bannerIndex % 3 == 0)
        {
            this.index++;
        }
        let _adUnitId: string = this.bannerPar[this.index % this.bannerPar.length];

        // 屏幕宽
        let screenWidth = swan.getSystemInfoSync().screenWidth;
        // 屏幕高
        let screenHeight = swan.getSystemInfoSync().screenHeight;

        Logger.info("创建banner")
        if (this.oldBannerAd.adUnitId && this.oldBannerAd.adUnitId == _adUnitId)
        {
            if (!this.isShowBanner)
            {
                this.showBanner();
            }
            else
            {
                this.hideBanner();
            }
        }
        else
        {
            let bannerAd: any = swan.createBannerAd({
                adUnitId: _adUnitId,
                appSid: this.appSid,
                style: {
                    left: (screenWidth - 320) / 2,
                    top: screenHeight - 100,
                    width: 320
                }
            });
            this.oldBannerAd = bannerAd;
            bannerAd.onResize(size =>
            {
                console.log("size:", size);
                // 底部居中显示
                bannerAd.style.top = window.innerHeight - size.height;
                bannerAd.style.left = (screenWidth - size.width) / 2;
            });
            bannerAd.onLoad(() =>
            {
                if (this.oldBannerAd)
                {
                    this.oldBannerAd.hide();
                }

                if (!this.isShowBanner)
                {
                    this.showBanner();
                }
                else
                {
                    this.hideBanner();
                }
            })
            bannerAd.onError(err =>
            {
                Logger.warn('swan banner出错', JSON.stringify(err));
            })
        }

    }

    showBanner()
    {
        Logger.info("进入显示banner");
        this.isShowBanner = true;

        let bannerAd: any = this.oldBannerAd;
        if (bannerAd)
        {
            bannerAd.show()
        }
    };

    hideBanner()
    {
        Logger.info("进入隐藏banner");
        this.isShowBanner = false

        let bannerAd: any = this.oldBannerAd;
        if (bannerAd)
        {
            bannerAd.hide()
        }
    };

    destroySelf()
    {
        let bannerAd: any = this.oldBannerAd;
        if (bannerAd)
        {
            bannerAd.destroy();
            this.oldBannerAd = {};
        }
        this.isShowBanner = false
    };

    // video
    private videoTime: number = 0;
    public videoAds: Array<string> = ["7363206"];

    public isVoice: boolean = false;
    public createRewardedVideoAd(_callback: Function)
    {
        GameSys.audio.pauseAll();
        this.videoTime++;
        if (this.videoTime >= 3)
        {
            this.videoTime = 0;
            this.videoNum++;
            this.instantiationRewardAd();
        }

        let onClose = (res) =>
        {
            GameSys.audio.resumeAll();
            if (res.isEnded)//if ((res && res.isEnded) || res === undefined)
            {
                _callback(true);
            } else
            {
                _callback(false);
            }
            this.rewardedVideoAd.offClose(onClose);
            this.rewardedVideoAd.offError(onError);
        };

        let onError = (res) =>
        {
            console.log("rewardad" + res.errCode + " : " + res.errMsg);
            GameSys.game.xSet("tip", "广告正在准备中，请重启或稍后再试");
            this.rewardedVideoAd.offError(onError);
        };

        this.rewardedVideoAd.load()
            .then(() => this.rewardedVideoAd.show())
            .catch(err => console.log(err.errMsg));

        this.rewardedVideoAd.onClose(onClose);
        this.rewardedVideoAd.onError(onError);
    }

    // 主动分享
    public static clickTime: number = 0;
    shareAppMessage(_callback: Function)
    {
        return new Promise(resolve =>
        {
            BDApi.clickTime = new Date().getTime();
            swan.offHide();
            swan.onHide(() =>
            {
                swan.offShow();
                swan.onShow(() =>
                {
                    GameSys.audio.playBGM("audios/bgm");
                    let space: number = Math.ceil((new Date().getTime() - BDApi.clickTime) / 1000);
                    console.log("返回了前台 中间间隔：", space);
                    if (space >= 5)
                    {
                        _callback(true);

                    } else
                    {
                        _callback(false);
                    }
                });
            });
            swan.shareAppMessage({
                desc: GameSys.shareDesc,
                title: GameSys.shareTitle,
                imageUrl: GameSys.imageUrl
            });
        })
    }

    //添加到小程序引导
    private favoriteGuide()
    {
        Logger.info("添加小程序引导");
        swan.showFavoriteGuide({
            type: 'bar',
            content: '一键添加到我的小程序',
            success: res =>
            {
                console.log('添加成功：', res);
            },
            fail: err =>
            {
                console.log('添加失败：', err);
            }
        })
        swan.showFavoriteGuide({
            type: 'tip',
            content: '一键添加到我的小程序',
            success: res =>
            {
                console.log('添加成功：', res);
            },
            fail: err =>
            {
                console.log('添加失败：', err);
            }
        })
    }
    // 右上角分享
    showShareMenu(withShareTicket: boolean = true)
    {
        return new Promise(resolve =>
        {
            let obj: any = {};
            obj.withShareTicket = withShareTicket;
            obj.success = res =>
            {
                // console.log("success", res);
            };
            obj.fail = res =>
            {
                // console.log("fail", res);
            };
            obj.complete = res =>
            {
            };
            swan.showShareMenu(obj);
            swan.onShareAppMessage(() =>
            {
                return {
                    title: GameSys.shareTitle,
                    imageUrl: GameSys.imageUrl
                }
            }
            );
        })

    }
}
