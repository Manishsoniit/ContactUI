import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact, ContactService } from '../services/contact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule]
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = []; // To store filtered contacts
  contactForm: FormGroup;
  editMode: boolean = false;
  selectedContactId: number | null = null;
  searchText: string = ''; // Search input
  error: string = '';

  constructor(
    private contactService: ContactService,
    private formBuilder: FormBuilder
  ) {
    // Initialize the reactive form
    this.contactForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadContacts();
  }

  // Fetch all contacts
  loadContacts(): void {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.filteredContacts = data; // Initialize filtered list
      },
      error: (err) => (this.error = err.message),
    });
  }

  // Add or Update a contact
  saveContact(): void {
    if (this.contactForm.invalid) {
      return;
    }

    const contact: Contact = this.contactForm.value;

    if (this.editMode && this.selectedContactId !== null) {
      contact.id = this.selectedContactId;
      this.contactService.updateContact(contact).subscribe({
        next: () => {
          this.resetForm();
          this.loadContacts();
        },
        error: (err) => (this.error = err.message),
      });
    } else {
      this.contactService.addContact(contact).subscribe({
        next: () => {
          this.resetForm();
          this.loadContacts();
        },
        error: (err) => (this.error = err.message),
      });
    }
  }

  // Edit contact details
  editContact(contact: Contact): void {
    this.editMode = true;
    this.selectedContactId = contact.id;
    this.contactForm.patchValue(contact);
  }

  // Delete a contact
  deleteContact(id: number): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe({
        next: () => this.loadContacts(),
        error: (err) => (this.error = err.message),
      });
    }
  }

  // Reset form and toggle mode
  resetForm(): void {
    this.contactForm.reset();
    this.editMode = false;
    this.selectedContactId = null;
  }

  // Filter contacts based on search input
  onSearch(): void {
    const text = this.searchText.toLowerCase();
    this.filteredContacts = this.contacts.filter(
      (contact) =>
        contact.firstName.toLowerCase().includes(text) ||
        contact.lastName.toLowerCase().includes(text) ||
        contact.email.toLowerCase().includes(text)
    );
  }
}
