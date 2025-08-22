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
  selector: 'app-accept-add-events',
  imports: [
    CommonModule,

    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './accept-add-events.component.html',
  styleUrl: './accept-add-events.component.scss'
})
export class AcceptAddEventsComponent {

  constructor(
    public DataService: DataService,
    private http: HttpClient,
  ) { }

  private _snackBar = inject(MatSnackBar) // Γιατί private και γιατί inject???


  async accept() {
    this.DataService.loadingAdmin = true; // Ενεργοποίηση spinner.
    this.DataService.popupAddEvent?.close(); // Κλείνει το Popup.

    // -----Προσθήκη εκδήλωσης----- \\
    try {
      // Βήμα 1.1 - Προσθήκη Atributes & Geometry.
      const url = 'https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Εκδηλώσεις/FeatureServer/0/addFeatures';
      const feature = {
        attributes: {
          title: this.DataService.serviceJsonValuesEvents.title,
          date_from: this.DataService.serviceJsonValuesEvents.date_from,
          date_to: this.DataService.serviceJsonValuesEvents.date_to,
          description: this.DataService.serviceJsonValuesEvents.description,
          link: this.DataService.serviceJsonValuesEvents.link,
        },
        geometry: {
          x: this.DataService.serviceJsonValuesEvents.long,
          y: this.DataService.serviceJsonValuesEvents.lat,
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
      console.log(res.addResults)

      // Βήμα 1.2 - Προσθήκη attachment (images).
      const urlImages = `https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Εκδηλώσεις/FeatureServer/0/${res.addResults[0].objectId}/addAttachment`;
      for (let i in this.DataService.tableAddImagesEventsAdmin) {
        let file = this.DataService.tableAddImagesEventsAdmin[i].file
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
    this.DataService.loadingAdmin = false; // Απενεργοποίηση spinner.
  }
  cancel() {
    console.log("Ακύρωση")

  }

}
