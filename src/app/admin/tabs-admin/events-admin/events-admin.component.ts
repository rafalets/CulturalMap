// Import Angular.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import Material.
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

// Import Esri
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

// Images slider
import { NgImageSliderModule, NgImageSliderComponent } from 'ng-image-slider';

// Component
import { DataService } from '../../../../services/data.service';
import { EditEventsComponent } from './edit-events/edit-events.component';
import { DeleteEventsComponent } from './delete-events/delete-events.component';


@Component({
  selector: 'app-events-admin',
  imports: [
    CommonModule,

    MatIconModule,

    NgImageSliderModule,
  ],
  templateUrl: './events-admin.component.html',
  styleUrl: './events-admin.component.scss'
})
export class EventsAdminComponent {

  constructor(
    public DataService: DataService,
    public dialog: MatDialog, // Απαραίτητο για τη δημιουργία του πίνακα και των Popups.

  ) { }

  tableEvents: any = [];

  // Ιmage slider:
  imageSize = { width: '100%', height: '200px' }
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


  ngOnInit() {

    this.DataService.dataServerAdmin$.subscribe(data => {
      console.log(data)

      for (let i in data) {
        if (data[i].name == "Events") {

          for (let j in data[i].data) {
            // Προσαρμογή της ημερομηνίας date_from.
            if (data[i].data[j].attributes.date_from != "" && data[i].data[j].attributes.date_from != null) {
              let todayFrom = data[i].data[j].attributes.date_from
              todayFrom = new Date(todayFrom)
              let yearFrom = todayFrom.getFullYear();
              let monthFrom = todayFrom.getMonth() + 1;
              let dayFrom = todayFrom.getDate();
              data[i].data[j].attributes.date_from = dayFrom + "/" + monthFrom + "/" + yearFrom;
            }

            // Προσαρμογή της ημερομηνίας date_to.
            if (data[i].data[j].attributes.date_to != "" && data[i].data[j].attributes.date_to != null) {
              let todayTo = data[i].data[j].attributes.date_to
              todayTo = new Date(todayTo)
              let yearTo = todayTo.getFullYear();
              let monthTo = todayTo.getMonth() + 1;
              let dayTo = todayTo.getDate();
              data[i].data[j].attributes.date_to = dayTo + "/" + monthTo + "/" + yearTo;
            }
          }
          this.tableEvents = [...data[i].data]
        }
      }
      console.log(this.tableEvents)
    })

  }

  addEvents() {
    this.DataService.newPointInMapFunction(); // Προσθήκη νέας εκδήλωσης.
    this.DataService.openEventPopup = true; // Pupop νέας εκδήλωσης.
  }

  place(x: any, y: any) {
    // Μετά το κλικ, με μεταφέρει στην τοποθεσία του.
    this.DataService.mapViewAdmin.goTo({ center: [x, y], zoom: 18 })
      .catch(console.error);

    // Δημιουργία πρόχειρου Point για να φανεί η ακριβής τοποθεσία
    // Δημιουργία Graphic (Point με συνταταγμένες και style).
    let currentPointGraphic: Graphic | null = null;
    // Δημιουργία Point.
    const point = new Point({
      longitude: x, // To Χ.
      latitude: y, // To Υ.
      spatialReference: this.DataService.mapViewAdmin.spatialReference // Παίρνει το σύστημα αναφοράς που έχει ήδη ο χάρτης.
    });
    // Δημιουργία Style Point (SimpleMarkerSymbol).
    const markerSymbol = new SimpleMarkerSymbol({
      color: "red", // Χρώμα.
      size: "12px", // Μέγεθος.
      style: "circle" // Σχήμα.
    });
    // Αν υπάρχει ήδη σημείο, καθάρισέ το.
    if (currentPointGraphic) {
      this.DataService.mapViewAdmin.graphics.remove(currentPointGraphic);
    }
    // Εισαγωγή πληροφοριών στο Graphic (Point με συνταταγμένες και style).
    currentPointGraphic = new Graphic({
      geometry: point, // Γεωμετρία του point.
      symbol: markerSymbol, // Style του point.
    });
    // Εισαγωγή στομ χάρτη
    this.DataService.mapViewAdmin.graphics.add(currentPointGraphic);

    // Διαγραφή σημείου από τον χάρτη μετά την επόμενη αλλαγή κατάστασης στον χάρτη.
    const watchHandle = this.DataService.mapViewAdmin.watch("stationary", (isStationary: any) => {
      if (!isStationary && currentPointGraphic) {
        this.DataService.mapViewAdmin.graphics.remove(currentPointGraphic);
        currentPointGraphic = null;
        watchHandle.remove(); // Καθαρίζουμε το watcher
      }
    });
  }

  edit(objectId: any) {
    this.openDialogEditEvents();
    this.DataService.editObjectId = objectId;
  }

  cancel(id: any) {
    this.DataService.objectidDeleteEvent = id;
    this.openDialogDeleteEvents();
  }

  openDialogEditEvents() {
    const ref = this.dialog.open(EditEventsComponent, {
      autoFocus: false,
      disableClose: false, // Κλείνει όταν κάνεις κλικ εκτός
      // data: {
      //   selectedId: id
      // }
    });
    this.DataService.popupEditEvents = ref; // Ορίζω το dialog στο service ώστε να μπορώ να κλείνω το Popup από άλλο Component.
    ref.afterClosed().subscribe(() => { // Να μην γεμίζει η μνήμη.
      this.DataService.popupEditEvents = null;
    });

  }

  openDialogDeleteEvents() {
    this.dialog.open(DeleteEventsComponent, {
      autoFocus: false,
      disableClose: true, // Δεν κλείνει όταν κάνεις κλικ εκτός
      panelClass: 'cdk-global-overlay-wrapper-status',
      data: {}
    });
  }



}
