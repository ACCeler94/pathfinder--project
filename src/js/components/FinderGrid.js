import { select, settings, classNames } from "../settings.js";

class FinderGrid {
  constructor() {
    const thisGrid = this;

    thisGrid.numOfColumns = settings.FinderGrid.FinderGridColumns;
    thisGrid.numOfRows = settings.FinderGrid.FinderGridRows;
    thisGrid.numOfSquares = thisGrid.numOfColumns * thisGrid.numOfRows

    thisGrid.initGrid();
    thisGrid.initActions();
  }

  initGrid() {
    const gridElement = document.querySelector(select.containerOf.grid);

    for (let i = 1; i <= settings.FinderGrid.FinderGridColumns * settings.FinderGrid.FinderGridRows; i++) {
      const square = document.createElement('div');
      square.classList.add(classNames.square);
      square.setAttribute('id', `${i}`);
      gridElement.appendChild(square);
    }
  }

  initActions() {
    const thisGrid = this;
    const gridContainer = document.querySelector(select.containerOf.grid);

    if (gridContainer.classList.contains('step-1')) {

      gridContainer.addEventListener('click', function selectSquare(event) {
        const elementId = event.target.getAttribute('id')
        let adjacentToTarget;
        if (!event.target.classList.contains('disabled'))
          event.target.classList.toggle(classNames.selected);
        console.log(elementId);
        adjacentToTarget = thisGrid.calculateAdjacent(elementId)
        console.log('adjacentToTarget', adjacentToTarget)
      })
    }
  }

  calculateAdjacent(elementId) {
    const thisGrid = this;

    const adjacentSquares = [];
    const id = parseInt(elementId);
    const idPrevious = id - 1 // id of the square to the left
    const idNext = id + 1; // id of the square to the right
    const idBelow = id + thisGrid.numOfColumns; // id of the square in a row below
    const idAbove = id - thisGrid.numOfColumns; // id of the square in a row above

    const idPreviousString = idPrevious.toString();
    const idNextString = idNext.toString();
    const idBelowString = idBelow.toString();
    const idAboveString = idAbove.toString();

    // statement for 1st line to check only the line below
    if (id <= thisGrid.numOfColumns) {
      if (id % thisGrid.numOfColumns === 1) { // push only next and below for the first square
        adjacentSquares.push(idNextString, idBelowString)
      } else if (id % thisGrid.numOfColumns === 0) { // push only previous and below for last square
        adjacentSquares.push(idPreviousString, idBelowString)
      } // statement for the rest elements of this row
      adjacentSquares.push(idPreviousString, idNextString, idBelowString)

      // check last row
    } else if (id <= thisGrid.numOfSquares && id >= thisGrid.numOfSquares - thisGrid.numOfColumns) {
      if (id % thisGrid.numOfColumns === 1) { // check for first element of last row
        adjacentSquares.push(idNextString, idAboveString);
      } else if (id % thisGrid.numOfColumns === 0) { // check for last element
        adjacentSquares.push(idPreviousString, idAboveString);
      } // statement for the rest elements of this row
      adjacentSquares.push(idPreviousString, idNextString, idAboveString)

      // statement for the rest of the rows
    } else {
      if ((id % thisGrid.numOfColumns === 1)) { // check for first element in a row
        adjacentSquares.push(idNextString, idBelowString, idAboveString)
      } else if ((id % thisGrid.numOfColumns === 0)) { // check for last element in a row
        adjacentSquares.push(idPreviousString, idBelowString, idAboveString)
      }

      adjacentSquares.push(idPreviousString, idNextString, idBelowString, idAboveString)
    }

    return adjacentSquares
  }
}

export default FinderGrid;