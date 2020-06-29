import { Component, OnInit, Input, HostBinding, EventEmitter, Output } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { from } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @Input() contact: Contact;
  @Output() delete = new EventEmitter();

  @HostBinding('class') columnClass = 'four wide column';

  constructor() { }

  ngOnInit(): void {
  }

  onDelete() {
    this.delete.emit(this.contact);
  }

}
