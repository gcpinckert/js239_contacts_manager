'use strict';

const API_BASE_URL = 'http://localhost:3000/api';

class Model {
  constructor() {}

  async getContactsList() {
    let response = await fetch(API_BASE_URL + '/contacts');
    if (response.ok) {
      let data = await response.json();
      data.forEach(this.processTags);
      return data;
    } else {
      return Promise.reject('Contacts not found');
    }
  }

  processTags(contact) {
    if (contact.tags) {
      contact.tags = contact.tags.split(',');
    }
  }

  async getContactsMatchingTag(tag) {
    let contacts = await this.getContactsList();
    return contacts.filter(contact => {
      return contact.tags && contact.tags.includes(tag);
    });
  }

  async getContactById(id) {
    let response = await fetch(`${API_BASE_URL}/contacts/${id}`);
    if (response.ok) {
      let data = await response.json();
      this.processTags(data);
      return data;
    } else {
      return Promise.reject('Contact not found');
    }
  }

  async addContact(data) {
    let response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      let data = await response.json();
      this.processTags(data);
      return data;
    } else {
      return Promise.reject('Something went wrong');
    }
  }

  async deleteContact(id) {
    let response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return Promise.resolve(true);
    } else {
      return Promise.reject('Could not find contact');
    }
  }
}

export default Model;