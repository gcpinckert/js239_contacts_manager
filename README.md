# JS239 Contact Manager App

Practice project for the JS239 take-home project assessment

## Contents

- [Notes on Demo and required functionality](#demo-and-required-functionality)
- [Basic Design Outline](#design-overview)

## Demo and Required Functionality

- Home page displays an add contact button, search bar, and list of contacts
  - If there are no contacts, a message saying "There are no contacts" is displayed with additional add contact button
- Each contact has a name, phone number, e-mail, and list of "tags" (i.e. "sales", "marketing", etc)
- Clicking on a tag shows only the contacts pertaining to that tag
- When displayed, each contact shows an edit button and delete button

### Adding a Contact

- We add a contact by clicking the "Add Contact" button
- This displays a form (`/#home` -> `/#contacts/new`, or do we want it to be single-page web app?)
- The form has the following fields
  - Full name
  - Email address
  - Telephone number
  - Drop down list of available tags to add to the contact
- The drop down list should have functionality to add a new tag if necessary (is this a different form that pops up?)
- We have button options to either submit the form, or cancel
- Submitting adds the new contact information to the API. Text fields should be automatically formatted appropriately (i.e. dashes inserted into phone numbers, lower case e-mails, capitalized names)
- Canceling brings us back to the home page

### Editing a Contact

- We edit a contact by clicking the "Edit Contact" button for an individual contact
- This displays a form (`/#home` -> `/#contacts/edit/{CONTACT_ID}`)
- The form has the following fields
  - Full name
  - Email address
  - Telephone number
- The original data is populated as the placeholder text for the input fields
- Same functionality for the drop down list as in "Adding a Contact" above?
- We have button options to either submit the form, or cancel
- Submitting adds the new contact information to the API. Text fields should be automatically formatted appropriately (i.e. dashes inserted into phone numbers, lower case e-mails, capitalized names)
- Canceling brings us back to the home page

### Deleting a Contact

- Contacts are deleted by clicking the "Delete Contact" button for an individual contact
- This displays a confirmation popup asking "Do you want to delete this contact?" and the user must click OK to proceed
- Once we click ok, the contact in question is deleted

### Search Bar

- Tying a value into the search bar limits the contacts displayed to those that match the given value
- If there are no matching values, a message is displayed saying "There are no contacts starting with {VALUE}".
- The value can be matched with either the first or last name of a contact

## Design Overview

- **Controller Interface**:
  - Uses `Model` to for CRUD actions upon contact/tag data
  - Receives data from `Model`, pass it to `View` for rendering
  - May be subdivided into specific types of controllers, i.e. `ContactController`, `TagController`, etc)
  - Data validation happens here?
- **Model Interface**:
  - Handles interactions with the API (i.e asynchronous AJAX calls, HTTP request/responses)
  - Passes data to `Controller` so it can interface with `View`
- **View Interface**:
  - Renders data for the user, i.e. `display*` methods
  - Receives data from `Controller`for rendering

![Front-End Components](./resources/JS230_contacts_manager_components.excalidraw.png)

![Basic Page Design](./resources/JS230_contacts_manager_index.excalidraw.png)

## To Do

- [x] Basic Page Setup
  - [x] HTML sections for header (add new contact, search bar), contacts, footer (?)
  - [x] Handlebars template for contact cards
  - [x] Hidden add/update contact form (some HTML input validation here)
- [ ] Basic `Controller` functionality
  - [x] When user clicks "Add new Contact", `View` displays the new contact form and hides contacts list
  - [x] When user submits new contact form, `Controller` collects and validates data
  - [x] If data is valid, we pass data to `Model` for async API call
  - [x] When response received, pass new data to `View` to re-render contact list
- [ ] Basic `Model` functionality
  - [x] Can fetch all contacts from API and return a JS object representing them to `Controller`
  - [x] Can return a single contact based on `id` and return a JS object representing this to `Controller`
  - [x] Filters contacts according to tag name
  - [x] Can issue POST request to Contacts Manager API to add a new contact
  - [ ] Can issue PUSH request to API to update contact information
  - [ ] Can issue DELETE request to API to remove a given contact based on id value
  - [ ] Handles any errors associated with any of the above requests
  - [x] Returns data in the form of a JS object for `Controller`
- [ ] Basic `View` functionality
  - [x] Can hide/display contacts list
  - [x] Can hide/display add new contacts form
  - [ ] Can hide/display individual contact cards
