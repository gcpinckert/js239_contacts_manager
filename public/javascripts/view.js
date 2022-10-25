'use strict';

class View {

  constructor() {
    this.contactsList = document.querySelector('section.contacts-list');
    this.contactTemplate = Handlebars.compile(document.getElementById('contact-card-template').innerHTML);
    this.newContactBtn = document.querySelector('nav .banner-btn');

    this.banner = document.querySelector('div.banner');
    this.bannerText = document.querySelector('p#banner-text');
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
      handler();
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

  bindFilterTagsHandler(handler) {
    this.contactsList.addEventListener('click', event => {
      if (event.target.tagName === 'LI' && event.target.classList.contains('tag')) {
        handler(event.target.textContent);
      }
    });
  }

  displayBanner(text) {
    this.bannerText.textContent = text;
    this.banner.classList.remove('hidden');
  }

  hideBanner() {
    this.banner.classList.add('hidden');
  }

  bindSeeAllContactsHandler(handler) {
    document.querySelector('div.banner a').addEventListener('click', event => {
      event.preventDefault();

      this.hideBanner();
      handler();
    })
  }
}

class ModalFormView extends View {
  constructor() {
    super();

    this.modalForm = document.querySelector('section.modal-form');
    this.closeIcon = document.querySelector('a.close-icon');
    this.contactForm = document.querySelector('form.new-contact-form');
    this.contactFormHeading = document.querySelector('form.new-contact-form h2');
    this.contactFormId = document.getElementById('id');
    this.contactFormTagsSelect = Handlebars.compile(document.getElementById('tags-template').innerHTML);
    this.newTagsInput = document.getElementById('new-tags-input');
  }

  addContactFormTags(tags) {
    let tagsSelect = document.getElementById('select-tags');
    tagsSelect.innerHTML = this.contactFormTagsSelect(tags);
  }

  displayNewContactForm() {
    this.contactFormHeading.textContent = 'Create Contact';
    this.contactsList.classList.add('hidden');
    this.modalForm.classList.remove('hidden');
  }

  displayEditContactForm(contact) {
    this.contactFormHeading.textContent = 'Edit Contact';
    
    this.addContactDetailsToForm(contact);

    this.contactsList.classList.add('hidden');
    this.modalForm.classList.remove('hidden');
  }

  addContactDetailsToForm(contact) {
    let inputs = this.contactForm.elements;

    for (let i = 0; i < inputs.length; i += 1) {
      let field = inputs[i];
      if (Object.keys(contact).includes(field.name)) {
        field.value = contact[field.name];
      }
    }

    // pre-select multiple tags, if any
    if (contact.tags) {
      let selectTags = document.querySelector('select#tags');
      let selectTagOptions = Array.from(selectTags.options);
      selectTagOptions.splice(0, 1); // remove "Please select tags" option
      selectTagOptions.splice(selectTagOptions.length - 1, 1); // remove "+ Add New Tag" option

      selectTagOptions.forEach(tagOption => {
        if (contact.tags.includes(tagOption.value)) {
          tagOption.selected = true;
        }
      });
    }
  }

  bindCloseIconHandler(handler) {
    this.closeIcon.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  hideContactForm() {
    this.contactForm.reset();
    this.contactFormId.value = '';

    this.modalForm.classList.add('hidden');
    this.newTagsInput.classList.add('super_hidden');

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

  bindShowNewTagInputHandler() {
    document.getElementById('add-new-tag').addEventListener('click', event => {
      event.preventDefault();

      this.newTagsInput.classList.remove('super_hidden');
    });
  }

  bindAddNewTagHandler() {
    let addNewTagButton = document.querySelector('div#new-tags-input button');
    let addNewTagOption = document.getElementById('add-new-tag');
    let newTagName = document.getElementById('new_tag');
    let tagsSelect = document.getElementById('tags');

    addNewTagButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();

      let newTag = document.createElement('option');
      newTag.value = newTagName.value;
      newTag.textContent = newTagName.value;
      tagsSelect.insertBefore(newTag, addNewTagOption);

      this.newTagsInput.classList.add('super_hidden');
      newTagName.value = '';
    });
  }
}

class SearchView extends View {
  constructor() {
    super();

    this.search = document.getElementById('search');
  }

  bindSearchHandler(handler) {
    this.search.addEventListener('input', event => {
      // hide banner if user backspaces to no search term
      if (this.search.value === '') {
        this.hideBanner();
      }

      handler(this.search.value);
    });
  }

  clearSearchTerm() {
    this.search.value = '';
  }
}

export { View, ModalFormView, SearchView};