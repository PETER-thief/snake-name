const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

let score = 0;
let gridSize = 20; // 格子大小
let snake = [{x: 160, y: 160}, {x: 140, y: 160}, {x: 120, y: 160}]; // 蛇初始位置
let dx = gridSize; // 水平移动速度
let dy = 0;        // 垂直移动速度
let foodX, foodY;

// 启动游戏
createFood();
main();

// 游戏主循环
function main() {
    if (didGameEnd()) return alert("游戏结束！得分: " + score);

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, 100); // 100毫秒刷新一次，就是蛇的速度
}

// 让蛇动起来
function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head); // 在数组开头加个头

    // 检查是否吃到食物
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        scoreElement.innerHTML = score;
        createFood();
    } else {
        snake.pop(); // 没吃到就删掉尾巴
    }
}

// 绘制蛇
function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = (index === 0) ? "#2ecc71" : "#27ae60"; // 头是亮绿色
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}

// 基础绘图函数... (篇幅关系简化，核心逻辑已在上面)
function clearCanvas() { ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height); }

function createFood() {
    foodX = Math.round((Math.random() * (canvas.width - gridSize)) / gridSize) * gridSize;
    foodY = Math.round((Math.random() * (canvas.height - gridSize)) / gridSize) * gridSize;
}

function drawFood() {
    ctx.fillStyle = "#e74c3c"; // 食物是红色
    ctx.fillRect(foodX, foodY, gridSize, gridSize);
}

// 监听按键
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && dx === 0) { dx = -gridSize; dy = 0; } // 左
    if (keyPressed === 38 && dy === 0) { dx = 0; dy = -gridSize; } // 上
    if (keyPressed === 39 && dx === 0) { dx = gridSize; dy = 0; }  // 右
    if (keyPressed === 40 && dy === 0) { dx = 0; dy = gridSize; }  // 下
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - gridSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - gridSize;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}