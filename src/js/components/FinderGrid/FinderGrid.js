import { select, settings, classNames } from "../../settings.js";

class FinderGrid {
  constructor() {
    const thisFinder = this;

    thisFinder.numOfColumns = settings.FinderGrid.FinderGridColumns;
    thisFinder.numOfRows = settings.FinderGrid.FinderGridRows;
    thisFinder.numOfSquares = thisFinder.numOfColumns * thisFinder.numOfRows;
    thisFinder.allSquares = [];
    thisFinder.selectedSquares = [];
    thisFinder.isStartSelected = false;
    thisFinder.isEndSelected = false;
    thisFinder.startIndex;
    thisFinder.endIndex;
    thisFinder.start;
    thisFinder.end;
    thisFinder.routes = [];
    this.eventHandlers = {
      selectSquare: function (event) {
        const elementId = event.target.getAttribute('id')
        let adjacentToTarget;

        if (!event.target.classList.contains(classNames.disabled) && !event.target.classList.contains(classNames.selected)) {
          event.target.classList.add(classNames.selected);
          adjacentToTarget = thisFinder.calculateAdjacent(elementId)
          console.log('adjacentToTarget', adjacentToTarget)
          thisFinder.selectedSquares.push({
            squareId: elementId,
            adjacent: adjacentToTarget
          });
          console.log(thisFinder.selectedSquares);
        } else if (event.target.classList.contains(classNames.selected)) { // removes selection when clicked again
          event.target.classList.remove(classNames.selected);
          thisFinder.selectedSquares = thisFinder.selectedSquares.filter(element => element.squareId !== elementId);
          console.log(thisFinder.selectedSquares);
        }

        thisFinder.disableNonAdjacentSquares()
      },
      initStep2: function () {
        if (thisFinder.selectedSquares.length > 2) {
          thisFinder.dom.gridContainer.classList.remove('step-1');
          thisFinder.dom.gridContainer.classList.add('step-2');

          thisFinder.dom.finderText.innerHTML = settings.FinderGrid.step2Message;
          thisFinder.dom.finderButton.innerHTML = settings.FinderGrid.step2ButtonText;

          // disable all non-selected squares
          thisFinder.disableNonSelected();

          // remove old event listeners
          thisFinder.dom.gridContainer.removeEventListener('click', thisFinder.eventHandlers.selectSquare);
          thisFinder.dom.finderButton.removeEventListener('click', thisFinder.eventHandlers.initStep2);

          // rerun initActions() to assign new event listeners based on step
          thisFinder.initActions();

        } else {
          thisFinder.dom.finderButton.innerHTML = settings.FinderGrid.step1ButtonFail;
          setTimeout(() => {
            thisFinder.dom.finderButton.innerHTML = settings.FinderGrid.step1ButtonText;
          }, 2000);
        }
      },
      selectStartAndEnd: function (event) {

        if (event.target.classList.contains(classNames.selected)) {
          if (!thisFinder.isStartSelected && !thisFinder.isEndSelected) {
            event.target.classList.add(classNames.start);
            thisFinder.isStartSelected = true;

            thisFinder.startIndex = thisFinder.selectedSquares.findIndex(element => {
              return element.squareId === event.target.id
            });

          } else if (thisFinder.isStartSelected && event.target.classList.contains(classNames.start)) {
            event.target.classList.remove(classNames.start);
            thisFinder.isStartSelected = false;
          } else if (thisFinder.isStartSelected && !thisFinder.isEndSelected) {
            event.target.classList.add(classNames.end);
            thisFinder.isEndSelected = true;

            thisFinder.endIndex = thisFinder.selectedSquares.findIndex(element => {
              return element.squareId === event.target.id
            });

          } else if (thisFinder.isEndSelected && event.target.classList.contains(classNames.end)) {
            event.target.classList.remove(classNames.end);
            thisFinder.isEndSelected = false;
          }
        }
      },
      initStep3: function () {
        if (thisFinder.isStartSelected && thisFinder.isEndSelected) {
          thisFinder.dom.gridContainer.classList.remove('step-2');
          thisFinder.dom.gridContainer.classList.add('step-3');

          thisFinder.dom.finderText.innerHTML = settings.FinderGrid.step3Message;
          thisFinder.dom.finderButton.innerHTML = settings.FinderGrid.step3ButtonText;

          // remove old event listeners
          thisFinder.dom.gridContainer.removeEventListener('click', thisFinder.eventHandlers.selectStartAndEnd);
          thisFinder.dom.finderButton.removeEventListener('click', thisFinder.eventHandlers.initStep3);

          thisFinder.computeRoute();

          // rerun initActions() to assign new event listeners based on step
          thisFinder.initActions();
        } else {
          thisFinder.dom.finderButton.innerHTML = settings.FinderGrid.step2ButtonFail;
          setTimeout(() => {
            thisFinder.dom.finderButton.innerHTML = settings.FinderGrid.step2ButtonText;
          }, 2000);
        }
      }
    }


    thisFinder.initFinder();
    thisFinder.getElements();
    thisFinder.initActions();
  }

