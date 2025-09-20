const { ccclass, property } = cc._decorator;

import Props from "../kernels/Props";
import Logger from "../manager/Log";
import eCode from "./eCode";

@ccclass
export default class Http extends Props
{

    public onlineAdress: string = "";
    constructor()
    {
        super();
    }

    public mId: number = 0;
    public timeOut: number = 5000;
    public appVersion: string = "1.0.0";

    public get(_url: string, _args: any)
    {
        return new Promise(
            (resolve, reject) =>
            {

                if (_url.indexOf("http") >= 0)
                {
                    reject(eCode.Error);
                    return;
                }

                let str: string = "";
                for (let k in _args)
                {
                    if (str == "")
                    {
                        str = "?";
                    } else
                    {
                        str += "&";
                    }
                    if (Array.isArray(_args[k]) ||
                        typeof (_args[k]) == "object")
                    {
                        str += k + "=" + JSON.stringify(_args[k]);
                    }
                    else
                    {
                        str += k + "=" + _args[k];
                    }
                }

                let url = this.onlineAdress + _url + str;

                this._request(
                    "GET",
                    url,
                    {},
                    res =>
                    {
                        resolve(res);
                    },
                    res =>
                    {
                        reject(res);
                    }
                );
            })
    }
    getTime(url: string, callBack?: any, target?: any)
    {
        console.log("HTTP GET:", url);
        let request = cc.loader.getXMLHttpRequest();
        request.timeout = 10000;
        request.open("GET", url, true);
        request.addEventListener("error", onError);
        request.addEventListener("abort", onError);
        request.setRequestHeader("Content-Type", "application/json");

        //responseText 返回一个DOMString，这是一个UTF-16字符串
        request.onreadystatechange = (res) =>
        {
            if (request.readyState === 4 && (request.status >= 200 && request.status < 400))
            {
                console.log("http res(" + request.responseText.length + "):" + request.responseText);
                try
                {
                    onComplete(request.responseText);
                    // console.error("成功", res)
                    // resolve(request.responseText)
                } catch (e)
                {
                    console.error("err:" + e);
                    // reject(res)
                }
                finally { }
            }
        }
        request.ontimeout = (e) =>
        {
            //超时，接口调用失败
            if (callBack != null)
            {
                callBack.call(target, { error: true });
            }
            // console.log(action, "请求超时")
            console.log(e, "请求超时")
        }
        request.send(null);

        // AppUtil.showLoading();
        function onComplete(responseText: any)
        {
            // AppUtil.hideLoading();
            var data = JSON.parse(responseText);
            var code = data["errcode"];
            // console.warn("errcode:>" + code);
            if (!code)
            {
                if (callBack != null)
                {
                    callBack.call(target, data);
                }
            }
        }

        function onError(evt)
        {
            // AppUtil.hideLoading();
            // AppUtil.showMessage("请求接口失败：onError" + JSON.stringify(evt));

            if (callBack != null)
            {
                callBack.call(target, { error: true });
            }
        }

    }
    public post(_url: string, _args: any)
    {
        return new Promise(
            (resolve, reject) =>
            {
                if (_url.indexOf("http") >= 0)
                {
                    reject(eCode.Error);
                    return;
                }
                let url: string = this.onlineAdress + _url;
                this._request("POST", url, _args,
                    res =>
                    {
                        resolve(res);
                    },
                    res =>
                    {
                        reject(res);
                    }
                );

            })
    }

    private _request(_op: string, _url: string, _data: any, _suc: Function, _failed: Function)
    {

        let errorback = function (code)
        {
            Logger.error("error" + code);
            _failed(code);
        }

        let xhr = cc.loader.getXMLHttpRequest();

        xhr.mId = ++this.mId;

        xhr.onerror = function ()
        {
            xhr.abort();
            errorback(eCode.Error);
        };

        xhr.ontimeout = function ()
        {
            xhr.abort();
            errorback(eCode.TimeOut);
        };

        xhr.onreadystatechange = function ()
        {

            if (xhr.readyState != 4 || xhr.status == 0)
            {
                return;
            }

            if (xhr.status >= 200 && xhr.status < 300)
            {
                let ret;
                try
                {
                    ret = JSON.parse(xhr.responseText);
                }
                catch (e)
                {
                    errorback(eCode.BadJson);
                    return;
                }


                if (typeof (ret) != "object" ||
                    typeof (ret.code) != "number" ||
                    typeof (ret.data) != "object")
                {
                    _suc(ret);
                }
                else
                {

                    if (ret.code == eCode.Ok)
                    {
                        _suc(ret.data);
                    }
                    else
                    {
                        errorback(ret.code);
                    }
                }

                return;
            }

            if (xhr.status == 404)
            {
                errorback(eCode.NotFound);
            }
        };

        xhr.open(_op, _url, true);
        xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
        xhr.setRequestHeader("Authorization", null);
        xhr.setRequestHeader("App-Version", this.appVersion);
        xhr.setRequestHeader("Repeated-Submission", new Date().getTime() + "");

        if (cc.sys.isNative)
        {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        xhr.timeout = this.timeOut;
        if (_op == "POST")
        {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(_data);
        } else
        {
            xhr.send();
        }
        Logger.info("%s[%d]:%s", _op, xhr.mId, _url);
        return xhr;

    }


}
