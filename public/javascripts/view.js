'use strict';

class View {

  constructor() {
    this.contactsList = document.querySelector('section.contacts-list');
    this.contactTemplate = Handlebars.compile(document.querySelector('script[type="text/x-handlebars"]').innerHTML);

    this.modalForm = document.querySelector('section.modal-form');
    this.newContactBtn = document.querySelector('a.new-contact-btn');
    this.closeIcon = document.querySelector('a.close-icon');
  }

  displayContactsList(contacts) {
    contacts.forEach(contact => {
      this.contactsList.innerHTML += this.contactTemplate(contact);
    });
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
}

export default View;