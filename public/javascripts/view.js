const View = {

  contactsList: document.querySelector('section.contacts-list'),
  modalForm: document.querySelector('section.modal-form'),
  contactTemplate: Handlebars.compile(document.querySelector('script[type="text/x-handlebars"]').innerHTML),

  displayContactsList(contacts) {
    contacts.forEach(contact => {
      this.contactsList.innerHTML += this.contactTemplate(contact);
    });
  },

  displayNewContactForm() {
    document.querySelector('a.new-contact-btn').addEventListener('click', event => {
      event.preventDefault();
      this.contactsList.classList.add('hidden');
      this.modalForm.classList.remove('hidden');
    });
  },

  hideNewContactForm() {
    document.querySelector('a.close-icon').addEventListener('click', event => {
      event.preventDefault();
      this.modalForm.classList.add('hidden');
      this.contactsList.classList.remove('hidden');
    });
  },
}

export default View;