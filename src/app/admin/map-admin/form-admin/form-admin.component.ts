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
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';


// Images slider
import { NgImageSliderModule, NgImageSliderComponent } from 'ng-image-slider';

// Component
import { DataService } from '../../../../services/data.service';
import { AcceptAddEventsComponent } from '../form-admin/accept-add-events/accept-add-events.component';
import { AcceptAddPointComponent } from '../form-admin/accept-add-point/accept-add-point.component';

// Import Server.
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-admin',
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
    MatTabsModule,
    MatDatepickerModule,

    NgImageSliderModule,

  ],
  providers: [HttpClient, provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './form-admin.component.html',
  styleUrl: './form-admin.component.scss'
})
export class FormAdminComponent {

  constructor(
    private fb: FormBuilder,
    private addPoints: FormBuilder,
    public DataService: DataService,
    public dialog: MatDialog, // Απαραίτητο για τη δημιουργία του πίνακα και των Popups.
    private http: HttpClient,
  ) { }


  categoriesTable: any = [ // Ο πίνακας των κατηγοριών.
    { name: 'Εκκλησία/Μοναστήρι', code: "Εκκλησία/Μοναστήρι", category: "Όνομα εκκλησίας/μοναστηριού" },
    { name: 'Μουσείο', code: "Μουσείο", category: "Όνομα μουσείου" },
    { name: 'Πολιτιστικός σύλλογος', code: "Πολιτιστικός σύλλογος", category: "Όνομα πολιτιστικού συλλόγου" },
    { name: 'Ιστορικό μνημείο', code: "Ιστορικό μνημείο", category: "Όνομα ιστορικού μνημείου" },
  ]
  selectedCategory: any; // Το value της επιλεγμένης κατηγορίας (π.χ. value = church -> Εκκλησία).
  disaledButtons = true;

  tableImages: any = []; // Ο πίνακας των εικόνων.
  idImages: number = 0; // Το Id των εικόνων.
  // ViewChild:
  @ViewChild('nav') slider!: NgImageSliderComponent; // Χρησιμοποιείται για την επίλυση του bug στο slider (τι να φαίνεται όταν προσθέτω και όταν αφαιρώ μια εικόνα).

  // tableImagesEvents: any = []; // Ο πίνακας των εικόνων των εκδηλώσεων.
  idImagesEvents: number = 0; // Το Id των εικόνων.
  // ViewChild:
  @ViewChild('navEvents') sliderEvents!: NgImageSliderComponent; // Χρησιμοποιείται για την επίλυση του bug στο slider (τι να φαίνεται όταν προσθέτω και όταν αφαιρώ μια εικόνα).


  // Τα controls των events (Controls).
  eventsControls!: FormGroup;

  // Τα controls των new point (Controls).
  newPointControls!: FormGroup;


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

  jsonValuesEvents = { // Το body που θα στέλνω στη βάση για εγγραφή νέας εκδήλωσης.
    title: null,
    date_from: null,
    date_to: null,
    lat: null,
    long: null,
    description: null,
    link: null,
  }

  jsonValuesAddPoints = { // Το body που θα στέλνω στη βάση για εγγραφή νέου σημείου.
    category: null,
    name: null,
    lat: null,
    long: null,
    description: null,
  }


  indexTabs: any = 0 // Το επιλεγμένο index στα Tabs.

  insertImagesEventsText = false; // Επισήμανση του *Εισαγωγή εικόνων στο uploadImagesEvents
  insertImagesAddPointText = false; // Επισήμανση του *Εισαγωγή εικόνων στο uploadImages

