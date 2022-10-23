'use strict';

class View {

  constructor() {
    this.contactsList = document.querySelector('section.contacts-list');
    this.contactTemplate = Handlebars.compile(document.querySelector('script[type="text/x-handlebars"]').innerHTML);

    this.modalForm = document.querySelector('section.modal-form');
    this.newContactBtn = document.querySelector('a.new-contact-btn');
    this.closeIcon = document.querySelector('a.close-icon');
    this.newContactForm = document.querySelector('form.new-contact-form');
    this.newContactFormHeading = document.querySelector('form.new-contact-form h2');
    this.newContactFormId = document.getElementById('id');
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

  displayNewContactForm() {
    this.newContactFormHeading.textContent = 'Create Contact';
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
    this.newContactForm.reset();
    this.newContactFormId.value = '';
    this.modalForm.classList.add('hidden');
    this.contactsList.classList.remove('hidden');
  }

  bindSubmitNewContactHandler(handler) {
    this.newContactForm.addEventListener('submit', event => {
      event.preventDefault();
      let formData = new FormData(this.newContactForm);
      let editId = this.newContactFormId.value;
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
    this.newContactFormHeading.textContent = 'Edit Contact';
    
    let inputs = this.newContactForm.elements;

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