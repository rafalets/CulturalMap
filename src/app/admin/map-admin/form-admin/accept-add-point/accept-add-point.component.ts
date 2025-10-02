// Import angular.
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

// Import material angular.
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Import componet.
import { DataService } from '../../../../../services/data.service';

// Import Server.
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-accept-add-point',
  imports: [
    CommonModule,

    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './accept-add-point.component.html',
  styleUrl: './accept-add-point.component.scss'
})
export class AcceptAddPointComponent {

  constructor(
    public DataService: DataService,
    private http: HttpClient,
  ) { }

  private _snackBar = inject(MatSnackBar) // Γιατί private και γιατί inject???

  async accept() {

    this.DataService.popupAddEvent?.close(); // Κλείνει το Popup.
    this.DataService.loadingSpinnerMapAdmin = true; // Ενεργοποίηση Spinner.

    // -----Προσθήκη Πολιτιστικού Σημείου----- \\
    try {
      // Βήμα 1.1 - Προσθήκη Atributes & Geometry.
      var layerList: any = [
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Churchs_Monasteries/FeatureServer/0/addFeatures",
          name: "Εκκλησία/Μοναστήρι",
          helpUrlImages: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Churchs_Monasteries/FeatureServer/0/",
        },
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Museums/FeatureServer/0/addFeatures",
          name: "Μουσείο",
          helpUrlImages: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Museums/FeatureServer/0/",
        },
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Historical_Monuments/FeatureServer/0/addFeatures",
          name: "Ιστορικό μνημείο",
          helpUrlImages: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Historical_Monuments/FeatureServer/0/",
        },
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Cultural_Clubs/FeatureServer/0/addFeatures",
          name: "Πολιτιστικός σύλλογος",
          helpUrlImages: "https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Cultural_Clubs/FeatureServer/0/",
        }
      ]
      var url = '';
      var helpUrlImages = '';
      for (let i in layerList) {
        if (this.DataService.serviceJsonValuesPointsAdd.category == layerList[i].name) {
          url = layerList[i].url;
          helpUrlImages = layerList[i].helpUrlImages;
        }
      }
      const feature = {
        attributes: {
          name: this.DataService.serviceJsonValuesPointsAdd.name,
          category: this.DataService.serviceJsonValuesPointsAdd.category,
          description: this.DataService.serviceJsonValuesPointsAdd.description,
          status: "1",
        },
        geometry: {
          x: this.DataService.serviceJsonValuesPointsAdd.long,
          y: this.DataService.serviceJsonValuesPointsAdd.lat,
          spatialReference: { wkid: 4326 }
        }
      };
      const body = new URLSearchParams({
        f: 'json',
        features: JSON.stringify([feature])
      });
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      let res: any = await firstValueFrom(this.http.post(url, body.toString(), { headers }))
      console.log(res)

      // Βήμα 1.2 - Προσθήκη attachment (images).
      const urlImages = `${helpUrlImages}${res.addResults[0].objectId}/addAttachment`;
      console.log(urlImages)
      for (let i in this.DataService.tableAddImagesPointsAdmin) {
        let file = this.DataService.tableAddImagesPointsAdmin[i].file
        const formData = new FormData();
        formData.append('attachment', file, file.name);
        formData.append('f', 'json');
        let resImages = await firstValueFrom(this.http.post(urlImages, formData)); // Κλήση προσθήκης attachment.
        console.log(resImages)
      }

      // Βήμα 1.3 - Ανανέωση βάσης.
      await this.DataService.insertDataServer();

      // Βήμα 1.4 Ενημέρωση του χάρτη (να φανεί το νέο σημείο που προστέθηκε)
      const view = this.DataService.mapViewAdmin;
      if (!view) return;
      const layers = view.map.allLayers;
      layers.forEach((layer: any) => {
        if ('refresh' in layer) {
          (layer as any).refresh?.(); // χρησιμοποιούμε optional chaining για ασφάλεια

          // Βήμα 1.5  Μετά το κλικ, με μεταφέρει στην τοποθεσία του.
          this.DataService.mapViewAdmin.goTo({ center: [this.DataService.serviceJsonValuesPointsAdd.long, this.DataService.serviceJsonValuesPointsAdd.lat], zoom: 16 })
            .catch(console.error);
        }
      });

      // Βήμα 1.6 - Μύνημα Επιτυχίας.
      this._snackBar.open(
        'Επιτυχία προσθήκης',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['general-snackbar']
        }
      );
    } catch {
      // Βήμα 2.1 - Μύνημα Αποτυχίας.
      this._snackBar.open(
        'Αποτυχία προσθήκης',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        }
      );
    }
    this.DataService.loadingSpinnerMapAdmin = false; // Απενεργοποίηση Spinner.
  }

  cancel() {
    console.log("Ακύρωση")
  }


}
