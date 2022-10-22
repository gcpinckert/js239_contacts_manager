'use strict';

class View {

  constructor() {
    this.contactsList = document.querySelector('section.contacts-list');
    this.contactTemplate = Handlebars.compile(document.querySelector('script[type="text/x-handlebars"]').innerHTML);

    this.modalForm = document.querySelector('section.modal-form');
    this.newContactBtn = document.querySelector('a.new-contact-btn');
    this.closeIcon = document.querySelector('a.close-icon');
    this.newContactForm = document.querySelector('form.new-contact-form');
  }

  displayContactsList(contacts) {
    this.clearContactsList();
    contacts.forEach(contact => {
      this.addNewContactCard(contact);
    });
  }

  clearContactsList() {
    this.contactsList.innerHTML = '';
  }

  addNewContactCard(contact) {
    this.contactsList.innerHTML += this.contactTemplate(contact);
  }

  bindAddNewContactHandler(handler) {
    this.newContactBtn.addEventListener('click', event => {
      event.preventDefault();
      handler.call(this);
    });
  }

  displayNewContactForm() {
    this.contactsList.classList.add('hidden');
    this.modalForm.classList.remove('hidden');
  }

  bindCloseIconHandler(handler) {
    this.closeIcon.addEventListener('click', event => {
      event.preventDefault();
      handler.call(this);
    });
  }

  hideNewContactForm() {
    this.modalForm.classList.add('hidden');
    this.contactsList.classList.remove('hidden');
  }

  bindSubmitNewContactHandler(handler) {
    this.newContactForm.addEventListener('submit', event => {
      event.preventDefault();
      let formData = new FormData(this.newContactForm);
      handler(formData);
    });
  }
}

export default View;