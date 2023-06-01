export const select = {
  containerOf: {
    grid: '.finder__grid',
    pages: '#pages',
  },
  navLinks: '.nav-link',
  square: '.square',
  finderText: '.finder__text',
  finderButton: '.btn-finder',
}

// grid size - the number of squares per row/column - requires second change in _variables.scss
export const settings = {
  FinderGrid: {
    FinderGridColumns: 10,
    FinderGridRows: 10,
    step1Message: 'DRAW ROUTES',
    step1ButtonText: 'FINISH DRAWING',
    step1ButtonFail: 'SELECT MORE SQUARES',
    step2Message: 'PICK START AND FINISH',
    step2ButtonText: 'COMPUTE',
    step2ButtonFail: ' PICK START AND END',
    step3Message: 'THE BEST ROUTE IS...',
    step3ButtonText: 'START AGAIN',
  }
}

export const classNames = {
  pages: {
    active: 'active'
  },
  solution: 'solution',
  selected: 'selected',
  disabled: 'disabled',
  selectable: 'selectable',
  start: 'start',
  end: 'end',
  square: 'square',
}