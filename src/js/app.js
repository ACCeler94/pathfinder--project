import FinderGrid from "./components/FinderGrid/FinderGrid.js";

const app = {
  init: function () {
    const thisApp = this;

    thisApp.initFinderGrid();
  },

  initFinderGrid() {
    const thisApp = this;

    thisApp.FinderGrid = new FinderGrid()
  }
}

app.init();