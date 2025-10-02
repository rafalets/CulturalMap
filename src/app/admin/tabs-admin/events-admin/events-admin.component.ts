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
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const eventsContainer = data.find((x: any) => x.name === 'Events');
      const events: any[] = eventsContainer?.data ?? [];

      const parseDate = (val: any): Date | null => {
        if (!val) return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      };

      const fmt = (d?: string) => {
        if (!d) return d;
        const nd = new Date(d);
        if (isNaN(nd.getTime())) return d;
        const day = nd.getDate();
        const month = nd.getMonth() + 1;
        const year = nd.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Εμπλουτίζουμε με parsed ημερομηνίες και flags
      const enriched = events.map(ev => {
        const rawFrom = ev?.attributes?.date_from;
        const rawTo = ev?.attributes?.date_to;

        const from = parseDate(rawFrom);
        const to = parseDate(rawTo);

        // Σε εξέλιξη σήμερα = τέμνει τη σημερινή μέρα
        const isOngoingToday =
          (!!to && to >= startOfToday && (!from || from <= endOfToday)) ||
          (!to && !!from && from >= startOfToday && from <= endOfToday); // μονοήμερο σήμερα

        // Επερχόμενο = ξεκινά μετά ή (ισο)σήμερα, χωρίς να είναι ήδη σε εξέλιξη
        const isUpcoming = !!from && from >= startOfToday && !isOngoingToday;

        return { ev, from, to, isOngoingToday, isUpcoming };
      });

      // Φιλτράρουμε: πετάμε ό,τι είναι καθαρά στο παρελθόν
      const filtered = enriched.filter(x => {
        if (x.to) {
          // έχει date_to: κράτα αν δεν έχει λήξει πριν από σήμερα
          return x.to >= startOfToday;
        }
        // δεν έχει date_to: κράτα αν ξεκινά σήμερα ή μετά
        return !!x.from && x.from >= startOfToday;
      });

      // Ταξινόμηση: ongoing πρώτα (όσα τελειώνουν νωρίτερα πάνω πάνω), μετά upcoming (όσα ξεκινούν νωρίτερα πάνω πάνω)
      filtered.sort((a, b) => {
        const groupA = a.isOngoingToday ? 0 : 1;
        const groupB = b.isOngoingToday ? 0 : 1;
        if (groupA !== groupB) return groupA - groupB;

        if (a.isOngoingToday && b.isOngoingToday) {
          const aEnd = a.to ? a.to.getTime() : Number.MAX_SAFE_INTEGER;
          const bEnd = b.to ? b.to.getTime() : Number.MAX_SAFE_INTEGER;
          if (aEnd !== bEnd) return aEnd - bEnd;
          // δευτερεύον: πιο νωρίς started πρώτα
          const aStart = a.from ? a.from.getTime() : 0;
          const bStart = b.from ? b.from.getTime() : 0;
          return aStart - bStart;
        }

        // Και οι δύο upcoming: πιο κοντινή έναρξη πρώτα
        const aStart = a.from ? a.from.getTime() : Number.MAX_SAFE_INTEGER;
        const bStart = b.from ? b.from.getTime() : Number.MAX_SAFE_INTEGER;
        return aStart - bStart;
      });

      // Τελικό mapping + μορφοποίηση για εμφάνιση
      this.tableEvents = filtered.map(x => ({
        ...x.ev,
        attributes: {
          ...x.ev.attributes,
          date_from: x.ev.attributes?.date_from ? fmt(x.ev.attributes.date_from) : x.ev.attributes?.date_from,
          date_to: x.ev.attributes?.date_to ? fmt(x.ev.attributes.date_to) : x.ev.attributes?.date_to,
        }
      }));

      console.log(this.tableEvents);
    });
  }



  // ngAfterViewInit() {
  //   this.DataService.dataServerAdmin$.subscribe(data => {
  //     console.log(data)

  //     for (let i in data) {
  //       if (data[i].name == "Events") {

  //         for (let j in data[i].data) {
  //           // Προσαρμογή της ημερομηνίας date_from.
  //           if (data[i].data[j].attributes.date_from != "" && data[i].data[j].attributes.date_from != null) {
  //             let todayFrom = data[i].data[j].attributes.date_from
  //             todayFrom = new Date(todayFrom)
  //             let yearFrom = todayFrom.getFullYear();
  //             let monthFrom = todayFrom.getMonth() + 1;
  //             let dayFrom = todayFrom.getDate();
  //             data[i].data[j].attributes.date_from = dayFrom + "/" + monthFrom + "/" + yearFrom;
  //           }

  //           // Προσαρμογή της ημερομηνίας date_to.
  //           if (data[i].data[j].attributes.date_to != "" && data[i].data[j].attributes.date_to != null) {
  //             let todayTo = data[i].data[j].attributes.date_to
  //             todayTo = new Date(todayTo)
  //             let yearTo = todayTo.getFullYear();
  //             let monthTo = todayTo.getMonth() + 1;
  //             let dayTo = todayTo.getDate();
  //             data[i].data[j].attributes.date_to = dayTo + "/" + monthTo + "/" + yearTo;
  //           }
  //         }
  //         this.tableEvents = [...data[i].data]
  //       }
  //     }
  //     console.log(this.tableEvents)
  //   })

  // }


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
