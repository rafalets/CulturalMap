// Import angular.
import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import material angular.
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


// Images slider
import { NgImageSliderModule, NgImageSliderComponent } from 'ng-image-slider';
import { DataService } from '../../../../services/data.service';

// Component
import { AcceptAddPointComponent } from '../form/accept-add-point/accept-add-point.component';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,

    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,

    NgImageSliderModule,

  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  constructor(
    public DataService: DataService,
    private addPoints: FormBuilder,
    public dialog: MatDialog, // Απαραίτητο για τη δημιουργία του πίνακα και των Popups.
  ) { }

  // Μεταβλητές:
  selectedCategory: any; // Το value της επιλεγμένης κατηγορίας (π.χ. value = church -> Εκκλησία).
  disaledButtons = true;
  idImages: number = 0; // Το Id των εικόνων.
  insertImagesAddPointText = false; // Επισήμανση του *Εισαγωγή εικόνων στο uploadImages


  // Πίνακες:
  categoriesTable: any = [ // Ο πίνακας των κατηγοριών.
    { name: 'Εκκλησία/Μοναστήρι', code: "Εκκλησία/Μοναστήρι", category: "Όνομα εκκλησίας/μοναστηριού" },
    { name: 'Μουσείο', code: "Μουσείο", category: "Όνομα μουσείου" },
    { name: 'Πολιτιστικός σύλλογος', code: "Πολιτιστικός σύλλογος", category: "Όνομα πολιτιστικού συλλόγου" },
    { name: 'Ιστορικό μνημείο', code: "Ιστορικό μνημείο", category: "Όνομα ιστορικού μνημείου" },
  ]


  jsonValuesAddPoints = { // Το body που θα στέλνω στη βάση για εγγραφή νέου σημείου.
    category: null,
    name: null,
    lat: null,
    long: null,
    description: null,
  }

  // Τα controls των new point (Controls).
  newPointControls!: FormGroup;

  // ViewChild:
  @ViewChild('nav') slider!: NgImageSliderComponent; // Χρησιμοποιείται για την επίλυση του bug στο slider (τι να φαίνεται όταν προσθέτω και όταν αφαιρώ μια εικόνα).

  // Ιmage slider:
  imageSize = { width: '100%', height: '100%' }
  infinite = false
  imagePopup = true
  animationSpeed = 0.3
  slideImage = 1
  manageImageRatio = true
  autoSlide = 0
  showArrow = true
  arrowKeyMove = true
  videoAutoPlay = false
  showVideoControls = true
  direction = 'ltr'
  lazyLoading = false
  defaultActiveImage = 0


  private _snackBar = inject(MatSnackBar) // Γιατί private και γιατί inject???


  ngOnInit(): void {

    // Δημιουργούμε το FormGroup μαζί με όλα τα child controls (Controls).
    this.newPointControls = this.addPoints.group({
      categoryControlAddPoint: [''],
      nameControlAddPoint: ['', Validators.required],
      latControlAddPoint: [{ value: this.DataService.latitude ?? null, disabled: true }, Validators.required],
      longControlAddPoint: [{ value: this.DataService.longitude ?? null, disabled: true }, Validators.required],
      descriptionControlAddPoint: [''],
    });

    this.DataService.tableAddImagesPointsUser = [];
  }


  changeCategory(event: any) {
    this.selectedCategory = event.value
    if (event.value == undefined) {
      this.disaledButtons = true;
    } else {
      this.disaledButtons = false;
    }
  }

  uploadImages(event: any) {

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const allowedTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/jpg'];

    // Για κάθε επιλεγμένο αρχείο
    Array.from(input.files).forEach((file: File) => {
      // Έλεγχος τύπου
      if (allowedTypes.indexOf(file.type) === -1) {
        this._snackBar.open(
          'Επιτρέπονται: .jpeg, .jpg, .png, .gif',
          'Κλείσιμο',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          }
        );
        return; // παραλείπεις αυτό το αρχείο
      }

      // Φόρτωση και push στο πίνακα
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.DataService.tableAddImagesPointsUser.push({
          file: file,
          title: file.name,
          alt: file.name,
          thumbImage: reader.result,
          image: reader.result
        });
        this.idImages++;

        // Να δείχνει πάντα την τελευταία εικόνα
        if (this.slider) {
          this.slider.visiableImageIndex = this.DataService.tableAddImagesPointsUser.length - 1;
        }
      };
    });

    // Επαναφορά τιμής, ώστε να ξαναδιαλέξουμε τα ίδια αρχεία αν θέλουμε
    input.value = '';


  }

  removeImages(idImage: any) {

    // Διαγραφή εικόνας.
    this.DataService.tableAddImagesPointsUser = this.DataService.tableAddImagesPointsUser.filter((item: any) => item.index !== idImage);

    // Αν η εικόνα που φαίνεται στο slider, είναι πίο μπροστά σε θέση από την εικόνα που θα επιλεχθεί να αφαιρεθεί (Λύση bug).
    if (this.slider.visiableImageIndex > idImage) {
      // Να δείξει την προηγούμενη
      this.slider.visiableImageIndex = this.slider.visiableImageIndex - 1;
      // this.slider.prev();
    }

    // Αν η εικόνα που φαίνεται στο slider, είναι η τελευταία εικόνα σε θέση και επιλεχθεί να αφαιρεθεί αυτή (Λύση bug).
    if (this.slider.visiableImageIndex == this.DataService.tableAddImagesPointsUser.length) {
      // Να δείξει την προηγούμενη.
      this.slider.visiableImageIndex = this.slider.visiableImageIndex - 1;
      // this.slider.prev();
    }

  }

  addEvent() {
    this.insertImagesAddPointText = true; // Επισήμανση του *Εισαγωγή εικόνων στο uploadImages

    // Pupup Event
    if (!this.DataService.openEventPopup) {
      // Το τελικό body που θα στείλω στην βάση για εγγραφή νέας εκδήλωσης.
      this.jsonValuesAddPoints.category = this.newPointControls.controls["categoryControlAddPoint"].value; // Category
      this.jsonValuesAddPoints.name = this.newPointControls.controls["nameControlAddPoint"].value; // Name
      this.jsonValuesAddPoints.lat = this.newPointControls.controls["latControlAddPoint"].value; // Lat
      this.jsonValuesAddPoints.long = this.newPointControls.controls["longControlAddPoint"].value; // Long
      this.jsonValuesAddPoints.description = this.newPointControls.controls["descriptionControlAddPoint"].value; // Description
      console.log(this.jsonValuesAddPoints)
      this.DataService.serviceJsonValuesPointsAddUser = this.jsonValuesAddPoints


      this.insertImagesAddPointText = true; // Επισήμανση του *Εισαγωγή εικόνων στο uploadImages

      // Δείχνει τα require πεδία (μαζικά, όχι ένα ενα).
      if (!this.newPointControls.valid || this.DataService.tableAddImagesPointsUser.length == 0) { // Αν υπάρχουν errors.
        this.newPointControls.markAllAsTouched(); // Δείξε errors.

        this._snackBar.open( // Μύνημα errors.
          'Υπάρχουν υποχρεωτικά πεδία',
          'Κλείσιμο',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          }
        );
      } else {
        this.openDialogAcceptPoint()
      }
    }
  }

  openDialogAcceptPoint() {
    this.dialog.open(AcceptAddPointComponent, {
      autoFocus: false,
      disableClose: false, // Κλείνει όταν κάνεις κλικ εκτός
      // data: {
      //   selectedId: id
      // }
    });
  }


}
