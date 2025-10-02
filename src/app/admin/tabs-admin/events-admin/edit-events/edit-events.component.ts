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
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';


// Images slider
import { NgImageSliderModule, NgImageSliderComponent } from 'ng-image-slider';

// Component
import { DataService } from '../../../../../services/data.service';
import { UpdateEditComponent } from '../edit-events/update-edit/update-edit.component'

@Component({
  selector: 'app-edit-events',
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
    MatNativeDateModule,

    NgImageSliderModule,
  ],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './edit-events.component.html',
  styleUrl: './edit-events.component.scss'
})
export class EditEventsComponent {

  constructor(
    private addEvents: FormBuilder,
    public DataService: DataService,
    public dialog: MatDialog, // Απαραίτητο για τη δημιουργία του πίνακα και των Popups.
  ) { }

  disaledButtons = true;

  tableImagesEvents: any = []; // Ο πίνακας των εικόνων των εκδηλώσεων.
  idImagesEvents: number = 0; // Το Id των εικόνων.
  // ViewChild:
  @ViewChild('navEvents') sliderEvents!: NgImageSliderComponent; // Χρησιμοποιείται για την επίλυση του bug στο slider (τι να φαίνεται όταν προσθέτω και όταν αφαιρώ μια εικόνα).

  // Τα controls των events (Controls).
  eventsControls!: FormGroup;

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

  indexTabs: any = 0 // Το επιλεγμένο index στα Tabs.

  insertImagesEventsText = false; // Επισήμανση του *Εισαγωγή εικόνων στο uploadImagesEvents

  eventsControlsHelp: any; // Αποθηκεύει τα αρχικά δεδομένα ώστε να γίνεται σύγκριση με τα νέα.
  // editButtonEnabled: boolean = false; // Αν υπάρχει αλλαγή στα δεδομένα, το button τροποποίηση γίνεται Enable.

  @ViewChild('tabsStep', { static: false }) tabsStep!: MatTabGroup;

  comparableImagesEvents: any = [];

  ngOnInit(): void {

    this.DataService.tableEditAddImagesEventsAdmin = []

    this.DataService.dataServerAdmin$.subscribe(data => {
      console.log(data)

      for (let i in data) {
        if (data[i].name == "Events") {
          for (let j in data[i].data) {
            if (data[i].data[j].attributes.OBJECTID == this.DataService.editObjectId) {

              // Τροποποίηση και προσαρμογή ημερομηνίας Από.
              const inputDateFrom = data[i].data[j].attributes.date_from;
              var dateFrom: any;
              if (inputDateFrom != null) {
                const [dayFrom, monthFrom, yearFrom] = inputDateFrom.split('/').map(Number);
                dateFrom = new Date(yearFrom, monthFrom - 1, dayFrom);
              } else {
                dateFrom = "";
              }

              // Τροποποίηση και προσαρμογή ημερομηνίας Εώς.
              const inputDateTo = data[i].data[j].attributes.date_to;
              console.log(inputDateTo)
              var dateTo: any;
              if (inputDateTo != null) {
                const [dayTo, monthTo, yearTo] = inputDateTo.split('/').map(Number);
                dateTo = new Date(yearTo, monthTo - 1, dayTo);
              } else {
                dateTo = "";
              }

              // Δημιουργούμε το FormGroup μαζί με όλα τα child controls (Controls).
              if (dateTo != "") {
                this.eventsControls = this.addEvents.group({
                  titleControlEvents: [data[i].data[j].attributes.title, Validators.required],
                  dateFromControlEvents: [dateFrom, Validators.required],
                  dateToControlEvents: [dateTo, Validators.required],
                  latControlEvents: [data[i].data[j].geometry.y.toFixed(5) ?? null, Validators.required],
                  longControlEvents: [data[i].data[j].geometry.x.toFixed(5) ?? null, Validators.required],
                  descriptionControlEvents: [data[i].data[j].attributes.description],
                  linkControlEvents: [data[i].data[j].attributes.link]
                });
              } else {
                this.eventsControls = this.addEvents.group({
                  titleControlEvents: [data[i].data[j].attributes.title, Validators.required],
                  dateFromControlEvents: [dateFrom, Validators.required],
                  dateToControlEvents: [dateTo],
                  latControlEvents: [data[i].data[j].geometry.y.toFixed(5) ?? null, Validators.required],
                  longControlEvents: [data[i].data[j].geometry.x.toFixed(5) ?? null, Validators.required],
                  descriptionControlEvents: [data[i].data[j].attributes.description],
                  linkControlEvents: [data[i].data[j].attributes.link]
                });
              }

              for (let attachments of data[i].data[j].attachments) {
                console.log(attachments)
                this.DataService.tableEditAddImagesEventsAdmin.push(attachments)
              }


            }
          }
        }
      }
    })

    // Αποθηκεύεις το αρχικό value (για να γίνεται σύγκριση)
    this.eventsControlsHelp = this.eventsControls.getRawValue();

    // // Κάνεις subscribe για αλλαγές (σύγκριση τυχών αλλαγών)
    // this.eventsControls.valueChanges.subscribe(currentValue => {
    //   const hasChanged = JSON.stringify(currentValue) !== JSON.stringify(this.eventsControlsHelp);
    //   // this.editButtonEnabled = hasChanged && this.eventsControls.valid;
    //   this.editButtonEnabled = hasChanged;

    // });




  }


