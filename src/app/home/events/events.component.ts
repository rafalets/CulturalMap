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
