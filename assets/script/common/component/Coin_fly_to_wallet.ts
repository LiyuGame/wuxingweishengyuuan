import GameSys from "../manager/GameSys";
import { Config } from "../manager/Config";

let BINDER_NAME = "goldAnim"
const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin_fly_to_wallet extends cc.Component
{
  @property(cc.Prefab)
  coinPrefab: cc.Prefab = null;

  coinPool: cc.NodePool = null;

  onLoad()
  {
    this.node.zIndex = 100;
    this.coinPool = new cc.NodePool();
    this.initCoinPool();
  }
  onEnable()
  {
    GameSys.game.xBind(Config.GOLD, this.playAnim.bind(this), BINDER_NAME)
  }
  onDestroy()
  {
    GameSys.game.xUnbind(BINDER_NAME)
  }
  initCoinPool(count: number = 20)
  {
    for (let i = 0; i < count; i++)
    {
      let coin = cc.instantiate(this.coinPrefab);
      this.coinPool.put(coin);
    }
  }

  playAnim(data: { v: number, index: number })
  {
    // console.log("进来", data)
    if (data.index > 0)
    {
      let randomCount = Math.random() * 15 + 10;
      let stPos = this.node.getPosition();

      let edPos = GameSys.game.xGet(Config.GOLDPOS)
      // console.log("开始位置", stPos)
      this.playCoinFlyAnim(randomCount, stPos, edPos);
    }
  }

  playCoinFlyAnim(count: number, stPos: cc.Vec2, edPos: cc.Vec2, r: number = 130)
  {
    // 确保当前节点池有足够的金币
    const poolSize = this.coinPool.size();
    const reCreateCoinCount = poolSize > count ? 0 : count - poolSize;
    this.initCoinPool(reCreateCoinCount);

    // 生成圆，并且对圆上的点进行排序
    let points = this.getCirclePoints(r, stPos, count);
    let coinNodeList = points.map(pos =>
    {
      let coin = this.coinPool.get();
      coin.setPosition(stPos);
      this.node.addChild(coin);
      return {
        node: coin,
        stPos: stPos,
        mdPos: pos,
        edPos: edPos,
        dis: (pos as any).sub(edPos).mag()
      };
    });
    coinNodeList = coinNodeList.sort((a, b) =>
    {
      if (a.dis - b.dis > 0) return 1;
      if (a.dis - b.dis < 0) return -1;
      return 0;
    });

    // 执行金币落袋的动画
    coinNodeList.forEach((item, idx) =>
    {
      cc.tween(item.node)
        .to(0.3, { x: item.mdPos.x, y: item.mdPos.y })
        .delay(idx * 0.01)
        .to(0.5, { x: item.edPos.x, y: item.edPos.y })
        .call(() =>
        {
          this.coinPool.put(item.node);
        })
        .start()
      // item.node.runAction(
      //   cc.sequence(
      //     cc.moveTo(0.3, item.mdPos),
      //     cc.delayTime(idx * 0.01),
      //     cc.moveTo(0.5, item.edPos),
      //     cc.callFunc(() =>
      //     {
      //       this.coinPool.put(item.node);
      //     })
      //   )
      // );
    });
  }

  /**
   * 以某点为圆心，生成圆周上等分点的坐标
   *
   * @param {number} r 半径
   * @param {cc.Vec2} pos 圆心坐标
   * @param {number} count 等分点数量
   * @param {number} [randomScope=80] 等分点的随机波动范围
   * @returns {cc.Vec2[]} 返回等分点坐标
   */
  getCirclePoints(r: number, pos: cc.Vec2, count: number, randomScope: number = 60): cc.Vec2[]
  {
    let points = [];
    let radians = (Math.PI / 180) * Math.round(360 / count);
    for (let i = 0; i < count; i++)
    {
      let x = pos.x + r * Math.sin(radians * i);
      let y = pos.y + r * Math.cos(radians * i);
      points.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0));
    }
    return points;
  }
}
