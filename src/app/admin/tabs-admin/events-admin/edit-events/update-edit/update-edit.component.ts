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
import { DataService } from '../../../../../../services/data.service';

// Import Server.
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-update-edit',
  imports: [
    CommonModule,

    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './update-edit.component.html',
  styleUrl: './update-edit.component.scss'
})
export class UpdateEditComponent {

  constructor(
    public DataService: DataService,
    private http: HttpClient,
  ) { }

  private _snackBar = inject(MatSnackBar) // Γιατί private και γιατί inject???

  async update() {

    this.DataService.loadingAdmin = true; // Ενεργοποίηση spinner.
    this.DataService.popupEditEvents?.close(); // Κλείνει το Popup.


    // -----Ενημέρωση εκδήλωσης----- \\
    try {
      const url = 'https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Εκδηλώσεις/FeatureServer/0/applyEdits';

      const feature = { // Το feature που υα κάνω Update.
        attributes: {
          objectId: this.DataService.editObjectId,
          title: this.DataService.serviceJsonValuesEventsUpdate.title,
          date_from: this.DataService.serviceJsonValuesEventsUpdate.date_from,
          date_to: this.DataService.serviceJsonValuesEventsUpdate.date_to,
          description: this.DataService.serviceJsonValuesEventsUpdate.description,
          link: this.DataService.serviceJsonValuesEventsUpdate.link,
        },
        geometry: {
          x: this.DataService.serviceJsonValuesEventsUpdate.long,
          y: this.DataService.serviceJsonValuesEventsUpdate.lat,
          spatialReference: { wkid: 4326 }
        }
      };

      const updateBody = new URLSearchParams({
        f: 'json',
        updates: JSON.stringify([feature]),
      });

      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

      let res = await firstValueFrom(this.http.post(url, updateBody.toString(), { headers }));
      console.log(res)

      await this.DataService.insertDataServer(); // Ανανέωση βάσης.

      this._snackBar.open( // Μύνημα Επιτυχίας.
        'Επιτυχία τροποποίησης',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['general-snackbar']
        }
      );
    } catch {
      this._snackBar.open( // Μύνημα Αποτυχίας.
        'Αποτυχία τροποποίησης',
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

}
