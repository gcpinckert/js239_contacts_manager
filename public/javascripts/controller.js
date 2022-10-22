import View from './view.js';
import Model from './model.js';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.renderAllContacts();
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

  // filterContactsByTag() {
  //   app.model.getContactsMatchingTag(tag)
  //     .then(data => {app.view.displayContactsList(data)})
  //     .catch(error => {console.log(error)});
  // }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new Controller(new Model(), new View());

});