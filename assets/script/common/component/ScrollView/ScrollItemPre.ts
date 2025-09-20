const { ccclass, property } = cc._decorator;

export type PictureData = {
    index: number//下标
    path: string//路径
}
@ccclass
export default class ScrollItemPre extends cc.Component
{
    @property(cc.Sprite)
    picSprite: cc.Sprite = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.Node)
    placeHolderContentNode: cc.Node = null;

    @property(cc.Node)
    placeHolderLoadingNode: cc.Node = null;

    private data: PictureData = null;
    onLoad()
    {
        this.node.opacity = 0;
    }

    init(_data: PictureData)
    {
        this.data = _data;
    }
    /**
         * 本Item进入ScrollView的时候回调
         */
    onEnterSrcollView()
    {
        this.node.opacity = 255;
        this._loadAndShowPic();
    }
    /**
     * 本Item离开ScrollView的时候回调
     */
    onExitScrollView()
    {
        this.node.opacity = 0;
    }
    private _showPlaceHolder()
    {
        this.placeHolderContentNode.active = true;
        this.placeHolderContentNode.stopAllActions();
        this.placeHolderContentNode.opacity = 255;

        this.placeHolderLoadingNode.stopAllActions();
        cc.tween(this.placeHolderContentNode)
            .by(1, { angle: 360 })
            .union().repeatForever()
            .start()

        //this.placeHolderLoadingNode.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
    }

    async _loadAndShowPic()
    {
        this._showPlaceHolder();

        await new Promise((resolve, reject) =>
        {
            setTimeout(() =>
            {
                resolve()
            }, 160);
        })
        //this.picSprite.spriteFrame = await this.loadSpriteFrameFromResources(this.data.path) as cc.SpriteFrame
        //this.descLabel.string = `${this.data.index}: ${this.data.path}`;
        //this.descLabel.string = `${this.data.index}`
        this._hidePlaceHolder();
    }
    private _hidePlaceHolder()
    {
        this.placeHolderContentNode.stopAllActions();
        cc.tween(this.placeHolderContentNode)
            .delay(0.24)
            .call(() =>
            {
                this.placeHolderContentNode.active = false;
                this.placeHolderLoadingNode.stopAllActions();
            })
            .start()


        // this.placeHolderContentNode.runAction(
        //     cc.sequence(
        //         cc.fadeOut(0.24),
        //         cc.callFunc(() =>
        //         {
        //             this.placeHolderContentNode.active = false;
        //             this.placeHolderLoadingNode.stopAllActions();
        //         }, this)
        //     )
        // );
    }
    loadSpriteFrameFromResources(spriteFrameUrl: string)
    {
        return new Promise<cc.SpriteFrame>((resolve, reject) =>
        {
            cc.loader.loadRes(spriteFrameUrl, cc.SpriteFrame, (error: Error, spriteFrame) =>
            {
                if (error != null)
                {
                    if (CC_DEBUG)
                    {
                        cc.error(`load (${spriteFrameUrl}) failed!`);
                        cc.error(error);
                    }
                    reject(error);
                    return;
                }
                resolve(spriteFrame);
            });
        });
    }
}
