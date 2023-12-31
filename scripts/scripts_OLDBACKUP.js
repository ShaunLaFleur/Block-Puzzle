let game = {
  score:0,
  started:false,
  upcomingBlock:{},
  maxCol: 10, // Defines the maximum columns.
  maxRow: 20, // Defines the maximum rows.
  grid: [], // First index is the x coordinate, second is the y, then 0 = true or false and 1 = color. So grid[x][y][0] returns true or false and grid[x][y][1] returns the color.
  shapeL:{ // Default values for L shape
    Position:[
      [[3,1],[4,1],[5,1],[5,0]], // Orientation 1
      [[4,0],[4,1],[4,2],[5,2]], // Orientation 2
      [[5,1],[4,1],[3,1],[3,2]], // Orienation 3
      [[4,2],[4,1],[4,0],[3,0]], // Orientation 4
    ], 
    Orientation: 0, // Holds the orientation of the shape.
    Color: "rgb(224, 86, 0)", // Holds the color of the objects; used to color the grid.
  },
  shapeJ:{ 
    Position:[
      [[3,0],[3,1],[4,1],[5,1]], 
      [[5,0],[4,0],[4,1],[4,2]],
      [[5,2],[5,1],[4,1],[3,1]],
      [[3,2],[4,2],[4,1],[4,0]],
    ], 
    Orientation: 0, 
    Color: "rgb(0, 0, 255)",
  },
  shapeT:{ 
    Position:[
      [[3,1],[4,1],[5,1],[4,0]], 
      [[4,0],[4,1],[4,2],[5,1]], 
      [[3,1],[4,1],[5,1],[4,2]], 
      [[4,2],[4,1],[4,0],[3,1]], 
    ], 
    Orientation: 0, 
    Color: "rgb(170, 0, 255)", 
  },
  shapeO:{ 
    Position:[
      [[4,0],[5,0],[4,1],[5,1]], 
    ], 
    Orientation: 0, 
    Color: "rgb(255, 244, 0)", 
  },
  shapeI:{ 
    Position:[
      [[3,1],[4,1],[5,1],[6,1]], 
      [[5,0],[5,1],[5,2],[5,3]], 
      [[3,2],[4,2],[5,2],[6,2]], 
      [[4,0],[4,1],[4,2],[4,3]], 
    ], 
    Orientation: 0, 
    Color: "rgb(166, 244, 255)", 
  },
  shapeS:{ 
    Position:[
      [[3,1],[4,1],[4,0],[5,0]], 
      [[4,0],[4,1],[5,1],[5,2]], 
      [[5,1],[4,1],[4,2],[3,2]], 
      [[4,2],[4,1],[3,1],[3,0]], 
    ], 
    Orientation: 0, 
    Color: "rgb(0, 247, 0)", 
  },
  shapeZ:{ 
    Position:[
      [[3,0],[4,0],[4,1],[5,1]], 
      [[5,0],[5,1],[4,1],[4,2]], 
      [[5,2],[4,2],[4,1],[3,1]], 
      [[3,2],[3,1],[4,1],[4,0]], 
    ], 
    Orientation: 0, 
    Color: "rgb(255, 0, 0)", 
  },
  activeShape:{},
  bgColor:"rgba( 255, 255, 255, 0.25 )",
  highestRow:21, // Used to store the highest row that's occupied to prevent unnecessarily checking a bunch of empty rows. Set to one more than the maximum row.
  upcomingGrid:[],
  animationDelay:500,
}

// Grid generation. Since DIVs are placed left to right in the grid due to wrapping we must the outer loop for rows and the inner loop for columns. During the first iteration through the columns, we need to initiate them since they do not yet exist.
window.onload = function() {
  const container = document.getElementById('container');
  for (let y = 0; y < game.maxRow; y++) {
    for (let x = 0; x < game.maxCol; x++) {
      if(y === 0) {
        game.grid.push([]); // Initializes the columns. While y is 0, we are iterating through the columns for the first time, so we need to create them.
     }
      const elem = document.createElement('div');
      container.appendChild(elem);
      elem.setAttribute('data-x', x);
      elem.setAttribute('data-y', y);
      elem.setAttribute("onClick","test2(this)"); // remove this test functionality later
      game.grid[x].push({ occupied: false, backgroundColor: game.bgColor, element: elem }); // Now that the columns are initiated, we push each row index to its respective column, which will contain an object holding it's attributes and a reference to its respective DOM element.
    }
  }
}

function startGame() {
  if(!game.started) {
    generateUpcoming();
    spawnShape();
    game.started = true;
  } 
}

