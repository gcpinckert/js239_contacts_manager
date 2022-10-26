'use strict';

class View {

  constructor() {
    this.contactsList = document.querySelector('section.contacts-list');
    this.contactTemplate = Handlebars.compile(document.getElementById('contact-card-template').innerHTML);
    this.newContactBtn = document.querySelector('nav .banner-btn');

    this.banner = document.querySelector('div.banner');
    this.bannerText = document.querySelector('div#banner-text');
    this.bannerTextTemplate = Handlebars.compile(document.getElementById('banner-text-template').innerHTML);
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

  allContactsDeleted() {
    return this.contactsList.childElementCount === 0;
  }

  addNewContactCard(contact) {
    this.contactsList.innerHTML += this.contactTemplate(contact);
  }

  updateContactCard(contact) {
    let card = document.getElementById(`${contact.id}`);
    card.outerHTML = this.contactTemplate(contact);
  }

  removeContactCard(id) {
    let card = document.getElementById(id);
    card.remove();

    if (this.allContactsDeleted()) {
      this.displayBanner({
        message: 'There are no contacts. Would you like to add one?'
      });
    }
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
        deleteHandler(target.getAttribute('data-id'));
      } else if (target.classList.contains('edit-icon')) {
        editHandler(target.getAttribute('data-id'));
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

  displayBanner(message) {
    this.bannerText.innerHTML = this.bannerTextTemplate(message);
    this.banner.classList.remove('hidden');

    if (message.highlight === undefined) {
      document.querySelector('div.banner a').classList.add('super_hidden');
    }
  }

  hideBanner() {
    this.bannerText.innerHTML = '';
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
    this.notification = document.createElement('p');
    this.contactForm = document.querySelector('form.new-contact-form');
    this.contactFormHeading = document.querySelector('form.new-contact-form h2');
    this.contactFormId = document.getElementById('id');
    this.contactFormTagsSelectTemplate = Handlebars.compile(document.getElementById('tags-template').innerHTML);
    this.tagsSelectContainer = document.getElementById('select-tags');
    this.newTagsInput = document.getElementById('new-tags-input');
  }

  displayNewContactForm = () => {
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

    // add original contact details as values to form inputs
    for (let i = 0; i < inputs.length; i += 1) {
      let field = inputs[i];
      if (Object.keys(contact).includes(field.name)) {
        field.value = contact[field.name];
      }
    }

    // add trailing comma to tags if there isn't one
    let tagsInput = document.querySelector('#tags');
    if (tagsInput.value && !tagsInput.value.endsWith(',')) {
      tagsInput.value += ',';
    }
  }

  bindCloseIconHandler(handler) {
    this.closeIcon.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  hideContactForm = () => {
    this.contactForm.reset();
    this.contactFormId.value = '';
    this.removeTags();
    this.removeNotification();

    this.modalForm.classList.add('hidden');
    this.newTagsInput.classList.add('super_hidden');

    this.contactsList.classList.remove('hidden');
  }

  addContactFormTags = (tags) => {
    this.tagsSelectContainer.innerHTML = this.contactFormTagsSelectTemplate(tags);
    this.bindSelectTagsHandler(this.showTagOptions);
    this.bindAddTagsHandler(this.selectTagHandler, this.showCreateNewTagOption, this.clearTagsHandler);
  }

  removeTags = () => {
    this.tagsSelectContainer.innerHTML = '';
    this.tagsSelectContainer.classList.add('super_hidden');
  }

  bindSubmitContactHandler(handler) {
    this.contactForm.addEventListener('submit', event => {
      event.preventDefault();
      let formData = new FormData(this.contactForm);
      let editId = this.contactFormId.value;
      handler(formData, editId);
    });
  }

  bindSelectTagsHandler(handler) {
    document.querySelector('dt.select-tags-btn').addEventListener('click', event => {

      handler();
    });
  }

  showTagOptions = () => {
    this.tagsSelectContainer.classList.remove('super_hidden');
  }

  bindAddTagsHandler(selectTagHandler, createTagHandler, clearTagsHandler) {
    document.querySelector('ul.tag-options').addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      let target = event.target;

      if (target.tagName === 'LI' && target.textContent === '+ Add new tag') {
        createTagHandler();
      } else if (target.tagName === 'LI' && target.textContent === '- Clear tags') {
        clearTagsHandler();
      } else {
        selectTagHandler(target);
      }
    });
  }

  bindCreateNewTagHandler = (handler) => {
    document.querySelector('div#new-tags-input button').addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();

      handler();
    })
  }

  selectTagHandler = (target) => {
    if (target.tagName !== 'LI') {
      return;
    }

    let tagsInput = document.getElementById('tags');
    let regex = new RegExp(`${target.textContent},*`);

    if (regex.test(tagsInput.value)) {
      tagsInput.value = tagsInput.value.replace(regex, '');
    } else {
      tagsInput.value += `${target.textContent},`;
    }
  }

  showCreateNewTagOption = () => {
    this.newTagsInput.classList.remove('super_hidden');
  }

  createNewTagHandler = () => {
    this.removeNotification();
    let newTagInput = document.getElementById('new_tag');
    let tagsInput = document.getElementById('tags');
    let tagsList = document.querySelector('ul.tag-options');
    let newTag = document.createElement('li');

    if (this.validTag(newTagInput.value)) {
      newTag.textContent = newTagInput.value;
      tagsInput.value += `${newTagInput.value},`;
      tagsList.insertBefore(newTag, document.getElementById('add-new-tag'));

      this.newTagsInput.classList.add('super_hidden');
      newTagInput.value = '';
    } else {
      this.displayNotification('Tags can only contain alphabetical characters')
    }
  }

  validTag(tag) {
    return /^[a-z]+$/i.test(tag);
  }

  clearTagsHandler = () => {
    document.getElementById('tags').value = '';
  }

  bindEscKeyHandler = () => {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.hideContactForm();
      }
    });
  }

  displayNotification(message) {
    this.notification.textContent = message;
    this.notification.classList.add('notification');
    document.querySelector('form fieldset').insertAdjacentElement('afterbegin', this.notification);
  }

  removeNotification() {
    this.notification.remove();
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