'use strict';

import View from './view.js';
import Model from './model.js';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.renderAllContacts();
    this.renderContactFormTags();

    // add event listeners
    this.view.bindAddNewContactHandler(this.view.displayNewContactForm);
    this.view.bindCloseIconHandler(this.view.hideContactForm);
    this.view.bindSubmitContactHandler(this.submitContactHandler.bind(this));
    this.view.bindDeleteBtnEditBtnHandler(this.deleteContactHandler.bind(this), this.editContactFormHandler.bind(this));
    this.view.bindFilterTagsHandler(this.filterContactsByTag.bind(this));
    this.view.bindSeeAllContactsHandler(this.renderAllContacts.bind(this));
    
  }

  renderAllContacts() {
    this.model.getContactsList()
      .then(data => {
        this.view.displayContactsList(data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  submitContactHandler(formData, editId) {
    let data = {};
    
    for (let pair of formData.entries()) {
      data[pair[0]] = pair[1];
    }

    data.tags = formData.getAll('tags') ? formData.getAll('tags').join(',') : null;

    if (editId) {
      this.model.editContact(editId, data)
        .then(data => {
          this.view.updateContactCard(data);
          this.view.hideContactForm();
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      this.model.addContact(data)
        .then(data => {
          this.view.addNewContactCard(data);
          this.view.hideContactForm();
        })
        .catch(error => {
          console.log(error)
        });
    }
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
        this.view.displayEditContactForm(data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderContactFormTags() {
    this.model.getAllTags()
      .then(tags => {
        this.view.addContactFormTags(tags);
        this.view.bindShowNewTagInputHandler();
        this.view.bindAddNewTagHandler();
      });
  }

  filterContactsByTag(tag) {
    this.model.getContactsMatchingTag(tag)
      .then(contacts => {
        this.view.clearContactsList();
        this.view.displayContactsList(contacts);
        this.view.displayBanner(`Showing contacts with the tag ${tag}`);
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new Controller(new Model(), new View());
});