/******************************************************************
 * Copyright(C)
 *
 * 工具集
 *
 *
 ******************************************************************/
export default class UtilsManager
{
    //深复制
    public static clone(src: any)
    {
        if (!src || typeof src !== "object")
        {
            return src;
        }

        let out: any = src.constructor === Array ? [] : {};

        let _clone: Function = function (o: Object, c: any)
        {
            for (let i in o)
            {
                if (o[i] && typeof o[i] === "object")
                {
                    if (o[i].constructor === Array)
                    {
                        c[i] = [];
                    }
                    else
                    {
                        c[i] = {};
                    }
                    _clone(o[i], c[i]);
                }
                else
                {
                    c[i] = o[i];
                }
            }
            return c;
        };

        return _clone(src, out);
    }

    public static async loadJson(_address: string)
    {
        return new Promise(resolve =>
        {
            cc.loader.loadRes(_address, cc.JsonAsset, (err, asset) =>
            {
                if (err)
                {
                    console.error(err);
                    resolve({});
                }
                else
                {
                    resolve(asset.json);
                }
            });
        })
    }

    public static async loadAudioClip(_address: string)
    {
        return new Promise(resolve =>
        {
            cc.loader.loadRes(_address, cc.AudioClip, (err, asset) =>
            {
                if (err)
                {
                    console.error(err);
                    resolve(null);
                }
                else
                {
                    resolve(asset);
                }
            });
        })
    }
    public static async loadPrefab(_address: string)
    {
        return new Promise(resolve =>
        {
            cc.resources.load(_address, cc.Prefab, (err, asset) =>
            {
                if (err)
                {
                    console.error(err);
                    resolve(null);
                }
                else
                {
                    resolve(asset);
                }
            });
        })
    }
    public static async loadImage(_address: string)
    {
        return new Promise(resolve =>
        {
            cc.resources.load(_address, cc.SpriteFrame, (err, asset) =>
            {
                if (err)
                {
                    console.error(err, _address);
                    resolve(null);
                }
                else
                {
                    resolve(asset);
                }
            });
        })
    }



}
