/******************************************************************
 * Copyright(C)
 *
 * 日志
 *
 *
 ******************************************************************/

// 日志等级
let LOG_LEVEL: any = {
  All: 0, // 全部
  Info: 1, // 普通+警告+错误
  Warn: 2, // 警告+错误
  Error: 3 // 错误
};

export default class Logger
{
  public static caches: Array<any> = [];
  public static level: number = LOG_LEVEL.All;
  public static limit: number = 1000;

  // 设置等级
  public static setLevel(_lv: number)
  {
    Logger.level = _lv;
  }

  // 调试
  public static debug(...args: any)
  {
    if (Logger.level != LOG_LEVEL.All)
    {
      return;
    }

    Logger._output(1, Logger.formatS(args));
  }

  // 普通
  public static info(...args: any)
  {
    // console.log(args);
    if (Logger.level > LOG_LEVEL.Info)
    {
      return;
    }

    Logger._output(1, Logger.formatS(args));
  }

  // 警告
  public static warn(...args: any)
  {
    if (Logger.level > LOG_LEVEL.Warn)
    {
      return;
    }

    Logger._output(2, Logger.formatS(args));
  }

  // 错误
  public static error(...args: any)
  {
    if (Logger.level > LOG_LEVEL.Error)
    {
      return;
    }

    Logger._output(3, Logger.formatS(args));
  }

  // 获取时间
  public static getTime()
  {
    let d: any = new Date();
    let str: string = cc.js.formatStr(
      "[%d.%d %d:%d:%d:%d]",
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    );
    return str;
  }

  // 输出日志
  public static _output(_type: number, _text: string)
  {
    let text: string = cc.js.formatStr("%s-> %s", Logger.getTime(), _text);
    switch (_type)
    {
      case 2:
        console.warn(text);
        break;
      case 3:
        console.error(text);
        break;
      default:
        console.log(text);
        break;
    }

    this.caches.push(text);
    if (this.caches.length > this.limit)
    {
      this.caches.splice(0, 100);
    }
  }

  // 直接格式化
  public static formatS(...args: any)
  {
    let msg: string = args[0][0];
    args[0].shift();
    let text: string = cc.js.formatStr(msg, ...args[0]);
    return text;
  }
}
