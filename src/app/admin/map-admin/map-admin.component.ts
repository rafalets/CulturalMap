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
import Editor from "@arcgis/core/widgets/Editor.js";



// Import component.
import { FormAdminComponent } from './form-admin/form-admin.component';
import { DataService } from '../../../services/data.service';
@Component({
  selector: 'app-map-admin',
  imports: [
    CommonModule,

    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './map-admin.component.html',
  styleUrl: './map-admin.component.scss'
})
export class MapAdminComponent {

  constructor(
    // Απαραίτητο για τη δημιουργία του πίνακα και των Popups.
    public dialog: MatDialog,
    public DataService: DataService,
  ) { }

  private _snackBar = inject(MatSnackBar) // Γιατί private και γιατί inject???


  adding: boolean = false;

  myMap: any = null
  mapView: any = null

  ngOnInit() {

    // Δημιουργία χάρτη.
    this.myMap = new WebMap({
      basemap: 'hybrid'
    });

    // Δημιουργία MapView
    this.mapView = new MapView({
      map: this.myMap,
      container: "viewMap",
      extent: {
        xmin: 23.2000,
        ymin: 40.6900,
        xmax: 23.5000,
        ymax: 40.9400,
        spatialReference: { wkid: 4326 }
      },
    });
    this.DataService.mapViewAdmin = this.mapView;

    this.mapView.when(() => {
      const btn = document.getElementById("addPointBtn");
      if (btn) {
        this.mapView.ui.add(btn, "top-right");
      }
    });

    // Λίστα layers
    const layerList: any = [
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
      }
    ];

    // --- ΝΕΟ: θα κρατάμε μόνο τα layers που επιτρέπεται να επεξεργαστούν
    const editableLayers: __esri.FeatureLayer[] = [];
    let studyAreaLayer: __esri.FeatureLayer | null = null;

    // Δημιουργία FeatureLayers
    for (const info of layerList) {
      const fl = new FeatureLayer({
        definitionExpression: "status = '1'",
        portalItem: { id: info.id },
        layerId: info.indexId,

        // --- ΝΕΟ: κανόνες για το "Περιοχή μελέτης"
        ...(info.name === "Perioxh_Meleths"
          ? {
            editingEnabled: false, // ❌ εκτός Editor
            popupEnabled: false    // ❌ να μην ανοίγουν popups / επιλογές
          }
          : {
            editingEnabled: true   // ✅ τα υπόλοιπα μπορούν να επεξεργαστούν
          })
      });

      // Προαιρετικά: κράτα αναφορά
      if (info.name === "Perioxh_Meleths") {
        studyAreaLayer = fl;
      } else {
        editableLayers.push(fl); // μόνο αυτά θα πάνε στον Editor
      }

      this.myMap.layers.add(fl);
    }

    // Popups by default (τα απενεργοποιήσαμε ειδικά μόνο στο study area)
    this.mapView.popup!.defaultPopupTemplateEnabled = true;
    this.mapView.popup.dockEnabled = true;
    this.mapView.popup.dockOptions = {
      buttonEnabled: false,
      breakpoint: false,
      position: "top-right"
    };

    // BasemapGallery
    const basemapGallery = new BasemapGallery({ view: this.mapView });

    // Home
    const homeWidget = new Home({ view: this.mapView });
    this.mapView.ui.add(homeWidget, "top-left");

    // Search μέσα σε Expand
    const searchWidget = new Search({ view: this.mapView });
    const expandSearch = new Expand({
      view: this.mapView,
      content: searchWidget,
      expanded: false
    });
    this.mapView.ui.add(expandSearch, "top-left");

    // BasemapGallery σε Expand
    const basemapExpand = new Expand({ view: this.mapView, content: basemapGallery });
    this.mapView.ui.add(basemapExpand, { position: "top-left" });

    // Legend σε Expand
    const legend = new Legend({ view: this.mapView });
    const legendExpand = new Expand({ view: this.mapView, content: legend });
    this.mapView.ui.add(legendExpand, { position: "top-left" });

    // --- ΝΕΟ: Editor μόνο για editable layers (study area εκτός)
    const editor = new Editor({
      view: this.mapView,
      layerInfos: editableLayers.map(layer => ({ layer }))
    });
    // Βάζουμε τον editor σε Expand
    const editorExpand = new Expand({
      view: this.mapView,
      content: editor,
      expanded: false, // ξεκινάει κλειστό
    });
    // Προσθήκη στο UI
    this.mapView.ui.add(editorExpand, {
      position: "top-right"
    });





    // Συνδρομή για add point
    this.DataService.newPointInMap$.subscribe(() => this.onAddButtonClick());
  }


  async ngAfterViewInit() {
    this.mapView.on("click", async (event: any) => {
      if (!this.adding) return;

      console.log(this.DataService.openEventPopup)


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
          if (!this.DataService.openEventPopup) {
            showError('Δεν επιτρέπεται προσθήκη νέου σημείου εκτός Δ.Κ. Σοχού');
          } else {
            showError('Δεν επιτρέπεται προσθήκη νέας εκδήλωσης εκτός Δ.Κ. Σοχού');
          }
          return;
        }

        const layersTitle = response.results
          .map((r: any) => r?.layer?.title)
          .filter((t: any) => !!t);

        // 👉 Αν δεν περιέχει το layer "Περιοχή μελέτης"
        if (!layersTitle.includes("Περιοχή μελέτης")) {
          if (!this.DataService.openEventPopup) {
            showError('Δεν επιτρέπεται προσθήκη νέου σημείου εκτός Δ.Κ. Σοχού');
          } else {
            showError('Δεν επιτρέπεται προσθήκη νέας εκδήλωσης εκτός Δ.Κ. Σοχού');
          }
          return;
        }

        // 👉 Αν υπάρχει ήδη κάποιο από τα “απαγορευμένα” layers
        const blocked = ["Μουσεία", "Πολιτιστικοί συλλόγοι", "Ισορικά μνημεία", "Εκκλησίες/Μοναστήρια"];
        if (blocked.some(val => layersTitle.includes(val))) {
          showError('Υπάρχει καταχωρημένο σημείο σε αυτήν τη θέση');
          return;
        }

        // 👉 Διαφορετικά, προχωράς κανονικά
        const point = event.mapPoint;
        if (!point) {
          showError('Παρουσιάστηκε σφάλμα στον εντοπισμό σημείου. Προσπαθήστε ξανά.');
          return;
        }

        this.DataService.latitudeAdmin = parseFloat(point.latitude.toFixed(5));
        this.DataService.longitudeAdmin = parseFloat(point.longitude.toFixed(5));
        this.openDialogDetails(1);
        this.adding = false;

      } catch (e) {
        showError('Παρουσιάστηκε σφάλμα κατά τον έλεγχο της θέσης. Προσπαθήστε ξανά.');
        // console.error(e); // για debugging
      }
    });
  }



  onAddButtonClick(): void {
    this.DataService.openEventPopup = false; // Pupop νέο σημείο.
    this.adding = true;
  }

  openDialogDetails(id: any) {
    const ref = this.dialog.open(FormAdminComponent, {
      autoFocus: false,
      disableClose: true, // Δεν κλείνει όταν κάνεις κλικ εκτός
    });
    this.DataService.popupAddEvent = ref; // Ορίζω το dialog στο service ώστε να μπορώ να κλείνω το Popup από άλλο Component.
    ref.afterClosed().subscribe(() => { // Να μην γεμίζει η μνήμη.
      this.DataService.popupAddEvent = null;
    });
  }

}
