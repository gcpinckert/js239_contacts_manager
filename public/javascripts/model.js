let Model = {
  async getContactsList() {
    let response = await fetch('http://localhost:3000/api/contacts');
    if (response.ok) {
      let data = await response.json();
      this.processTags(data);
      return data;
    } else {
      return Promise.reject('Contacts not found');
    }
  },

  processTags(data) {
    data.forEach(contact => {
      if (contact.tags) {
        contact.tags = contact.tags.split(',');
      }
    });
  },
}

export default Model;