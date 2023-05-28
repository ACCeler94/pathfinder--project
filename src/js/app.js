import FinderGrid from "./components/FinderGrid/FinderGrid.js";
import { select, classNames } from "./settings.js";

const app = {

  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.navLinks);


    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if (page.id === idFromHash) {
        pageMatchingHash = page.id;
        break
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', (event) => {
        const clickedElement = event.currentTarget;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '')
        /* call activatePage method with that id */

        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;

      })
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching pages */

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id === pageId);
    }


  },







  initFinderGrid() {
    const thisApp = this;

    thisApp.FinderGrid = new FinderGrid()
  },

  init: function () {
    const thisApp = this;

    // event listener to look for url changes done manually in the browser
    window.addEventListener("hashchange", () => {
      app.initPages();
    });
    thisApp.initPages();
    thisApp.initFinderGrid();
  },
}

app.init();