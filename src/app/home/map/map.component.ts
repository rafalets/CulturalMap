// Import angular.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import material.
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

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

  adding: boolean = false;

  myMap: any = null
  mapView: any = null

  ngOnInit() {

    // Δημιουγία χάρτη.
    // var myMap = new WebMap({
    this.myMap = new WebMap({
      basemap: 'hybrid'
    });
    // var mapView = new MapView({
    this.mapView = new MapView({
      map: this.myMap,
      container: "viewMap",
      extent: { // Συντεταγμένες Σοχού.
        xmin: 23.332325,
        ymin: 40.807975,
        xmax: 23.377558,
        ymax: 40.824120,
        spatialReference: {
          "wkid": 4326
        }
      },
    });
    this.DataService.mapView = this.mapView

    this.mapView.on("click", (event: any) => {
      if (this.adding) {
        const point = event.mapPoint;
        if (point) {
          // Ανάκτηση συντεταγμένων (εξαρτάται από το spatialReference του mapView)
          console.log("Συντεταγμένες (γεωγραφικές): ", point.latitude, point.longitude);

          this.DataService.latitude = parseFloat(point.latitude.toFixed(5)); // Κρατάει 5 δεκαδικά (φ).
          this.DataService.longitude = parseFloat(point.longitude.toFixed(5)); // Κρατάει 5 δεκαδικά (λ).

          this.openDialogDetails(1)

          // Απενεργοποιούμε το add mode μετά την επιλογή
          this.adding = false;
        }
      }
    });

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
      }
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
      this.myMap.layers.add(layers);
    }


    // Να εμφανίζουν popup τα layers.
    this.mapView.popup!.defaultPopupTemplateEnabled = true;

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


  onAddButtonClick(): void {
    this.adding = true;
    console.log("Add mode ενεργοποιημένο. Επιλέξτε ένα σημείο στον χάρτη.");
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
