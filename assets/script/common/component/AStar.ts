export enum GRIDTYPE
{
    BARRIOR = 0,//障碍物
    LEFT,//
    RIHGHT,
    START,//开始
    END //结束

}
export class Grid
{
    x: number;
    y: number;
    h: number;
    g: number;
    f: number;
    parent: Grid;
    type: GRIDTYPE;
    constructor()
    {
        this.x = 0;//x是格子在坐标系中x位置
        this.y = 0;//y是格子在坐标系中的y位置
        this.h = 0;//h是指定节点到结束节点的代价（距离）
        this.g = 0;//g值是初始节点到任意节点的代价（距离）
        this.f = 0;//f是g和h的和，通过反复比较f得到最后的最短距离
        this.parent = null;//parent规定了当前是以哪个格子作为父节点去判断四周相邻格子的g，h，f的值
        this.type = GRIDTYPE.BARRIOR;
    }
}

const { ccclass, property } = cc._decorator;
let BINDER_NAME: string = 'AStar'
@ccclass
export default class AStar extends cc.Component
{
    mapH: number = 24;//地图高度
    mapW: number = 42;//地图宽
    gridH: number = 40//格子高
    gridW: number = 40;//格子宽
    posStart: cc.Vec2 = cc.v2(27, 1);//开始节点地图中坐标位置
    posEnd: cc.Vec2 = cc.v2(0, 0);//结束节点地图中坐标位置

    Map_Path: number[][] = []
    openList: Grid[];
    closeList: Grid[];
    gridsList: Grid[][];
    path: Grid[]
    is8dir: boolean = true;//是否可斜走


    onLoad()
    {
    }

    findPath(startPos: cc.Vec2, endPos: cc.Vec2)
    {
        let startGrid: Grid = this.gridsList[startPos.x][startPos.y];
        this.openList.push(startGrid);
        let curGrid: Grid = this.openList[0];//取最初
        while (this.openList.length > 0 && curGrid.type != GRIDTYPE.END)
        {
            curGrid = this.openList[0];
            if (curGrid.type == GRIDTYPE.END)
            {
                this.generatePate(curGrid)
                return;
            }
            for (let i = -1; i <= 1; i++)
            {
                for (let j = -1; j <= 1; j++)
                {
                    if (i != 0 || j != 0)
                    {
                        let col = curGrid.x + i;
                        let row = curGrid.y + j;
                        if (col >= 0 && row >= 0 && col <= this.mapW && row <= this.mapH
                            && this.gridsList[col][row].type != GRIDTYPE.BARRIOR
                            && this.closeList.indexOf(this.gridsList[col][row]) < 0)
                        {
                            if (this.is8dir)
                            {
                                if (this.gridsList[col - i][row].type == GRIDTYPE.BARRIOR || this.gridsList[col][row - j].type == GRIDTYPE.BARRIOR)
                                {
                                    continue;//周围格子是障碍物就执行到这里
                                }
                            }
                            else
                            {
                                if (Math.abs(i) == Math.abs(j))
                                {
                                    continue;//如果是斜方向的就执行这里
                                }
                            }
                            //计算g值 
                            let g = curGrid.g + parseInt(Math.sqrt(Math.pow(i * 10, 2) + Math.pow(j * 10, 2)).toFixed(0));
                            if (this.gridsList[col][row].g == 0 || this.gridsList[col][row].g > g)
                            {
                                this.gridsList[col][row].g = g;
                                //更新父节点
                                this.gridsList[col][row].parent = curGrid;
                            }
                            //计算h的值 曼哈顿算法
                            this.gridsList[col][row].h = Math.abs(endPos.x - col) + Math.abs(endPos.y - row);
                            //计算f值
                            this.gridsList[col][row].f = this.gridsList[col][row].g + this.gridsList[col][row].h;
                            //判断是否在开放列表里
                            if (this.openList.indexOf(this.gridsList[col][row]) < 0)
                            {
                                // console.log("+-----", col, row)
                                this.openList.push(this.gridsList[col][row])
                            }

                        }
                    }
                }
            }
            //遍历完四周后，把当前节点加入关闭列表
            this.closeList.push(curGrid)
            this.openList.splice(this.openList.indexOf(curGrid), 1);
            if (this.openList.length <= 0)
            {
                console.error("找不到路径", this.posEnd.x, this.posEnd.y);
            }
            //重新按f值排序
            this.openList.sort((i, j) => { return i.f - j.f });
        }
    }
    sortFunc(x, y)
    {
        return x.f - y.f;
    }
    generatePate(grid: Grid)
    {
        this.path.push(grid);
        while (grid.parent)
        {
            grid = grid.parent;
            this.path.push(grid);
        }
        // console.log("PATH", this.path, grid);
        // for (let i = 0; i < this.path.length; i++)
        // {
        //     //起点不覆盖
        //     if (i != 0 && i != this.path.length - 1)
        //     {
        //         let grid = this.path[i]
        //         // this.draw(grid.x, grid.y, cc.Color.YELLOW)
        //     }
        // }
    }
    initMap()
    {
        this.openList = [];
        this.closeList = [];
        this.path = [];
        this.gridsList = []
        // this.map.clear();

        this.gridsList = new Array(this.mapW + 1);//26列
        for (let i = 0; i < this.gridsList.length; i++)
        {
            this.gridsList[i] = new Array(this.mapH + 1)//16行
        }

        for (let i = 0; i <= this.mapW; i++)
        {
            for (let j = 0; j <= this.mapH; j++)
            {
                this.addGrid(i, j, this.TYPE[this.Map_Path[i][j]])
            }
        }
        // console.log(this.posStart, this.posEnd)
        this.addGrid(this.posStart.x, this.posStart.y, GRIDTYPE.START)
        this.addGrid(this.posEnd.x, this.posEnd.y, GRIDTYPE.END)
        // console.log(this.gridsList)
    }
    TYPE: GRIDTYPE[] = [GRIDTYPE.BARRIOR, GRIDTYPE.LEFT, GRIDTYPE.RIHGHT]
    addGrid(col: number, row: number, type: GRIDTYPE)
    {
        let grid = new Grid();
        grid.x = col;
        grid.y = row;
        grid.type = type;
        this.gridsList[col][row] = grid;
    }
}
