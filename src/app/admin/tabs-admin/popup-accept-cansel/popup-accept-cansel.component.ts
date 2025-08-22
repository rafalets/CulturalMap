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
import { DataService } from '../../../../services/data.service';

// Import Server.
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-popup-accept-cansel',
  imports: [
    CommonModule,

    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  providers: [HttpClient],
  templateUrl: './popup-accept-cansel.component.html',
  styleUrl: './popup-accept-cansel.component.scss'
})
export class PopupAcceptCanselComponent {

  constructor(
    public DataService: DataService,
    private http: HttpClient,
  ) { }

  private _snackBar = inject(MatSnackBar) // Γιατί private και γιατί inject???

  async remove() {
    this.DataService.loadingAdmin = true; // Ενεργοποίηση spinner.

    this.DataService.openAcceptPopup = false; // Απενεργοποίηση popup "αποδοχή".
    this.DataService.openCancelPopup = false; // Απενεργοποίηση popup "ακύρωση".

    // -----Διαγραφή εκδήλωσης----- \\
    try {
      // Επιλογή url.
      var layerList: any = [
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/0/applyEdits",
          name: "Εκκλησία"
        },
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/1/applyEdits",
          name: "Μουσείο"
        }
      ]
      var url = '';
      for (let i in layerList) {
        if (this.DataService.categoryDeletePoint == layerList[i].name) {
          url = layerList[i].url;
        }
      }

      const deleteBody = new URLSearchParams({
        f: 'json',
        deletes: this.DataService.objectidDeletePoint, // Αν θέλεις πολλαπλά: '123,124,125'
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

  async accept() {
    this.DataService.loadingAdmin = true; // Ενεργοποίηση spinner.
    this.DataService.openAcceptPopup = false; // Απενεργοποίηση popup "αποδοχή".
    this.DataService.openCancelPopup = false; // Απενεργοποίηση popup "ακύρωση".


    // -----Ενημέρωση εκδήλωσης----- \\
    try {
      // Επιλογή url.
      var layerList: any = [
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/0/applyEdits",
          name: "Εκκλησία"
        },
        {
          url: "https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/1/applyEdits",
          name: "Μουσείο"
        }
      ]
      var url = '';
      for (let i in layerList) {
        if (this.DataService.categoryAcceptPoint == layerList[i].name) {
          console.log(this.DataService.categoryAcceptPoint)
          console.log(layerList[i].name)

          url = layerList[i].url;
        }
      }

      const feature = { // Το feature που υα κάνω Update.
        attributes: {
          objectId: this.DataService.objectidAcceptPoint,
          status: "1",
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

      // Ενημέρωση του χάρτη (να φανεί το νέο σημείο που προστέθηκε)
      const view = this.DataService.mapViewAdmin;
      if (!view) return;
      const layers = view.map.allLayers;
      layers.forEach((layer: any) => {
        if ('refresh' in layer) {
          (layer as any).refresh?.(); // χρησιμοποιούμε optional chaining για ασφάλεια

          // Μετά το κλικ, με μεταφέρει στην τοποθεσία του.
          this.DataService.mapViewAdmin.goTo({ center: [this.DataService.longAcceptPoint, this.DataService.latAcceptPoint], zoom: 16 })
            .catch(console.error);
        }
      });

      this._snackBar.open( // Μύνημα Επιτυχίας.
        'Επιτυχία αποδοχής',
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
        'Αποτυχία αποδοχής',
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

    this.DataService.openAcceptPopup = false; // Απενεργοποίηση popup "αποδοχή".
    this.DataService.openCancelPopup = false; // Απενεργοποίηση popup "ακύρωση".

  }




}