// Key press functionality
document.addEventListener("keydown", event => {
  const orientation = game.activeShape.Orientation;
  const position = game.activeShape.Position[orientation];
  if (event.code === "ArrowLeft" && !collisionCheck(position, -1, 0)) { // check left
      moving(-1, 0);
  } else if(event.code === "ArrowRight" && !collisionCheck(position, 1, 0)) { // check right
    moving(1, 0);
  } else if(event.code === "ArrowDown" && !collisionCheck(position, 0, 1)) {
    moving(0, 1);
  } else if(event.code === "ArrowUp") {
    flipShape(1);
  } else if(event.code === "Digit0") {
    flipShape(-1);
  }
});

function generateUpcoming() {
  renderUpcoming("undraw");
  // A 2D array to store a reference/pointer to each shape object and an array storing its corresponding DIV IDs that need to be rendered for the upcoming graphic.
  const upcomingArray = [
    [game.shapeL, [3,7,6,5]],
    [game.shapeJ, [2,6,7,8]],
    [game.shapeT, [3,6,7,8]],
    [game.shapeO, [2,3,6,7]],
    [game.shapeI, [5,6,7,8]],
    [game.shapeS, [3,2,5,6]],
    [game.shapeZ, [2,3,7,8]],
  ];
  const max = upcomingArray.length-1;
  const index = Math.floor(Math.random()*((max+1)-0)+0); // Generates a random number between 0-max.
  game.upcomingBlock = upcomingArray[index][0]; // Set the upcoming block to the chosen shape
  game.upcomingGrid = upcomingArray[index][1]; // Store the DIV IDs we need to render for the upcoming graphic.
  renderUpcoming("draw");
}

// Test functionality
function test2(ele) {
  let x = ele.getAttribute("data-x");
  let y = ele.getAttribute("data-y");
  console.log(`X: ${ele.getAttribute("data-x")}`);
  console.log(`Y: ${ele.getAttribute("data-y")}`);
  console.log(`The color of this grid is ${game.grid[x][y].backgroundColor}`);
}

function spawnShape() {
  game.activeShape = structuredClone(game.upcomingBlock); // Clones the upcomingBlock into a new object
  render("draw");
  game.activeShape.fallInterval = setInterval(function() {
    const orientation = game.activeShape.Orientation;
    const position = game.activeShape.Position[orientation];
    if(!collisionCheck(position, 0, 1)) {
      moving(0, 1);}
  }, game.animationDelay);
  generateUpcoming();
}

function flipShape(adj) {
  if(game.activeShape.Position.length === 1) { // If this shape has only one orientation.
    return; // we return
  }
  const orientationCount = game.activeShape.Position.length;
  const currentOrientation = game.activeShape.Orientation;
  const newOrientation = (currentOrientation + adj + orientationCount) % orientationCount; // Use modular arithmetic to get the new orienation based on the adjustment.
  if(!collisionCheck(game.activeShape.Position[newOrientation], 0, 0)) {
    render("undraw"); // Uncolor the current position
    game.activeShape.Orientation = newOrientation; // Set the new orientation to the active one
    render("draw"); // Color the new updated position
  } else {
    return;
  }
}

// Renders or undraws the currently active shape
function render(drawOrUndraw) {
  let renderColor;
  const orientation = game.activeShape.Orientation;
  const position = game.activeShape.Position[orientation];
  if(drawOrUndraw === "draw") {
    renderColor = game.activeShape.Color;
  } else if(drawOrUndraw === "undraw") {
    renderColor = game.bgColor;
  } else {
    console.log("Render function called with improper parameter.");
  }
  for(let i=0; i<position.length; i++){
    const x = position[i][0];
    const y = position[i][1];
    game.grid[x][y].backgroundColor = renderColor;
    game.grid[x][y].element.style.backgroundColor = renderColor;
  }
}

function renderUpcoming(drawOrUndraw) {
  let renderColor;
  console.log(`Called to ${drawOrUndraw} positions ${game.upcomingGrid}`);
  if(drawOrUndraw === "draw") {
    renderColor = game.upcomingBlock.Color;
  } else if(drawOrUndraw === "undraw") {
    renderColor = game.bgColor;
  }
  game.upcomingGrid.forEach(divID => {
    const divElement = document.getElementById(`${divID}`);
    divElement.style.backgroundColor = renderColor;
  });
}

function moving(dx, dy) {
  render("undraw"); // Undraws the current location before updating it's coordinates.
  for(const orientation of game.activeShape.Position) { // for each orientation of the active shape's position array
    for(const piece of orientation) { // for each piece (an array) of each orientation
      piece[0] += dx; // Add dx to the first (x) coordinate.
      piece[1] += dy; // Add dy to the second (y) coordinate.
    }
  }
  render("draw"); // Draws the new location after the coordinates are updated.
}