  initFinder() {
    const thisFinder = this;
    const gridElement = document.querySelector(select.containerOf.grid);

    for (let i = 1; i <= settings.FinderGrid.FinderGridColumns * settings.FinderGrid.FinderGridRows; i++) {
      const square = document.createElement('div');
      square.classList.add(classNames.square);
      square.setAttribute('id', `${i}`);
      gridElement.appendChild(square);
      thisFinder.allSquares.push(square);
    }

    document.querySelector(select.finderText).innerHTML = settings.FinderGrid.step1Message;
    document.querySelector(select.finderButton).innerHTML = settings.FinderGrid.step1ButtonText;
  }

  getElements() {
    const thisFinder = this;
    thisFinder.dom = {};

    thisFinder.dom.gridContainer = document.querySelector(select.containerOf.grid);
    thisFinder.dom.finderText = document.querySelector(select.finderText);
    thisFinder.dom.finderButton = document.querySelector(select.finderButton);

  }

  initActions() {
    const thisFinder = this;

    if (thisFinder.dom.gridContainer.classList.contains('step-1')) {
      // event listener for grid squares
      thisFinder.dom.gridContainer.addEventListener('click', thisFinder.eventHandlers.selectSquare);

      // event listener for finder button
      thisFinder.dom.finderButton.addEventListener('click', thisFinder.eventHandlers.initStep2);

    } else if (thisFinder.dom.gridContainer.classList.contains('step-2')) {
      // event listener for grid squares
      thisFinder.dom.gridContainer.addEventListener('click', thisFinder.eventHandlers.selectStartAndEnd);

      // event listener for finder button
      thisFinder.dom.finderButton.addEventListener('click', thisFinder.eventHandlers.initStep3);
    }
  }

  calculateAdjacent(elementId) {
    const thisFinder = this;

    const adjacentSquares = [];
    const id = parseInt(elementId);
    const idPrevious = id - 1 // id of the square to the left
    const idNext = id + 1; // id of the square to the right
    const idBelow = id + thisFinder.numOfColumns; // id of the square in a row below
    const idAbove = id - thisFinder.numOfColumns; // id of the square in a row above

    const idPreviousString = idPrevious.toString();
    const idNextString = idNext.toString();
    const idBelowString = idBelow.toString();
    const idAboveString = idAbove.toString();

    // statement for 1st line to check only the line below
    if (id <= thisFinder.numOfColumns) {
      if (id % thisFinder.numOfColumns === 1) { // push only next and below for the first square
        adjacentSquares.push(idNextString, idBelowString)
      } else if (id % thisFinder.numOfColumns === 0) { // push only previous and below for last square
        adjacentSquares.push(idPreviousString, idBelowString)
      } else { // statement for the rest elements of this row
        adjacentSquares.push(idPreviousString, idNextString, idBelowString)
      }

      // check last row
    } else if (id <= thisFinder.numOfSquares && id >= thisFinder.numOfSquares - thisFinder.numOfColumns) {
      if (id % thisFinder.numOfColumns === 1) { // check for first element of last row
        adjacentSquares.push(idNextString, idAboveString);
      } else if (id % thisFinder.numOfColumns === 0) { // check for last element
        adjacentSquares.push(idPreviousString, idAboveString);
      } else { // statement for the rest elements of this row
        adjacentSquares.push(idPreviousString, idNextString, idAboveString)
      }

      // statement for the rest of the rows
    } else {
      if ((id % thisFinder.numOfColumns === 1)) { // check for first element in a row
        adjacentSquares.push(idNextString, idBelowString, idAboveString)
      } else if ((id % thisFinder.numOfColumns === 0)) { // check for last element in a row
        adjacentSquares.push(idPreviousString, idBelowString, idAboveString)
      } else {
        adjacentSquares.push(idPreviousString, idNextString, idBelowString, idAboveString)
      }
    }

    return adjacentSquares
  }

  // add class disabled to all squares that are not adjacent to any selected square
  disableNonAdjacentSquares() {
    const thisFinder = this;

    for (let element of thisFinder.allSquares) {
      const elementId = element.getAttribute('id');
      let isAdjacentToSelected = false;
      let isSelected = false;
      for (let selectedElement of thisFinder.selectedSquares) {
        if (selectedElement.adjacent.includes(elementId)) {
          isAdjacentToSelected = true;
        }
        if (selectedElement.squareId === elementId) {
          isSelected = true;
        }
        if (isAdjacentToSelected && isSelected) {
          break;
        }
      }
      if (!isAdjacentToSelected && !isSelected && !element.classList.contains(classNames.disabled)) {
        element.classList.add(classNames.disabled);
      } else if ((isAdjacentToSelected || isSelected) && element.classList.contains(classNames.disabled)) {
        element.classList.remove(classNames.disabled);
      }

      if (thisFinder.selectedSquares.length === 0 && element.classList.contains(classNames.disabled)) {
        element.classList.remove(classNames.disabled);
      }
    }

  }

  disableNonSelected() {
    const thisFinder = this;

    for (let square of thisFinder.allSquares) {
      if (!square.classList.contains(classNames.disabled) && !square.classList.contains(classNames.selected)) {
        square.classList.add(classNames.disabled)
      }
    }
  }


}

export default FinderGrid;