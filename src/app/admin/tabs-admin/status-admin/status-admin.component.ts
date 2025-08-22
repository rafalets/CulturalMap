// Import angular
import { Component, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

// Import Esri
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

// Images slider
import { NgImageSliderModule, NgImageSliderComponent } from 'ng-image-slider';

// Component
import { DataService } from '../../../../services/data.service';
import { PopupAcceptCanselComponent } from '../popup-accept-cansel/popup-accept-cansel.component';


@Component({
  selector: 'app-status-admin',
  imports: [
    CommonModule,

    MatDividerModule,
    MatIconModule,

    NgImageSliderModule,
  ],
  templateUrl: './status-admin.component.html',
  styleUrl: './status-admin.component.scss'
})
export class StatusAdminComponent {

  constructor(
    public DataService: DataService,
    public dialog: MatDialog,
  ) { }

  // Πίνακες:
  statusTable: any = [
    // {
    //   category: "Εκκλησία",
    //   name: "Άγιος Γεώργιος",
    //   image: [],
    //   description: "Άγιος Γεώργιος πολυ ωραία εκκλησία",
    //   x: 23.355586,
    //   y: 40.818481,
    // },
    // {
    //   category: "Εκκλησία",
    //   name: "Άγιοι Απόστολοι",
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
    //   category: "Μουσείο",
    //   name: null,
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
    //   description: "",
    //   x: null,
    //   y: 40.817527,
    // },
  ]

  // ViewChild:
  @ViewChild('nav') slider!: NgImageSliderComponent; // Χρησιμοποιείται για την επίλυση του bug στο slider (τι να φαίνεται όταν προσθέτω και όταν αφαιρώ μια εικόνα).

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

  // Μεταβλητές
  showSlider = true;


  ngOnInit() {

  }

  ngAfterViewInit() {

    this.DataService.dataServerAdmin$.subscribe(data => {
      this.statusTable = [];

      for (let i in data) {
        if (data[i].name != "Events") {
          for (let j in data[i].data) {
            if (data[i].data[j].attributes.status == "0") {
              this.statusTable.push(data[i].data[j]);
            }
          }
        }
      }
      // this.statusTable = [...helpTable];
      this.DataService.statusTable = this.statusTable // Να ενημερώνω τις εκκρεμότητες για τυχόν εκκρεμότητες.
    })

    // Κάνεις re-render το slider
    this.showSlider = false;
    setTimeout(() => {
      this.showSlider = true;
    }, 0);
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

  accept(id: any, category: any, x: any, y: any) {

    this.DataService.objectidAcceptPoint = id;
    this.DataService.categoryAcceptPoint = category;
    this.DataService.longAcceptPoint = x;
    this.DataService.latAcceptPoint = y;


    this.DataService.openAcceptPopup = true; // Ενεργοποίηση popup "αποδοχή".
    this.DataService.openCancelPopup = false; // Απενεργοποίηση popup "ακύρωση".

    this.dialog.open(PopupAcceptCanselComponent, {
      autoFocus: false,
      disableClose: true, // Δεν κλείνει όταν κάνεις κλικ εκτός
      panelClass: 'cdk-global-overlay-wrapper-status',
      data: {
      }
    });

  }

  cancel(id: any, category: any) {

    this.DataService.objectidDeletePoint = id;
    this.DataService.categoryDeletePoint = category;

    this.DataService.openAcceptPopup = false; // Απενεργοποίηση popup "αποδοχή".
    this.DataService.openCancelPopup = true; // Ενεργοποίηση popup "ακύρωση".

    this.dialog.open(PopupAcceptCanselComponent, {
      autoFocus: false,
      disableClose: true, // Δεν κλείνει όταν κάνεις κλικ εκτός
      panelClass: 'cdk-global-overlay-wrapper-status',
      data: {}
    });

  }

}
