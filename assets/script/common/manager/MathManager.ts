export default class MathManager
{
    static instance: MathManager

    static getInstance(): MathManager
    {
        this.instance = this.instance ? this.instance : new MathManager();
        return this.instance
    }

    //数组循环执行
    moveFunc(times: number, callback: Function)
    {
        let count: number = 0;
        let loop = (() =>
        {
            if (count >= times)
            {
                return;
            }
            count++;
            callback();
            loop()
        })
        loop();
    }

    //创建一维数组
    linearArray<T>(value: T, len: number)
    {
        let arr = new Array<T>()
        for (let i = 0; i < len; i++)
        {
            arr.push(value)
        }
        return arr
    }
    //创建二维数组
    createArray(_arr: any[][], _size: { row: number, col: number }, value: any)
    {
        for (let row = 0; row < _size.row; row++)
        {
            _arr.push([])
            for (let col = 0; col < _size.col; col++)
            {
                _arr[row][col] = {
                    row: row,
                    col: col,
                    state: {
                        cutting: value,
                        group: [0]
                    }
                };
            }
        }
    }

    //遍历二维数组
    visitArray<T>(_arr: T[][], callback: (row: number, col: number) => void)
    {
        for (let row = 0; row < _arr.length; row++)
        {
            for (let col = 0; col < _arr[row].length; col++)
            {
                callback(row, col)
            }
        }
    }

    //遍历一维数组
    visitLinearArray<T>(_arr: T[], callback: (x: number) => void)
    {
        for (let row = 0; row < _arr.length; row++)
        {
            callback(row)
        }
    }

    //矩阵行列互换
    transformArray<T>(_arr: T[][]): T[][]
    {
        let newArray: T[][] = new Array<Array<T>>()
        for (let row = 0; row < _arr[0].length; row++)
        {
            // newArray.push([])
            newArray[row] = []
            for (let col = 0; col < _arr.length; col++)
            {
                // console.log(row, col)
                newArray[row][col] = _arr[col][row]
            }
        }
        // console.log("矩阵转化", newArray)
        return newArray
    }
    //二分搜索
    binarySearch<T>(arr: T[], x, n: number)
    {
        let left = 0, right = n - 1, middle = -1;
        while (left <= right)
        {
            middle = (left + right) / 2;
            if (x == arr[middle])
                return middle;
            else if (x > arr[middle])
                left = middle + 1;
            else
                right = middle - 1;
        }
        return -1;
    }
    //随机数获取方法
    randomNum(minNum: number, maxNum: number)
    {
        switch (arguments.length)
        {
            case 1:
                return Math.floor(Math.random() * minNum + 1);
                break;
            case 2:
                return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
                break;
            default:
                return 0;
                break;
        }
    }
}