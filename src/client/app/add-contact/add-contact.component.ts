import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Contact } from '../shared/contact.model';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {

  form: FormGroup;

  loading: Boolean = false;
  newContact: Contact;

  constructor(private formBuilder: FormBuilder, public api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[\\w\\-\\s\\/]+')])),
      lastName: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[\\w\\-\\s\\/]+')])),
      address: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('[\\w\\-\\s\\/\\#]+')])),
      areaCode: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('^[(]{1}[0-9]{1,3}[)]{1}$')])),
      prefix: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{3}$')])),
      lineNumber: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{4}$')])),
      photoUrl: this.formBuilder.control('', Validators.compose([Validators.required, Validators.pattern('(http(s?):)([/|.|\\w|\\s|-])*\.(?:jpg|gif|png)')]))
    });
  }

  onSubmit(formData) {

    this.loading = true;

    const contact: Contact = {
      _id: null,
      name: `${formData.firstName} ${formData.lastName}`,
      address: formData.address,
      phone: `${formData.areaCode} ${formData.prefix}-${formData.lineNumber}`,
      photoUrl: formData.photoUrl
    };

    this.api.post('contacts', contact)
      .subscribe((data) => {
        this.form.reset();
        this.loading = false;
        this.newContact = data;
      });
  }

  cancel() {
    // Simply navigate back to Contacts view
    this.router.navigate(['/contacts']);
  }

}
