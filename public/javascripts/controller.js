'use strict';

import { View, ModalFormView, SearchView } from './view.js';
import Model from './model.js';
import debounce from './debounce.js';

class Controller {
  constructor(model, view, modalFormView, searchView) {
    this.model = model;
    this.view = view;
    this.modalFormView = modalFormView;
    this.searchView = searchView;
    this.filterContactsBySearch = debounce(this.filterContactsBySearch, 300);
    this.renderAllContacts();

    // add event listeners
    this.view.bindAddNewContactHandler(this.addNewContactHandler);
    this.modalFormView.bindCloseIconHandler(this.modalFormView.hideContactForm);
    this.modalFormView.bindSubmitContactHandler(this.submitContactHandler);
    this.view.bindDeleteBtnEditBtnHandler(this.deleteContactHandler, this.editContactFormHandler);
    this.view.bindFilterTagsHandler(this.filterContactsByTag);
    this.view.bindSeeAllContactsHandler(this.renderAllContacts);
    this.searchView.bindSearchHandler(this.filterContactsBySearch);
  }

  renderAllContacts = async () => {
    let contacts = await this.model.getContactsList();
    this.view.displayContactsList(contacts);
    this.searchView.clearSearchTerm();
  }

  addNewContactHandler = async () => {
    await this.addContactFormTags();
    this.modalFormView.displayNewContactForm();
  }

  submitContactHandler = async (formData, editId) => {
    let data = this.processContactFormData(formData);

    if (editId) {
      let updatedData = await this.model.editContact(editId, data);
      this.view.updateContactCard(updatedData);
    } else {
      let newData = await this.model.addContact(data);
      this.view.addNewContactCard(newData); 
    }

    this.modalFormView.hideContactForm();
  }

  processContactFormData(formData) {
    let data = {};

    for (let pair of formData.entries()) {
      data[pair[0]] = pair [1];
    }

    let tags = formData.getAll('tags');

    data.tags = tags.length === 0 ? null : tags.join(',');

    return data;
  }

  deleteContactHandler = async (id) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await this.model.deleteContact(id);
      this.view.removeContactCard(id);
    };
  }

  editContactFormHandler = async (id) => {
    await this.addContactFormTags();
    let contactData = await this.model.getContactById(id);
    this.modalFormView.displayEditContactForm(contactData);
  }

  addContactFormTags = async () => {
    let tags = await this.model.getAllTags();
    this.modalFormView.addContactFormTags(tags);
    
  }

  filterContactsByTag = async (tag) => {
    let filteredContacts = await this.model.getContactsMatchingTag(tag);
    this.view.clearContactsList();
    this.view.displayContactsList(filteredContacts);
    this.view.displayBanner(`Showing contacts with the tag "${tag}"`);
  }

  filterContactsBySearch = async (searchTerm) => {
    let matchingContacts = await this.model.getContactsMatchingSearch(searchTerm);
    this.view.displayContactsList(matchingContacts);

    if (matchingContacts.length === 0) {
      this.view.displayBanner(`There are no contacts starting with "${searchTerm}"`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new Controller(new Model(), new View(), new ModalFormView(), new SearchView());
});