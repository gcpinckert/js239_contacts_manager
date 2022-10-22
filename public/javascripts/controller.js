import View from './view.js';
import Model from './model.js';

document.addEventListener('DOMContentLoaded', () => {
  View.displayNewContactForm();
  View.hideNewContactForm();

  Model.getContactsList()
    .then(data => {
      View.displayContactsList(data);
    })
    .catch(error => console.log(error));
});