  ngOnInit(): void {


    // Δημιουργούμε το FormGroup μαζί με όλα τα child controls (Controls).
    this.eventsControls = this.fb.group({
      titleControlEvents: ['', Validators.required],
      dateFromControlEvents: [null, Validators.required],
      dateToControlEvents: [null, Validators.required],
      latControlEvents: [this.DataService.latitudeAdmin ?? null, Validators.required],
      longControlEvents: [this.DataService.longitudeAdmin ?? null, Validators.required],
      descriptionControlEvents: [''],
      linkControlEvents: ['']
    });

    /* 2. (Προαιρετικό) Αν θες να κάνεις subscribe σε αλλαγές: */
    this.eventsControls.valueChanges.subscribe(val => {
      // this.eventsControls.get("titleControlEvents")?.setValue(val);
      console.log('Τρέχουσες τιμές φόρμας', val);
    });

    // Δημιουργούμε το FormGroup μαζί με όλα τα child controls (Controls).
    this.newPointControls = this.addPoints.group({
      categoryControlAddPoint: [''],
      nameControlAddPoint: ['', Validators.required],
      latControlAddPoint: [{ value: this.DataService.latitudeAdmin ?? null, disabled: true }, Validators.required],
      longControlAddPoint: [{ value: this.DataService.longitudeAdmin ?? null, disabled: true }, Validators.required],
      descriptionControlAddPoint: [''],
    });


    console.log(this.eventsControls)
    this.DataService.tableAddImagesPointsAdmin = [];
    this.DataService.tableAddImagesEventsAdmin = [];


    // const url = 'https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Εκδηλώσεις/FeatureServer/0/query';

    // const params = {
    //   f: 'json',
    //   where: '1=1',          // Επιστρέφει όλες τις εγγραφές
    //   outFields: '*',        // Παίρνεις όλα τα πεδία
    //   returnGeometry: 'true' // Αν θες και γεωμετρία
    // };

    // this.http.get<any>(url, { params }).subscribe({
    //   next: res => {
    //     console.log('✅ Εγγραφές:', res.features);
    //     // π.χ. μπορείς να προσπελάσεις ένα πεδίο έτσι:
    //     // res.features.forEach(f => console.log(f.attributes.Title));
    //   },
    //   error: err => {
    //     console.error('❌ Σφάλμα στο query:', err);
    //   }
    // });



  }





  /** 4. Βοηθητικά getters για εύκολη πρόσβαση σε μεμονωμένα πεδία */
  get title() { return this.eventsControls.get('titleControlEvents'); }
  get dateFrom() { return this.eventsControls.get('dateFromControlEvents'); }
  // κ.ο.κ.




  changeCategory(event: any) {
    this.selectedCategory = event.value
    if (event.value == undefined) {
      this.disaledButtons = true;
    } else {
      this.disaledButtons = false;
    }

  }


