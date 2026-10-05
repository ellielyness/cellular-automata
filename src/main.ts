import './style.css'

const uc = {
    loneliness: 2,
    cooperation: 3,
    competition: 4,
    reproduction: 3,
    abundance: 0.99
}


const canvas = document.getElementById('canvas');
if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Uh oh.. Thats not a canvas.')
}

const cells = {
    width: 20,
    height:20,
}

const w = Math.floor(window.innerWidth / cells.width);
const h = Math.floor(window.innerHeight / cells.height);

canvas.width = w*cells.width;
canvas.height = h*cells.height;

let gridState = new Uint8Array(w*h)
let memoryState = new Uint8Array(w*h);

// Creating a random grid state
for (let i = 0;i<gridState.length;i++) {
    const check = Math.random();
    if (check>uc.abundance) {
        gridState[i] = 1;
    } else {
        gridState[i] = 0;
    }
}

// Helper function for getting the coordinate based on the index
function getXY(i:number) {
    const nx = i % w;
    const ny = Math.floor(i/w);
    return [nx,ny]
}

// Helper function for drawing the grid
function drawGrid(canvas:HTMLCanvasElement,state:Uint8Array) {
    for (let i = 0;i<state.length;i++) {
        const xy = getXY(i);
        const context = canvas.getContext("2d")
        if (!(context instanceof CanvasRenderingContext2D)) {
            throw new Error('Uh oh.. stinky..')
        }
        context.fillStyle = (`rgb(${memoryState[i]},${memoryState[i]},${memoryState[i]})`)
        context.fillRect(xy[0]*cells.width,xy[1]*cells.height,cells.width,cells.height);
    }
}

// Initial Grid Draw
drawGrid(canvas,gridState)

// Helper function for getting the neighbourhood. Takes the cell number.
function neighbourhood(i:number,state:Uint8Array) {

    const xy = getXY(i);
    const x = xy[0];
    const y = xy[1];

    let total = 0;
    for (let dy = -1; dy<=1;dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const rx = (x+dx+w) % w;
            const ry = (y+dy+h) % h;
            total += state[ry*w+rx];
        }
    }
    return total;
}

// Survival Check
function survival(i:number,state) {

    const neighbours = neighbourhood(i,state)
    if (state[i]>0) {
        if (neighbours < uc.loneliness) {
            return 0
        } else if (neighbours > uc.cooperation) {
            return 0
        } else {
            return 1
        }
    } else {
        if (neighbours===uc.reproduction) {
            return 1
        } else {
            return 0
        }
    }
}

// Helper function for getting the neighbourhood. Takes the cell number.
function miracle(i:number,state:Uint8Array) {

    const xy = getXY(i);
    const x = xy[0];
    const y = xy[1];

    let total = 0;
    for (let dy = -1; dy<=1;dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const rx = (x+dx+w) % w;
            const ry = (y+dy+h) % h;
            state[ry*w+rx]=1;
        }
    }
    console.log('Miracle!')
}

let t = 0;

function animate() {
    
    const newState = new Uint8Array(gridState.length);

    for (let i = 0;i<gridState.length;i++) {
        const alive = survival(i,gridState)
        newState[i] = alive;
        if (alive < 1) {
            if (memoryState[i] > 0) memoryState[i]-=5;
        } else {
            memoryState[i]=255;
        }
    }

    drawGrid(canvas,newState);
    gridState = newState;

    t++;
    if (t > 100) {
        miracle(Math.floor(Math.random()*gridState.length),gridState)
        t=0;
    }
}
setInterval(animate,20)