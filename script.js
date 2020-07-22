/////////////////////////////////////////////////
// 1.Creating grid with item positions and properties
/////////////////////////////////////////////////

class Cell {
    positionX;
    positionY;
    color;
    shouldChangeColor;
    timesWasGreen = 0;
    oppositeColorNeightbors = 0;
    neighbors = [];

    constructor(positionX, positionY, color, shouldChangeColor) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.color = color;
        this.shouldChangeColor = shouldChangeColor;
    }

    incrementTimesWasGreen() {
        this.timesWasGreen++;
    }

    // Grid with items positions and color shange conditions in the grid

    findNeighbors(grid) {
        // console.log(`current cell position X:${this.positionX}, Y:${this.positionY}`);

        // items.neighbors = 

        //left item position
        if (this.positionX - 1 > -1) {
            // console.log(`Left neighbor`);
            this.neighbors.push(grid.items[this.positionY][this.positionX - 1]);
        }
        //right item position
        if (this.positionX + 1 <= grid.width - 1) {
            // console.log(`Right neighbor`);
            this.neighbors.push(grid.items[this.positionY][this.positionX + 1]);
        }

        //top left item position
        if (this.positionX - 1 > -1 && this.positionY - 1 > -1) {
            // console.log('Top Left')
            this.neighbors.push(grid.items[this.positionY - 1][this.positionX - 1]);
        }
        //top right item position
        if (this.positionX + 1 <= grid.width - 1 && this.positionY - 1 > -1) {
            // console.log('Top Right')
            this.neighbors.push(grid.items[this.positionY - 1][this.positionX + 1]);
        }
        //top item position
        if (this.positionY - 1 > -1) {
            // console.log(`Top neighbor`);
            this.neighbors.push(grid.items[this.positionY - 1][this.positionX]);
        }

        //bottom left item position
        if (this.positionX - 1 > -1 && this.positionY + 1 <= grid.height - 1) {
            // console.log('Bottom Left');
            this.neighbors.push(grid.items[this.positionY + 1][this.positionX - 1]);
        }

        //bottom right item position
        if (this.positionX + 1 <= grid.width - 1 && this.positionY + 1 <= grid.height - 1) {
            // console.log('Bottom Right')
            this.neighbors.push(grid.items[this.positionY + 1][this.positionX + 1]);
        }
        //bottom item position
        if (this.positionY + 1 <= grid.height - 1) {
            // console.log(`Bottom neighbor`);
            this.neighbors.push(grid.items[this.positionY + 1][this.positionX]);
        }
    }


    //item change to green color rules
    checkShouldChangeColor() {
        const greenNeighbors = this.neighbors.filter(neighbor => neighbor.color == '1').length;
        // console.log(`has [${redNeighbors}] red neighbors and [${greenNeighbors}] green neighbors.`);


        if (this.color == 0 && [3, 6].includes(greenNeighbors)) {
            // console.log(`Cell color is RED AND HAS ${greenNeighbors} GREEN neighbors and should change color to GREEN`);
            this.shouldChangeColor = true;
        }

        if (this.color == 1 && [0, 1, 4, 5, 7, 8].includes(greenNeighbors)) {
            // console.log(`Cell color is GREEN AND HAS ${redNeighbors} RED neighbors and should change color to RED`);
            this.shouldChangeColor = true;
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////
//2. visualisation grid with increment how many times one item change color properties 
//////////////////////////////////////////////////////////////////////////////////////


class Grid {
    width = 0;
    height = 0;
    items = [];
    trackedCellCoordinates = { x: 0, y: 0 };
    currentGeneration = 0;
    generationN = 0;

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    setGenerationN(number) {
        this.generationN = number;
    }

    setRowItems(row, items) {
        const newItems = items.split('');
        this.items[row] = [];
        newItems.forEach(element => {
            this.items[row].push(new Cell(this.items[row].length, row, element, false));
            if (element == 1) {
                this.items[row][this.items[row].length - 1].incrementTimesWasGreen();
            }
        });
        // this.items[row] = 
    }

    setTrackedCellCoordinates(x, y) {
        this.trackedCellCoordinates = {
            x: x,
            y: y
        }
    }

    //////////////////////////////////////////////////////////////////////
    //3.Generating matrix grid with generationN conditions for color change
    //////////////////////////////////////////////////////////////////////
    drawMatrix() {
        console.log(`== CURRENT GENERATION IS: ${grid.currentGeneration}`);
        this.items.forEach(row => {
            console.log('--------');
            console.log(row.map(item => item.color).join('|'));
        });


        const counterMessage = `Cell X:${this.trackedCellCoordinates.x}, Y:${this.trackedCellCoordinates.y} was ${this.items[this.trackedCellCoordinates.y][this.trackedCellCoordinates.x].timesWasGreen} times green`;
        console.log(counterMessage);
        const generationContainer = document.getElementsByClassName(`generation-${this.currentGeneration}`);
        const counterElement = document.createElement('div');
        counterElement.classList.add('sub-heading');
        counterElement.textContent = counterMessage;
        generationContainer[0].appendChild(counterElement);
    }


    //Loop finding item neighbours
    findAllNeighbors() {
        for (let i = 0; i < this.items.length; i++) {
            const row = this.items[i];
            for (let j = 0; j < row.length; j++) {
                const item = this.items[i][j];
                item.neighbors = [];
                item.findNeighbors(this);
                item.checkShouldChangeColor();
                // console.log(item.neighbors);
                // console.log('----------------------------');
            }
        }
    }

    //////////////////////////////////////////////////////////
    //4.Generations color change conditions and visualization
    /////////////////////////////////////////////////////////

    changeCellColorsIfNeeded() {
        const generationContainer = document.getElementsByClassName(`generation-${this.currentGeneration}`);

        const matrixElement = document.createElement('div');
        matrixElement.classList.add('matrix');
        generationContainer[0].appendChild(matrixElement);

        for (let i = 0; i < this.items.length; i++) {
            const row = this.items[i];

            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            for (let j = 0; j < row.length; j++) {
                if (this.items[j][i].shouldChangeColor) {
                    this.items[j][i].color = (this.items[j][i].color == 1) ? 0 : 1;
                    this.items[j][i].shouldChangeColor = false;
                }
                if (this.items[j][i].color == 1) {
                    this.items[j][i].incrementTimesWasGreen();
                }


                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.classList.add(`cell-${this.items[j][i].color == 1 ? 'green' : 'red'}`);


                if (i === this.trackedCellCoordinates.x && j === this.trackedCellCoordinates.y) {
                    cellElement.classList.add('cell-tracked');
                }

                cellElement.textContent = this.items[j][i].color;
                rowElement.appendChild(cellElement);
                // console.log('----------------------------');
            }

            matrixElement.appendChild(rowElement);
        }
    }

    processGeneration() {
        this.drawMatrix();
        this.findAllNeighbors();
        this.changeCellColorsIfNeeded();
        this.currentGeneration++;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //5.loop going though all the grid items finding all the neighbour, generating coloring as per generatons rules
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    playGame() {
        const gameWrapper = document.getElementById('gameWrapper');
        for (let i = 0; i <= this.generationN; i++) {
            let gameContainer = document.createElement('div');
            const heading = document.createElement('div');
            heading.classList.add('heading');
            heading.textContent = `THIS IS GENERATION ${this.currentGeneration}`;
            gameContainer.appendChild(heading);
            gameContainer.classList.add(`generation-${this.currentGeneration}`);
            gameWrapper.appendChild(gameContainer);
            this.processGeneration();
        }
    }
}

//Loop properties

const grid = new Grid(3, 3);
grid.setRowItems(0, "000");
grid.setRowItems(1, "111");
grid.setRowItems(2, "000");
grid.setTrackedCellCoordinates(1, 1);
grid.setGenerationN(10);
grid.playGame();