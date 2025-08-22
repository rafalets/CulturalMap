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

    this.DataService.popupAddPointUser?.close(); // Κλείνει το Popup.
    this.DataService.loadingSpinnerMapUser = true; // Ενεργοποίηση Spinner.

    // -----Προσθήκη Πολιτιστικού Σημείου----- \\
    try {
      var layerList: any = [
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/0/addFeatures",
          name: "Εκκλησία",
          helpUrlImages: "https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/0/",
        },
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/1/addFeatures",
          name: "Μουσείο",
          helpUrlImages: "https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/1/",
        }
      ]
      var url = '';
      var helpUrlImages = '';
      for (let i in layerList) {
        if (this.DataService.serviceJsonValuesPointsAddUser.category == layerList[i].name) {
          url = layerList[i].url;
          helpUrlImages = layerList[i].helpUrlImages;
        }
      }
      const feature = {
        attributes: {
          name: this.DataService.serviceJsonValuesPointsAddUser.name,
          category: this.DataService.serviceJsonValuesPointsAddUser.category,
          description: this.DataService.serviceJsonValuesPointsAddUser.description,
          status: 0,
        },
        geometry: {
          x: this.DataService.serviceJsonValuesPointsAddUser.long,
          y: this.DataService.serviceJsonValuesPointsAddUser.lat,
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
      for (let i in this.DataService.tableAddImagesPointsUser) {
        let file = this.DataService.tableAddImagesPointsUser[i].file
        const formData = new FormData();
        formData.append('attachment', file, file.name);
        formData.append('f', 'json');
        let resImages = await firstValueFrom(this.http.post(urlImages, formData)); // Κλήση προσθήκης attachment.
        console.log(resImages)
      }

      // Βήμα 1.3 - Ανανέωση βάσης.
      await this.DataService.insertDataServer();

      // Βήμα 1.4 - Μύνημα Επιτυχίας.
      this._snackBar.open(
        'Επιτυχία υποβολής',
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
        'Αποτυχία υποβολής',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        }
      );
    }

    this.DataService.loadingSpinnerMapUser = false; // Απενεργοποίηση Spinner.
  }

  cancel() {
    console.log("Ακύρωση")


  }


}
