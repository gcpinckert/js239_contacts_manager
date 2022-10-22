'use strict';

import View from './view.js';
import Model from './model.js';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.renderAllContacts();

    // add event listeners
    this.view.bindAddNewContactHandler(this.view.displayNewContactForm);
    this.view.bindCloseIconHandler(this.view.hideNewContactForm);
  }

  renderAllContacts() {
    this.model.getContactsList()
      .then(data => {
        this.view.displayContactsList(data);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new Controller(new Model(), new View());

});