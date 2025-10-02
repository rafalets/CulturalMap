// Import angular.
import { Component, } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import Material.
import { MatIconModule } from '@angular/material/icon';

// Import Esri
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

// Images slider
import { NgImageSliderModule, NgImageSliderComponent } from 'ng-image-slider';

// Import component.
import { DataService } from '../../../services/data.service';



@Component({
  selector: 'app-events',
  imports: [
    CommonModule,

    MatIconModule,

    NgImageSliderModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {

  constructor(
    // Απαραίτητο για τη δημιουργία του πίνακα και των Popups.
    public DataService: DataService,
  ) { }


  tableEvents: any = [
    // {
    //   title: "Γιορτή Αγίου Γεωργίου",
    //   date_from: "23/4/2025",
    //   date_to: null,
    //   image: [
    //     {
    //       image: 'https://picsum.photos/id/1018/1000/600/',
    //       thumbImage: 'https://picsum.photos/id/1018/330/250/', // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το Url.
    //       alt: 'Random Image 1', // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το alt.
    //       title: 'Random Image 1' // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το title.
    //     },
    //     {
    //       image: 'https://picsum.photos/id/1023/1000/600/',
    //       thumbImage: 'https://picsum.photos/id/1023/250/150/',
    //       alt: 'Random Image 2',
    //       title: 'Random Image 2',
    //     },
    //   ],
    //   description: "Άγιος Γεώργιος πολυ ωραία εκκλησία",
    //   x: 23.355586,
    //   y: 40.818481,
    // },
    // {
    //   title: "Πανηγύρι Αγίων Αποστόλων",
    //   date_from: "28/6/2025",
    //   date_to: "30/6/2025",
    //   image: [
    //     {
    //       image: 'https://picsum.photos/id/1018/1000/600/',
    //       thumbImage: 'https://picsum.photos/id/1018/330/250/', // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το Url.
    //       alt: 'Random Image 1', // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το alt.
    //       title: 'Random Image 1' // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το title.
    //     },
    //     {
    //       image: 'https://picsum.photos/id/1023/1000/600/',
    //       thumbImage: 'https://picsum.photos/id/1023/250/150/',
    //       alt: 'Random Image 2',
    //       title: 'Random Image 2',
    //     },
    //   ],
    //   description: "Έχει αγώνες πάλης",
    //   x: 23.363539,
    //   y: 40.820952,
    // },
    // {
    //   title: "Έγκαίνια μπουγάτσας ο Μαμπετ",
    //   date_from: "1/7/2025",
    //   date_to: null,
    //   image: [
    //     {
    //       image: 'https://picsum.photos/id/1018/1000/600/',
    //       thumbImage: 'https://picsum.photos/id/1018/330/250/', // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το Url.
    //       alt: 'Random Image 1', // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το alt.
    //       title: 'Random Image 1' // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το title.
    //     },
    //     {
    //       image: 'https://picsum.photos/id/1023/1000/600/',
    //       thumbImage: 'https://picsum.photos/id/1023/250/150/',
    //       alt: 'Random Image 2',
    //       title: 'Random Image 2',
    //     },
    //   ],
    //   description: "Του Μαμπέτη το μαγαζί είναι απ όλα πιο καλό",
    //   x: 23.352520,
    //   y: 40.817527,
    // },
  ]



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


  ngAfterViewInit() {
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


  place(x: any, y: any) {
    // Μετά το κλικ, με μεταφέρει στην τοποθεσία του.
    this.DataService.mapView.goTo({ center: [x, y], zoom: 18 })
      .catch(console.error);

    // Δημιουργία πρόχειρου Point για να φανεί η ακριβής τοποθεσία
    // Δημιουργία Graphic (Point με συνταταγμένες και style).
    let currentPointGraphic: Graphic | null = null;
    // Δημιουργία Point.
    const point = new Point({
      longitude: x, // To Χ.
      latitude: y, // To Υ.
      spatialReference: this.DataService.mapView.spatialReference // Παίρνει το σύστημα αναφοράς που έχει ήδη ο χάρτης.
    });
    // Δημιουργία Style Point (SimpleMarkerSymbol).
    const markerSymbol = new SimpleMarkerSymbol({
      color: "red", // Χρώμα.
      size: "12px", // Μέγεθος.
      style: "circle" // Σχήμα.
    });
    // Αν υπάρχει ήδη σημείο, καθάρισέ το.
    if (currentPointGraphic) {
      this.DataService.mapView.graphics.remove(currentPointGraphic);
    }
    // Εισαγωγή πληροφοριών στο Graphic (Point με συνταταγμένες και style).
    currentPointGraphic = new Graphic({
      geometry: point, // Γεωμετρία του point.
      symbol: markerSymbol, // Style του point.
    });
    // Εισαγωγή στομ χάρτη
    this.DataService.mapView.graphics.add(currentPointGraphic);

    // Διαγραφή σημείου από τον χάρτη μετά την επόμενη αλλαγή κατάστασης στον χάρτη.
    const watchHandle = this.DataService.mapView.watch("stationary", (isStationary: any) => {
      if (!isStationary && currentPointGraphic) {
        this.DataService.mapView.graphics.remove(currentPointGraphic);
        currentPointGraphic = null;
        watchHandle.remove(); // Καθαρίζουμε το watcher
      }
    });
  }

}
