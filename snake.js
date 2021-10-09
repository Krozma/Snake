const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const w = 30;
const h = 30;
const W = 630;
const H = 630;
const rows = H/h;
const cols = W/w;
let speed = 80
const game = {
    state: 'running'
}
const dir = {x:0, y:-1}

const foodIcon = {
    x: null, 
    y: null,
    img: null,
    eaten: 0
}
const pooIcon = {
    x: null, 
    y: null,
    icon: null
}

let score = 0;
let startTime = new Date()
const foods = [
    {
        img: 'doughnut',
        value:100,
        eaten: 0
    },
    {
        img: 'grapes',
        value:30,
        eaten: 0
    },
    {
        img: 'green-apple',
        value:10,
        eaten: 0
    },
    {
        img: 'hamburger',
        value:50,
        eaten: 0
    },
    {
        img: 'hot-dog',
        value:15,
        eaten: 0
    },
    {
        img: 'peach',
        value:50,
        eaten: 0
    },
    {
        img: 'pizza',
        value:70,
        eaten: 0
    },
    {
        img: 'red-apple',
        value:60,
        eaten: 0
    },
    {
        img: 'soft-ice-cream',
        value:90,
        eaten: 0
    },
    {
        img: 'strawberry',
        value:80,
        eaten: 0
    },
    {
        img: 'watermelon',
        value:100,
        eaten: 0
    },
]

const pooDelay = 3000;
const foodDelay = 2000;

const snake = {
    body:[
        {x:11, y:11},
        {x:11, y:12},
        {x:11, y:13},
        {x:11, y:14},
        {x:11, y:15}
    ], 
    colour:('purple')
}

window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp':    onKey(0, -1); break
      case 'ArrowLeft':  onKey(-1, 0); break
      case 'ArrowDown':  onKey(0, 1); break
      case 'ArrowRight': onKey(1, 0); break
    }
  })



function onKey(dx, dy) {
    if (dir.x == -dx || dir.y == -dy){
        return
    }
    dir.x = dx;
    dir.y = dy;
}

function clear(){
    canvas.width = W;
    canvas.height = H;
}


function drawSnake(fill, stroke, food){
    const lastIndex = snake.body.length -1;
    const tail = {
        x: snake.body[lastIndex].x, 
        y: snake.body[lastIndex].y
    }
    for (let i = snake.body.length -1; i > 0; i--) {
        snake.body[i] = {
            x: snake.body[i -1].x,
            y: snake.body[i -1].y
        }
    }
    if (food === true){
        snake.body.push(tail);
    }

    const s = snake.body[0]
    s.x += dir.x;
    s.y += dir.y;
    
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1
    
    snake.body.forEach(s =>{
        ctx.rect(s.x* w, s.y* h, w, h);
        ctx.fill();
        ctx.stroke();
    } )
    document.getElementById('length').innerText = snake.body.length;
}

function setIcon(){
    pooIcon.x = Math.floor(Math.random()* cols);
    pooIcon.y = Math.floor(Math.random()* rows);
    pooIcon.img = 'poo'
    pooIcon.active = true
    clearPooTimeout = setTimeout(clearIcon, pooDelay) 
}

function clearIcon(){
    pooIcon.active = false
    createPooTimeout = setTimeout(setIcon, pooDelay)
}

function setFood(){
    foodIcon.x = Math.floor(Math.random()* cols);
    foodIcon.y = Math.floor(Math.random()* rows);
    const rand = Math.floor(Math.random()* foods.length);
    foodIcon.img = foods[rand].img;
    foodIcon.active = true
    foodIcon.index = rand
    clearPooTimeout = setTimeout(clearFoodIcon, foodDelay) 
}

function clearFoodIcon(){
    foodIcon.active = false
    createFoodTimeout = setTimeout(setFood, foodDelay)
}

function drawIcon(){
    if(!pooIcon.active){
        return
    }    
    let img = document.getElementById(pooIcon.img)
    ctx.drawImage(img, pooIcon.x* w, pooIcon.y* h, w, h);
}

function drawFood(){
    if(!foodIcon.active){
        return
    }  
    console.log(foodIcon.img)  
    let img = document.getElementById(foodIcon.img)
    ctx.drawImage(img, foodIcon.x* w, foodIcon.y* h, w, h);
}

function gameOver(){
    drawSnake('red', 'white')   
    clearTimeout(clearPooTimeout)
    clearTimeout(createPooTimeout)
    clearTimeout(clearFoodTimeout)
    clearTimeout(createFoodTimeout)
    document.getElementById('canvas').classList.add('shake')
}

function getScore(){
    const now = new Date();
    let timeScore = Math.floor((now - startTime)/100);
    let foodScore = 0;
    for(let i = 0; i < foods.length; i++){
        foodScore += foods[i].value* foods[i].eaten;
    }
    return timeScore + foodScore; 
}

function isRunning(){
    if(game.state != 'running'){
        return false;
    }
    return true
}

function isOutOfRange(){
    const s = snake.body[0]
    // checking game boundries
    if(s.x < 0 || s.y < 0 || s.x > cols -1 || s.y > rows -1){
        gameOver();
        return true;
    }
    return false
}

function isOnPoo(){
    const s = snake.body[0]
    if(pooIcon.active && s.x == pooIcon.x && s.y == pooIcon.y){
        gameOver();
        return true;
    }
    return false;
}

function isOnItself(){
    const s = snake.body[0]
    const nextPos = {
        x: s.x + dir.x,
        y: s.y + dir.y
    }
    var collision = false;
    for (let i = 0; i < snake.body.length; i++){
        if(nextPos.x == snake.body[i].x && nextPos.y == snake.body[i].y){
            collision = true;
        }
    }
    if (collision){
        gameOver();
        return true;
    }
    return false;
}

function isEating(){
    const s = snake.body[0]
    if(foodIcon.active && s.x == foodIcon.x && s.y == foodIcon.y){
        foodIcon.active = false;
        let eaten = ++foods[foodIcon.index].eaten;
        document.getElementById(foodIcon.img+'-picked').innerText = eaten;
        return true;
    }
    return false;
}

function run(){
     if (!isRunning()){return;}
     if (isOutOfRange()){return;}
     if (isOnPoo()){return;}
     if (isOnItself()){return;}

     
     let food = isEating();



    clear();
    drawIcon()
    drawFood()
    drawSnake(snake.colour, 'white', food)
    document.getElementById('score').innerText = getScore();
    setTimeout(run, speed)
}

run()
let createPooTimeout = setTimeout(setIcon, 1000)
let clearPooTimeout
let createFoodTimeout = setTimeout(setFood, 0)
let clearFoodTimeout

function testFoodItems(){
    for (let i = 0; i < foods.length; i++){
        foodIcon.img = foods[i].img;
        foodIcon.x = i
        foodIcon.y = i
        foodIcon.active = true
        drawFood();
    }
}