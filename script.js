// --- 核心变量定义 ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

// 定义游戏状态
const GAME_STATE = {
    LOGO: 'LOGO',
    ANIMATION: 'ANIMATION',
    PRESS_START: 'PRESS_START',
    PLAYING: 'PLAYING',
    GAMEOVER: 'GAMEOVER'
};

let currentGameState = GAME_STATE.LOGO; // 初始状态为 Logo
let gameInterval; // 用于存储游戏循环的定时器
// ... (其他蛇的逻辑变量保持原样)
let score = 0;
let gridSize = 20;
let snake = [{x: 160, y: 160}, {x: 140, y: 160}, {x: 120, y: 160}];
let dx = gridSize;
let dy = 0;
let foodX, foodY;

// --- 获取界面元素 ---
const screens = {
    logo: document.getElementById('logo-screen'),
    animation: document.getElementById('animation-screen'),
    game: document.getElementById('game-screen'),
    prompt: document.getElementById('start-prompt')
};
const videoPlayer = document.getElementById('intro-video');

// ==========================================
//   第一部分：开场控制流 (New Logic)
// ==========================================

// 1. 初始化：进入页面开始 Logo 闪烁，2.5秒后自动切换
function initIntroSequence() {
    console.log("游戏加载，进入LOGO状态...");
    currentGameState = GAME_STATE.LOGO;
    
    // 2.5秒后，Logo 淡出，进入动画
    setTimeout(() => {
        switchState(GAME_STATE.ANIMATION);
    }, 2500);
}

// 2. 状态切换函数：负责界面的显示和隐藏
function switchState(newState) {
    console.log(`状态切换: ${currentGameState} -> ${newState}`);
    
    // 隐藏所有界面
    Object.values(screens).forEach(s => s.classList.replace('show', 'hide'));
    
    currentGameState = newState;

    switch (newState) {
        case GAME_STATE.LOGO:
            screens.logo.classList.replace('hide', 'show');
            break;
            
        case GAME_STATE.ANIMATION:
            screens.animation.classList.replace('hide', 'show');
            // 播放视频 (如果是MP4)
            if (videoPlayer) {
                videoPlayer.play().catch(e => {
                    console.log("视频自动播放失败(浏览器限制)，直接进入提示阶段。", e);
                    switchState(GAME_STATE.PRESS_START);
                });
                // 视频播放结束时触发下一个状态
                videoPlayer.onended = () => switchState(GAME_STATE.PRESS_START);
            } else {
                // 如果是GIF，我们手动定个时，比如5秒
                setTimeout(() => switchState(GAME_STATE.PRESS_START), 5000);
            }
            break;
            
        case GAME_STATE.PRESS_START:
            screens.game.classList.replace('hide', 'show'); // 显示画布但不动
            screens.prompt.classList.replace('hide', 'show'); // 显示黄色提示
            ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height); // 清空画布
            break;
            
        case GAME_STATE.PLAYING:
            screens.prompt.classList.replace('hide', 'show'); // 隐藏黄色提示
            startGame(); // 真正的启动游戏循环
            break;
    }
}

// 3. 监听“任意键”启动游戏
document.addEventListener("keydown", (event) => {
    // 只有在 PRESS_START 状态下按键才有效
    if (currentGameState === GAME_STATE.PRESS_START) {
        // 防止和游戏内控制按键冲突
        event.preventDefault(); 
        switchState(GAME_STATE.PLAYING);
    } 
    // ...游戏内的其他方向键监听保持在后方
});

// 适配移动端：触摸屏幕也可以开始
document.addEventListener("touchstart", () => {
    if (currentGameState === GAME_STATE.PRESS_START) {
        switchState(GAME_STATE.PLAYING);
    }
});


// ==========================================
//   第二部分：原游戏逻辑 (保持原样)
// ==========================================

function startGame() {
    score = 0;
    snake = [{x: 160, y: 160}, {x: 140, y: 160}, {x: 120, y: 160}];
    dx = gridSize;
    dy = 0;
    scoreElement.innerHTML = score;
    createFood();
    if (gameInterval) clearInterval(gameInterval); // 清除旧循环
    gameInterval = setInterval(main, 100); // 启动新循环
}

// 游戏主循环 (原main函数)
function main() {
    if (didGameEnd()) {
        clearInterval(gameInterval);
        currentGameState = GAME_STATE.GAMEOVER;
        alert("游戏结束！得分: " + score);
        switchState(GAME_STATE.PRESS_START); // 回到待机状态
        return;
    }
    clearCanvas(); drawFood(); advanceSnake(); drawSnake();
}

// ...（其余原有的代码：advanceSnake, drawSnake, createFood, changeDirection, move, didGameEnd 等全部保留在下方）
// ...确保 changeDirection 监听依然存在
document.addEventListener("keydown", changeDirection);
// ...确保之前添加的手机 adapter move 函数依然存在
function move(dir) { /* ... */ }
function changeDirection(event) { /* ... */ }
function clearCanvas() { /* ... */ }
function drawSnake() { /* ... */ }
function drawFood() { /* ... */ }
function createFood() { /* ... */ }
function didGameEnd() { /* ... */ }

// --- 真正的入口 ---
initIntroSequence();
