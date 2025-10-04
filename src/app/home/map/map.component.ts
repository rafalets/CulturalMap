// Import angular.
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import material.
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


// Import esri.
import MapView from "@arcgis/core/views/MapView.js";
import WebMap from "@arcgis/core/WebMap.js";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
import Expand from '@arcgis/core/widgets/Expand.js';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Home from "@arcgis/core/widgets/Home.js";
import Search from "@arcgis/core/widgets/Search.js";
import Legend from "@arcgis/core/widgets/Legend.js";

// Import component.
import { FormComponent } from './form/form.component';
import { DataService } from '../../../services/data.service';






@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,

    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {


  constructor(
    // Απαραίτητο για τη δημιουργία του πίνακα και των Popups.
    public dialog: MatDialog,
    public DataService: DataService,
  ) { }

  private view!: MapView;

  private _snackBar = inject(MatSnackBar) // Γιατί private και γιατί inject???


  adding: boolean = false;
  allowAddPoints: boolean = false;

  myMap: any = null
  mapView: any = null

  async ngOnInit() {

    // Δημιουγία χάρτη.
    // var myMap = new WebMap({
    this.myMap = new WebMap({
      basemap: 'hybrid'
    });
    // var mapView = new MapView({
    this.mapView = new MapView({
      map: this.myMap,
      container: "viewMap",
      extent: {
        xmin: 23.2000,
        ymin: 40.6900,
        xmax: 23.5000,
        ymax: 40.9400,
        spatialReference: {
          "wkid": 4326
        }
      },
    });
    this.DataService.mapView = this.mapView



    this.mapView.when(() => {
      // Προσθέτουμε το κουμπί στην κορυφή αριστερά
      const btn = document.getElementById("addPointBtn");
      if (btn) {
        this.mapView.ui.add(btn, "top-right");
      }
    });

    // Η λίστα με τα Layers.
    var layerList: any = [
      {
        url: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Perioxh_Meleths/FeatureServer/0",
        name: "Perioxh_Meleths",
        id: "a6008ee7bddf4367a3ce837c9d830379",
        indexId: 0,
      },
      {
        url: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Churchs_Monasteries/FeatureServer/0",
        name: "Churchs_Monasteries",
        id: "6cf54543860642c5ab711660d3b0cb3c",
        indexId: 0,
      },
      {
        url: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Museums/FeatureServer/0",
        name: "Museums",
        id: "8eaf1bf24ac94370ac3cdda453e4c7e8",
        indexId: 0,
      },
      {
        url: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Historical_Monuments/FeatureServer/0",
        name: "Historical_Monuments",
        id: "a9ed22d9a772470d8c82f1e1bf81d4e6",
        indexId: 0,
      },
      {
        url: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Cultural_Clubs/FeatureServer/0",
        name: "Cultural_Clubs",
        id: "eb9143e0fe0c4ca49f7ba94be1d04b84",
        indexId: 0,
      },
    ]
    console.log(layerList)



    // Δημιουργία Feature Layer.
    for (let i in layerList) {
      let layers = new FeatureLayer({
        // url: layerList[i].url, // Περιττό να υπάρχει αφού εκμεταλλεύομαι τα id του κάθε layer.
        definitionExpression: "status = '1'", // Να δέχεται όσο έχει δημουργήσει ή αποδεχτεί ο admin.
        portalItem: {
          id: layerList[i].id // Απαραίτητο για την ενημέρωση των popup και style μέσω arcgis online.
        },
        layerId: layerList[i].indexId, // Απαραίτητο για την ενημέρωση των popup και style μέσω arcgis online.
      });
      console.log(layerList[i])
      this.myMap.layers.add(layers);
      console.log(this.myMap.layers)
    }

    // Να εμφανίζουν popup τα layers.
    this.mapView.popup!.defaultPopupTemplateEnabled = true;
    this.mapView.popup.dockEnabled = true;
    this.mapView.popup.dockOptions = {
      buttonEnabled: false,
      breakpoint: false,
      position: "top-right"
    };

    // Δημιουργία του BasemapGallery
    var basemapGallery = new BasemapGallery({
      view: this.mapView
    });

    // Δημιουργία Home για την επιστροφή στο αρχικό σημείο του χάρτη.
    var homeWidget = new Home({
      view: this.mapView
    });
    this.mapView.ui.add(homeWidget, "top-left");

    // Δημιουργία αναζήτησης πάνω στον χάρτη.
    // var searchWidget = new Search({
    //   view: mapView,
    // });
    // mapView.ui.add(searchWidget, "top-right");

    // Δημιουργία του Search widget
    const searchWidget = new Search({
      view: this.mapView
    });

    // Δημιουργία του Expand widget που τυλίγει το Search widget
    const expandSearch = new Expand({
      view: this.mapView,
      content: searchWidget,
      expanded: false
    });

    // Προσθήκη του Expand widget στο UI
    this.mapView.ui.add(expandSearch, "top-left");

    // Δημιουργία του Expand widget που θα περιέχει το basemapGallery.
    var basemapExpand = new Expand({
      view: this.mapView,
      content: basemapGallery,
    });
    this.mapView.ui.add(basemapExpand, {
      position: "top-left"
    });

    // Υπόμνημα.
    let legend = new Legend({
      view: this.mapView
    });

    // Δημιουργία του Expand widget που θα περιέχει το Υπόμνημα
    var legendExpand = new Expand({
      view: this.mapView,
      content: legend,
    });
    this.mapView.ui.add(legendExpand, {
      position: "top-left"
    });

  }

  async ngAfterViewInit() {
    this.mapView.on("click", async (event: any) => {
      if (!this.adding) return;

      const showError = (msg: string) => {
        this._snackBar.open(msg, 'Κλείσιμο', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      };

      try {
        const response: any = await this.mapView.hitTest(event);

        const hasResults =
          Array.isArray(response?.results) && response.results.length > 0;

        // 👉 Αν δεν βρεθεί κανένα layer στο κλικ
        if (!hasResults) {
          showError('Δεν επιτρέπεται προσθήκη νέου σημείου εκτός Δ.Κ. Σοχού');
          return;
        }

        const layersTitle = response.results
          .map((r: any) => r?.layer?.title)
          .filter((t: any) => !!t);

        // 👉 Αν δεν περιέχει το layer "Περιοχή μελέτης"
        if (!layersTitle.includes("Περιοχή μελέτης")) {
          showError('Δεν επιτρέπεται προσθήκη νέου σημείου εκτός Δ.Κ. Σοχού');
          return;
        }

        // 👉 Αν υπάρχει ήδη κάποιο από τα “απαγορευμένα” layers
        const blocked = ["Μουσεία", "Πολιτιστικοί συλλόγοι", "Ισορικά μνημεία", "Εκκλησίες/Μοναστήρια"];
        if (blocked.some(val => layersTitle.includes(val))) {
          showError('Υπάρχει ήδη καταχωρημένο σημείο σε αυτήν τη θέση');
          return;
        }

        // 👉 Διαφορετικά, προχωράς κανονικά
        const point = event.mapPoint;
        if (!point) {
          showError('Παρουσιάστηκε σφάλμα στον εντοπισμό σημείου. Προσπαθήστε ξανά.');
          return;
        }

        this.DataService.latitude = parseFloat(point.latitude.toFixed(5));
        this.DataService.longitude = parseFloat(point.longitude.toFixed(5));
        this.openDialogDetails(1);
        this.adding = false;

      } catch (e) {
        showError('Παρουσιάστηκε σφάλμα κατά τον έλεγχο της θέσης. Προσπαθήστε ξανά.');
        // console.error(e); // για debugging
      }
    });
  }


  async onAddButtonClick() {
    this.adding = true; // Επέλεξε σημείο στον χάρτη.
  }





  openDialogDetails(id: any) {
    const ref = this.dialog.open(FormComponent, {
      autoFocus: false,
      disableClose: true, // Δεν κλείνει όταν κάνεις κλικ εκτός
    });
    this.DataService.popupAddPointUser = ref; // Ορίζω το dialog στο service ώστε να μπορώ να κλείνω το Popup από άλλο Component.
    ref.afterClosed().subscribe(() => { // Να μην γεμίζει η μνήμη.
      this.DataService.popupAddPointUser = null;
    });
  }


}
