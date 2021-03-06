import { Component, OnInit } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { ApiService } from '../shared/api.service';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  contacts: Contact[];

  constructor(public api: ApiService) { }

  ngOnInit(): void {
    this.api.get('contacts')
      .subscribe(data => this.contacts = data);

  }

  onContactDelete(contact: Contact) {
    this.api.delete(`contacts/${contact._id}`)
      .subscribe(() => {
        this.getContacts();
      });
  }

  getContacts() {
    this.api.get("contacts")
      .subscribe(contacts =>
        this.contacts = contacts);
  }

}