  uploadImages(event: any) {
    // Απαραίτητα για να γίνει το Upload.
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
        this.DataService.tableAddImagesPointsAdmin.push({
          file: file,
          title: file.name,
          alt: file.name,
          thumbImage: reader.result,
          image: reader.result
        });
        this.idImages++;

        // Να δείχνει πάντα την τελευταία εικόνα
        if (this.slider) {
          this.slider.visiableImageIndex = this.DataService.tableAddImagesPointsAdmin.length - 1;
        }
      };
    });

    // Επαναφορά τιμής, ώστε να ξαναδιαλέξουμε τα ίδια αρχεία αν θέλουμε
    input.value = '';


  }

  removeImages(idImage: any) {

    // Διαγραφή εικόνας.
    this.DataService.tableAddImagesPointsAdmin = this.DataService.tableAddImagesPointsAdmin.filter((item: any) => item.index !== idImage);

    // Αν η εικόνα που φαίνεται στο slider, είναι πίο μπροστά σε θέση από την εικόνα που θα επιλεχθεί να αφαιρεθεί (Λύση bug).
    if (this.slider.visiableImageIndex > idImage) {
      // Να δείξει την προηγούμενη
      this.slider.visiableImageIndex = this.slider.visiableImageIndex - 1;
      // this.slider.prev();
    }

    // Αν η εικόνα που φαίνεται στο slider, είναι η τελευταία εικόνα σε θέση και επιλεχθεί να αφαιρεθεί αυτή (Λύση bug).
    if (this.slider.visiableImageIndex == this.DataService.tableAddImagesPointsAdmin.length) {
      // Να δείξει την προηγούμενη.
      this.slider.visiableImageIndex = this.slider.visiableImageIndex - 1;
      // this.slider.prev();
    }

  }



  uploadImagesEvents(event: any) {
    // Απαραίτητα για να γίνει το Upload.
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
        this.DataService.tableAddImagesEventsAdmin.push({
          file: file,
          title: file.name,
          alt: file.name,
          thumbImage: reader.result,
          image: reader.result
        });
        this.idImagesEvents++;

        // Να δείχνει πάντα την τελευταία εικόνα
        if (this.sliderEvents) {
          this.sliderEvents.visiableImageIndex = this.DataService.tableAddImagesEventsAdmin.length - 1;
        }
      };
    });

    // Επαναφορά τιμής, ώστε να ξαναδιαλέξουμε τα ίδια αρχεία αν θέλουμε
    input.value = '';


  }

  removeImagesEvents(idImage: any) {
    console.log(idImage)
    console.log(this.sliderEvents.visiableImageIndex)

    // Διαγραφή εικόνας.
    this.DataService.tableAddImagesEventsAdmin = this.DataService.tableAddImagesEventsAdmin.filter((item: any) => item.index !== idImage);

    // Αν η εικόνα που φαίνεται στο slider, είναι πίο μπροστά σε θέση από την εικόνα που θα επιλεχθεί να αφαιρεθεί (Λύση bug).
    if (this.sliderEvents.visiableImageIndex > idImage) {
      // Να δείξει την προηγούμενη
      this.sliderEvents.visiableImageIndex = this.sliderEvents.visiableImageIndex - 1;
      // this.sliderEvents.prev();
    }

    // Αν η εικόνα που φαίνεται στο sliderEvents, είναι η τελευταία εικόνα σε θέση και επιλεχθεί να αφαιρεθεί αυτή (Λύση bug).
    if (this.sliderEvents.visiableImageIndex == this.DataService.tableAddImagesEventsAdmin.length) {
      // Να δείξει την προηγούμενη.
      this.sliderEvents.visiableImageIndex = this.sliderEvents.visiableImageIndex - 1;
      // this.sliderEvents.prev();
    }

  }


  async addEvent() {

    // Pupup Event
    if (this.DataService.openEventPopup) {
      // Το τελικό body που θα στείλω στην βάση για εγγραφή νέας εκδήλωσης.
      this.jsonValuesEvents.title = this.eventsControls.controls["titleControlEvents"].value; // Title
      this.jsonValuesEvents.date_from = this.eventsControls.controls["dateFromControlEvents"].value; // Date from
      if (this.indexTabs == 0) { // Date to
        this.jsonValuesEvents.date_to = null;
        this.eventsControls.controls["dateToControlEvents"].setErrors(null); // setErrors, setValue sos ετσι αλλάζουε τιμές απο τα κοντρολς.
      } else {
        this.jsonValuesEvents.date_to = this.eventsControls.controls["dateToControlEvents"].value;
      }
      this.jsonValuesEvents.lat = this.eventsControls.controls["latControlEvents"].value; // Lat
      this.jsonValuesEvents.long = this.eventsControls.controls["longControlEvents"].value; // Long
      this.jsonValuesEvents.description = this.eventsControls.controls["descriptionControlEvents"].value; // Description
      this.jsonValuesEvents.link = this.eventsControls.controls["linkControlEvents"].value; // Link
      console.log(this.jsonValuesEvents)
      this.DataService.serviceJsonValuesEvents = this.jsonValuesEvents

      this.insertImagesEventsText = true; // Επισήμανση του *Εισαγωγή εικόνων στο uploadImagesEvents

      // Δείχνει τα require πεδία (μαζικά, όχι ένα ενα).
      if (!this.eventsControls.valid || this.DataService.tableAddImagesEventsAdmin.length == 0) { // Αν υπάρχουν errors.
        this.eventsControls.markAllAsTouched(); // Δείξε errors.

        this._snackBar.open( // Μύνημα errors.
          'Επιτρέπονται υποχρεωτικά πεδία',
          'Κλείσιμο',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          }
        );
      } else {
        this.openDialogAcceptEvents()

        // UPDATE ----- UPDATE ----- UPDATE
        // const update = [{
        //   attributes: {
        //     OBJECTID: 3, // Βάλε το σωστό ID της εγγραφής
        //     Title: 'Ενημερωμένος Τίτλος',
        //     Description: 'Νέα περιγραφή'
        //   }
        // }];

        // const updateBody = new URLSearchParams({
        //   f: 'json',
        //   updates: JSON.stringify(update)
        // });

        // this.http.post(
        //   'https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Εκδηλώσεις/FeatureServer/0/applyEdits',
        //   updateBody.toString(),
        //   { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) }
        // ).subscribe({
        //   next: res => console.log('✅ Ενημέρωση:', res),
        //   error: err => console.error('❌ Σφάλμα:', err)
        // });



        // DELETE ----- DELETE ----- DELETE
        // const deleteBody = new URLSearchParams({
        //   f: 'json',
        //   deletes: '4' // Αν θέλεις πολλαπλά: '123,124,125'
        // });

        // this.http.post(
        //   'https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Εκδηλώσεις/FeatureServer/0/applyEdits',
        //   deleteBody.toString(),
        //   { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) }
        // ).subscribe({
        //   next: res => console.log('🗑️ Διαγραφή:', res),
        //   error: err => console.error('❌ Σφάλμα:', err)
        // });
        await this.DataService.insertDataServer(); // Κάλεσμα δεδομένων.

      }

    }


    // Pupup Point
    if (!this.DataService.openEventPopup) {
      this.jsonValuesAddPoints.category = this.newPointControls.controls["categoryControlAddPoint"].value; // Category
      this.jsonValuesAddPoints.name = this.newPointControls.controls["nameControlAddPoint"].value; // Name
      this.jsonValuesAddPoints.lat = this.newPointControls.controls["latControlAddPoint"].value; // Lat
      this.jsonValuesAddPoints.long = this.newPointControls.controls["longControlAddPoint"].value; // Long
      this.jsonValuesAddPoints.description = this.newPointControls.controls["descriptionControlAddPoint"].value; // Description
      console.log(this.jsonValuesAddPoints)
      this.DataService.serviceJsonValuesPointsAdd = this.jsonValuesAddPoints

      this.insertImagesAddPointText = true; // Επισήμανση του *Εισαγωγή εικόνων στο uploadImages

      // Δείχνει τα require πεδία (μαζικά, όχι ένα ενα).
      if (!this.newPointControls.valid || this.DataService.tableAddImagesPointsAdmin.length == 0) { // Αν υπάρχουν errors.
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

  updateValuesFormEvents() {
    let valueTitle: any = this.eventsControls.controls["titleControlEvents"].value;
    this.eventsControls.get("titleControlEvents")?.setValue(valueTitle);

    let valueDateFrom: any = this.eventsControls.controls["dateFromControlEvents"].value;
    this.eventsControls.get("dateFromControlEvents")?.setValue(valueDateFrom);

    let valueDateTo: any = this.eventsControls.controls["dateToControlEvents"].value;
    this.eventsControls.get("dateToControlEvents")?.setValue(valueDateTo);

    let valueLat: any = this.eventsControls.controls["latControlEvents"].value;
    this.eventsControls.get("latControlEvents")?.setValue(valueLat);

    let valueLong: any = this.eventsControls.controls["longControlEvents"].value;
    this.eventsControls.get("longControlEvents")?.setValue(valueLong);

    let valueDescription: any = this.eventsControls.controls["descriptionControlEvents"].value;
    this.eventsControls.get("descriptionControlEvents")?.setValue(valueDescription);

    let valueLink: any = this.eventsControls.controls["linkControlEvents"].value;
    this.eventsControls.get("linkControlEvents")?.setValue(valueLink);

  }

  changeTabs(event: any) {
    // var table = [...this.DataService.tableAddImagesEventsAdmin]

    this.indexTabs = event.index // Το επιλεγμένο index στα Tabs.

    this.updateValuesFormEvents();
    // this.DataService.tableAddImagesEventsAdmin = [];
    // this.DataService.tableAddImagesEventsAdmin = table
    // this.slider.visiableImageIndex = this.slider.visiableImageIndex
  }

  openDialogAcceptEvents() {
    const ref = this.dialog.open(AcceptAddEventsComponent, {
      autoFocus: false,
      disableClose: true, // Δεν κλείνει όταν κάνεις κλικ εκτός
      // data: {
      //   selectedId: id
      // }

    });
  }

  openDialogAcceptPoint() {
    this.dialog.open(AcceptAddPointComponent, {
      autoFocus: false,
      disableClose: true, // Δεν κλείνει όταν κάνεις κλικ εκτός
      // data: {
      //   selectedId: id
      // }
    });
  }





}
