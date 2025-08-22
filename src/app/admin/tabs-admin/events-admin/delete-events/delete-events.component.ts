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


// Component
import { DataService } from '../../../../../services/data.service';

// Import Server.
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-delete-events',
  imports: [
    CommonModule,

    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  providers: [HttpClient],
  templateUrl: './delete-events.component.html',
  styleUrl: './delete-events.component.scss'
})
export class DeleteEventsComponent {


  constructor(
    public DataService: DataService,
    private http: HttpClient,
  ) { }

  private _snackBar = inject(MatSnackBar) // Γιατί private και γιατί inject???


  async deleteEvent() {
    this.DataService.loadingAdmin = true; // Ενεργοποίηση spinner.

    // -----Διαγραφή εκδήλωσης----- \\
    try {
      const url = 'https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Εκδηλώσεις/FeatureServer/0/applyEdits';

      const deleteBody = new URLSearchParams({
        f: 'json',
        deletes: this.DataService.objectidDeleteEvent, // Αν θέλεις πολλαπλά: '123,124,125'
      });

      let res = await firstValueFrom(this.http.post(url, deleteBody.toString(), { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) }))
      console.log(res)

      await this.DataService.insertDataServer(); // Ανανέωση βάσης.

      this._snackBar.open( // Μύνημα Επιτυχίας.
        'Επιτυχία ακύρωσης',
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
        'Αποτυχία ακύρωσης',
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
