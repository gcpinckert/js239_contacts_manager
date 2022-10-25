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
    this.filterContactsBySearch = debounce(this.filterContactsBySearch.bind(this), 300);
    this.renderAllContacts();
    this.renderContactFormTags();

    // add event listeners
    this.view.bindAddNewContactHandler(this.modalFormView.displayNewContactForm.bind(this.modalFormView));
    this.modalFormView.bindCloseIconHandler(this.modalFormView.hideContactForm.bind(this.modalFormView));
    this.modalFormView.bindSubmitContactHandler(this.submitContactHandler.bind(this));
    this.view.bindDeleteBtnEditBtnHandler(this.deleteContactHandler.bind(this), this.editContactFormHandler.bind(this));
    this.view.bindFilterTagsHandler(this.filterContactsByTag.bind(this));
    this.view.bindSeeAllContactsHandler(this.renderAllContacts.bind(this));
    this.searchView.bindSearchHandler(this.filterContactsBySearch);
    
  }

  renderAllContacts() {
    this.model.getContactsList()
      .then(data => {
        this.view.displayContactsList(data);
        this.searchView.clearSearchTerm();
      })
      .catch(error => {
        console.log(error);
      });
  }

  submitContactHandler(formData, editId) {
    let data = this.processContactFormData(formData);

    if (editId) {
      this.model.editContact(editId, data)
        .then(data => {
          this.view.updateContactCard(data);
          this.modalFormView.hideContactForm();
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      this.model.addContact(data)
        .then(data => {
          this.view.addNewContactCard(data);
          this.modalFormView.hideContactForm();
        })
        .catch(error => {
          console.log(error)
        });
    }
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

  deleteContactHandler(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.model.deleteContact(id)
        .then(() => {
          return this.model.getContactsList();
        })
        .then(contacts => {
          this.view.clearContactsList();
          this.view.displayContactsList(contacts);
        })
        .catch(error => {
          console.log(error);
        });
    };
  }

  editContactFormHandler(id) {
    this.model.getContactById(id)
      .then(data => {
        this.modalFormView.displayEditContactForm(data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderContactFormTags() {
    this.model.getAllTags()
      .then(tags => {
        this.modalFormView.addContactFormTags(tags);
        this.modalFormView.bindShowNewTagInputHandler();
        this.modalFormView.bindAddNewTagHandler();
      });
  }

  filterContactsByTag(tag) {
    this.model.getContactsMatchingTag(tag)
      .then(contacts => {
        this.view.clearContactsList();
        this.view.displayContactsList(contacts);
        this.view.displayBanner(`Showing contacts with the tag "${tag}"`);
      });
  }

  filterContactsBySearch(searchTerm) {
    this.model.getContactsMatchingSearch(searchTerm)
      .then(contacts => {
        this.view.displayContactsList(contacts);

        if (contacts.length === 0) {
          this.view.displayBanner(`There are no contacts starting with "${searchTerm}"`);
        }
      })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new Controller(new Model(), new View(), new ModalFormView(), new SearchView());
});