'use strict';

class View {

  constructor() {
    this.contactsList = document.querySelector('section.contacts-list');
    this.contactTemplate = Handlebars.compile(document.querySelector('script[type="text/x-handlebars"]').innerHTML);

    this.modalForm = document.querySelector('section.modal-form');
    this.newContactBtn = document.querySelector('a.new-contact-btn');
    this.closeIcon = document.querySelector('a.close-icon');
    this.contactForm = document.querySelector('form.new-contact-form');
    this.contactFormHeading = document.querySelector('form.new-contact-form h2');
    this.contactFormId = document.getElementById('id');
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

  updateContactCard(contact) {
    let card = document.getElementById(`${contact.id}`);
    card.outerHTML = this.contactTemplate(contact);
  }

  bindAddNewContactHandler(handler) {
    this.newContactBtn.addEventListener('click', event => {
      event.preventDefault();
      handler.call(this);
    });
  }

  displayContactForm() {
    this.contactFormHeading.textContent = 'Create Contact';
    this.contactsList.classList.add('hidden');
    this.modalForm.classList.remove('hidden');
  }

  bindCloseIconHandler(handler) {
    this.closeIcon.addEventListener('click', event => {
      event.preventDefault();
      handler.call(this);
    });
  }

  hideContactForm() {
    this.contactForm.reset();
    this.contactFormId.value = '';
    this.modalForm.classList.add('hidden');
    this.contactsList.classList.remove('hidden');
  }

  bindSubmitContactHandler(handler) {
    this.contactForm.addEventListener('submit', event => {
      event.preventDefault();
      let formData = new FormData(this.contactForm);
      let editId = this.contactFormId.value;
      handler(formData, editId);
    });
  }

  bindDeleteBtnEditBtnHandler(deleteHandler, editHandler) {
    this.contactsList.addEventListener('click', event => {
      event.preventDefault();
      let target = event.target;
      if (target.classList.contains('delete-icon')) {
        deleteHandler(event.target.getAttribute('data-id'));
      } else if (target.classList.contains('edit-icon')) {
        editHandler(event.target.getAttribute('data-id'));
      }
    });
  }

  displayEditContactForm(contact) {
    this.contactFormHeading.textContent = 'Edit Contact';
    
    let inputs = this.contactForm.elements;

    for (let i = 0; i < inputs.length; i += 1) {
      let field = inputs[i];
      if (Object.keys(contact).includes(field.name)) {
        field.value = contact[field.name];
      }
    }

    this.contactsList.classList.add('hidden');
    this.modalForm.classList.remove('hidden');
  }
}

export default View;