function collisionCheck(checkPosition, dx, dy) {
  for(let i=0; i<checkPosition.length; i++) {
    const x = checkPosition[i][0];
    const y = checkPosition[i][1];
    if(dx === 0 && dy === 1 && (y === game.maxRow-1 || game.grid[x+dx][y+dy].occupied === true)) { // if dx is 0 and dy is 1 we are falling, thus we check if we are on the floor row or a block is right below us.
      settleShape();
      return true; // collision is true
    } else if(!isInsideGrid(x+dx, y+dy) || game.grid[x+dx][y+dy].occupied === true) {
      return true; // collision is true
    }
  }
  return false; // collision not found

  // Helper function just to shorten up the if statement above.
  function isInsideGrid(x, y) {
    return x >= 0 && x < game.maxCol && y >= 0 && y < game.maxRow;
  }
}

function settleShape(){
  const orientation = game.activeShape.Orientation;
  const position = game.activeShape.Position[orientation];
  let lowestRow = game.activeShape.Position[0][0][1]; // Sets up the variable for holding the lowest row that the shape occupies.
  for(let i=0; i<position.length; i++){ // Iterate through the active position's shape pieces.
    if(position[i][1] > lowestRow) { // If the current piece of the shape is on a lower row than the previous
      lowestRow = position[i][1]; // then update to the lowest row
    }
    if(position[i][1] < game.highestRow) { // If the currently checked shape piece is on a higher row than the highest logged row
      game.highestRow = position[i][1]; // then update the highestRow
    }
    const x = position[i][0];
    const y = position[i][1];
    game.grid[x][y].occupied = true;
    game.grid[x][y].backgroundColor = game.activeShape.Color;
  }
  clearInterval(game.activeShape.fallInterval);
  checkRows(lowestRow,game.highestRow-1); // Starts checking rows starting from the lowest row the shape occupies and stops before highestRow-1.
  if(game.highestRow === 0) {
    alert("You lose!");
    gameOver();
  } else {
    spawnShape();
  }
}

async function checkRows(startHere, stopHere) {
  for(let y=startHere; y>stopHere; y--) {
    // Use stopHere to allow recursive calling of this function while only checking some rows instead of having to iterate over them all multiple times. -1 to check all, 18 to check only bottom row.
    // for loop to iterate through each column
    for(let x=0; x < game.maxCol; x++) {
      if(game.grid[x][y].occupied === false) { 
        break; // If any of the grid cells on the row are empty, we stop looping this row and move on.
      } else if(game.grid[x][y].occupied === true && x === 9) { // If the last grid cell on row (19) is true, then that means all were true
        await clearRows(y);
      }
    }
  }
}

async function clearRows(row) { // Row is the row that needs to be cleared.
  console.log(`Clearing row ${row}`);
  for(let i=0; i<game.maxCol; i++) { // i iterates through the columns
    let x = i; // for better readability
    let y = row;
    game.grid[x][y].occupied = false;
    game.grid[x][y].backgroundColor = game.bgColor;
    game.grid[x][y].element.style.backgroundColor = "gold"; // Uncolors the cleared row
    await delay(20); // for animation effect
    game.grid[x][y].element.style.backgroundColor = game.bgColor;
  }
  const scoreElem = document.getElementById("score");
  scoreElem.innerHTML = `${game.score += 10}`;
  for(let a=row-1; a>=0; a--) {  // bring all shapes down by iterating through every row going up, starting at "row-1" (the row above the row that was cleared) and clearing each occupied cell then pushing it's values to the one cell below it.
    for(let b=0; b<game.maxCol; b++) {
      y = a;
      x = b;
      console.log(`Bringing down objects on column ${x} from row ${y} down to row ${y+1}`);
      if(game.grid[x][y].occupied === true) {
        selector = `[data-x="${x}"][data-y="${y}"]`;
        targetDiv = document.querySelector(selector);
        game.grid[x][y].occupied = false;
        game.grid[x][y+1].occupied = true;
        game.grid[x][y+1].backgroundColor = game.grid[x][y].backgroundColor; // Sets the color
        game.grid[x][y].backgroundColor = game.bgColor;
        game.grid[x][y].element.style.backgroundColor = game.bgColor;
        game.grid[x][y+1].element.style.backgroundColor = game.grid[x][y+1].backgroundColor;
      }
    }
  }
  await checkRows(row,row-1); // recursively calls clearRows(row,row-1), since you call it to start at "row" and stop before "row-1", you're only checking the cleared row again in case it needs to be recleared while avoiding iterating through all the rows
}

// function to allow async and allow for a clearing animation not to interfere with the animation that brings shapes down a row
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function gameOver() {
  game.started = false;
  game.highestRow = 21;
  game.score = 0;
  const scoreElem = document.getElementById("score");
  scoreElem.innerHTML = "0";
  renderUpcoming("undraw");
  // Clear the main board.
  for(const column of game.grid) { // For each column (first index) of the game.grid array
    for(const gridObject of column) { // for each object held inside of the row index OF each column
      if(gridObject.occupied === true) { // Skips coloring/updating already empty DIVs.
        gridObject.occupied = false;
        gridObject.backgroundColor = game.bgColor;
        gridObject.element.style.backgroundColor = game.bgColor;
      }
    }
  }
}