  async ngAfterViewInit() {
    // Αν υπάρχει Date to, να ανοίγει στην δεύτερη καρτέλα.
    let valueDateTo: any = this.eventsControls.controls["dateToControlEvents"].value;
    if (valueDateTo != null && valueDateTo != "") {
      this.tabsStep.selectedIndex = 1;
    }

    this.comparableImagesEvents = [...this.DataService.tableEditAddImagesEventsAdmin];
    this.tableImagesEvents = [...this.DataService.tableEditAddImagesEventsAdmin];
    console.log(this.comparableImagesEvents)
  }

  async changeTabs(event: any) {
    this.indexTabs = event.index // Το επιλεγμένο index στα Tabs.

    // Το ημερομηνία εώς να είναι πάντα υποχρεωτικό στο tab -> 1
    if (event.index == 1) {
      this.eventsControls.get("dateToControlEvents")
        ?.setValidators([Validators.required]);
    } else {
      this.eventsControls.get("dateToControlEvents")
        ?.clearValidators();
    }


    await this.updateValuesFormEvents();
    // this.localImages = [...this.DataService.tableEditAddImagesEventsAdmin];
    // this.tableImagesEvents = [...this.DataService.tableEditAddImagesEventsAdmin];

    console.log(event.index)



  }

  async updateValuesFormEvents() {

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
          'Allowed: .jpeg, .jpg, .png, .gif',
          'Close',
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
        this.tableImagesEvents.push({
          file: file,
          attachmentId: null,
          title: file.name,
          alt: file.name,
          thumbImage: reader.result,
          image: reader.result
        });
        this.idImagesEvents++;

        // Να δείχνει πάντα την τελευταία εικόνα
        console.log(this.sliderEvents)

        console.log(this.sliderEvents.visiableImageIndex)
        console.log(this.tableImagesEvents.length - 1)

        if (this.sliderEvents) {
          this.sliderEvents.visiableImageIndex = this.tableImagesEvents.length - 1;
        }
      };
    });

    // Επαναφορά τιμής, ώστε να ξαναδιαλέξουμε τα ίδια αρχεία αν θέλουμε
    input.value = '';

    console.log(this.tableImagesEvents);

  }

  removeImagesEvents(idImage: any) {
    // Βρες το αντικείμενο που θα αφαιρεθεί
    const deletedItem = this.tableImagesEvents.find((item: any) => item.index === idImage);
    // Αν υπάρχει, πρόσθεσέ το στον άλλο πίνακα
    if (deletedItem) {
      this.DataService.tableEditDeleteImagesEventsAdmin.push(deletedItem);
    }
    // Διαγραφή εικόνας από τον κύριο πίνακα
    this.tableImagesEvents = this.tableImagesEvents.filter((item: any) => item.index !== idImage);


    // Αν η εικόνα που φαίνεται στο slider, είναι πίο μπροστά σε θέση από την εικόνα που θα επιλεχθεί να αφαιρεθεί (Λύση bug).
    if (this.sliderEvents.visiableImageIndex > idImage) {
      // Να δείξει την προηγούμενη
      this.sliderEvents.visiableImageIndex = this.sliderEvents.visiableImageIndex - 1;
      // this.sliderEvents.prev();
    }
    // Αν η εικόνα που φαίνεται στο sliderEvents, είναι η τελευταία εικόνα σε θέση και επιλεχθεί να αφαιρεθεί αυτή (Λύση bug).
    if (this.sliderEvents.visiableImageIndex == this.tableImagesEvents.length) {
      // Να δείξει την προηγούμενη.
      this.sliderEvents.visiableImageIndex = this.sliderEvents.visiableImageIndex - 1;
      // this.sliderEvents.prev();
    }




  }

  addEvent() {

    // Το τελικό body που θα στείλω στην βάση για εγγραφή νέας εκδήλωσης.
    console.log(this.eventsControls.controls)
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
    this.DataService.serviceJsonValuesEventsUpdate = this.jsonValuesEvents;


    this.DataService.tableEditAddImagesEventsAdmin = [...this.tableImagesEvents];
    this.insertImagesEventsText = true; // Επισήμανση του *Εισαγωγή εικόνων στο uploadImagesEvents
    console.log(this.DataService.tableEditAddImagesEventsAdmin)
    console.log(this.DataService.tableEditDeleteImagesEventsAdmin)


    // Δείχνει τα require πεδία (μαζικά, όχι ένα ενα).
    if (!this.eventsControls.valid || this.tableImagesEvents.length == 0) { // Αν υπάρχουν errors.
      this.eventsControls.markAllAsTouched(); // Δείξε errors.

      this._snackBar.open( // Μύνημα errors.
        'Υπάρχουν υποχρεωτικά πεδία',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        }
      );
    } else {
      this.openDialogUpdateEvents();
    }





  }


  openDialogUpdateEvents() {
    const ref = this.dialog.open(UpdateEditComponent, {
      autoFocus: false,
      disableClose: true, // Δεν κλείνει όταν κάνεις κλικ εκτός
      // data: {
      //   selectedId: id
      // }

    });
  }

}
