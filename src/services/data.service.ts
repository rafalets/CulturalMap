
// Import angular.
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

// Import material.
import { MatDialogRef } from '@angular/material/dialog';

// Import Server.
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormAdminComponent } from '../app/admin/map-admin/form-admin/form-admin.component';
import { EditEventsComponent } from '../app/admin/tabs-admin/events-admin/edit-events/edit-events.component';
import { FormComponent } from '../app/home/map/form/form.component';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';


@Injectable({
    providedIn: "root"
})

export class DataService {

    constructor(
        private http: HttpClient,
    ) { }


    // USER ----- USER ----- USER ----- USER ----- USER \\
    loadingSpinnerMapUser: Boolean = false; // Το spinner του Χάρτη στον User.

    tableAddImagesPointsUser: any = []; // Ο πίνακας των εικόνων των εκκρεμότητων.


    mapView: any = null // Το view του χάρτη του User.

    latitude: any; // Γεωγραφικό πλάτος (φ) - Υ User.
    longitude: any; // Γεωγραφικό μήκος (λ) - Χ User.

    serviceJsonValuesPointsAddUser: any // Τα data των points add.
    public popupAddPointUser: MatDialogRef<FormComponent> | null = null; // Για να κλείνω το Popup από άλλο Component.


    // ADMIN ----- ADMIN ----- ADMIN ----- ADMIN ----- ADMIN \\

    tableAddImagesEventsAdmin: any = []; // Ο πίνακας των εικόνων των εκδηλώσεων
    tableEditAddImagesEventsAdmin: any = []; // Ο πίνακας των εικόνων των εκδηλώσεων
    tableAddImagesPointsAdmin: any = []; // Ο πίνακας των εικόνων των εκκρεμότητων.


    loadingSpinnerMapAdmin: Boolean = false; // Το spinner του Χάρτη στον Admin.

    dataServerAdmin = new BehaviorSubject<any>([]);; // Τα δεδομένα της βάσης.
    dataServerAdmin$ = this.dataServerAdmin.asObservable();

    async insertDataServer() {

        // Το url query του κάθε Layer
        var tableUrl = [
            { url: 'https://services6.arcgis.com/f36cxNuTmfCJN313/arcgis/rest/services/Εκδηλώσεις/FeatureServer/0/query', name: "Events" },
            { url: 'https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/0/query', name: "Church" },
            { url: 'https://services6.arcgis.com/f36cxNuTmfCJN313/ArcGIS/rest/services/POLITISTIKA/FeatureServer/1/query', name: "Museum" },
        ]

        // Οι παράμετροι.
        const params = {
            f: 'json',
            where: '1=1', // Επιστρέφει όλες τις εγγραφές
            outFields: '*', // Παίρνεις όλα τα πεδία
            returnGeometry: 'true', // Αν θες και γεωμετρία
            outSR: 4326 // Προβολικό σύστημα.
        };

        var data = []
        // Η συλλογή όλων των δεδομένων.
        for (let i in tableUrl) {
            let res = await firstValueFrom(this.http.get<any>(tableUrl[i].url, { params })) // Η κλήση για κάθε feature από το κάθε Layer.
            console.log(res)

            // Συλλογή των objectIds από τα features που έχουν attachments (εικόνες) έτσι ώστε να γίνει μαζική κλήση (μία κλήση) για να επιστρέψουν οι εικόνες του κάθε feature.
            let objectIds = []; // Συλλογή objectIds.
            for (let feature of res.features) { // Για κάθε feture του κάθε layer.
                feature.attachments = []; // Δημιουργία ενός πίνακα που θα συλλέγει τις εικόνες.
                const objectId = feature.attributes.OBJECTID; // Το objectId του feature.
                objectIds.push(objectId) // Ενσωμάτωση στον πίνακα συλλογής.
            }

            // Μαζική κλήση attachments (εικόνες).
            const attachmentUrl = tableUrl[i].url.replace('/query', `/queryAttachments`); // Δημιουργία endpoint για attachments (εικόνες) (το url που είχα, αντί για query -> queryAttachments).
            const attachmentParams = { f: 'json', returnUrl: true, objectIds: objectIds.join(',') }; // H μαζική κλήση των attachments (εικόνες) του κάθε Layer.
            var attachmentRes: any = await firstValueFrom(this.http.get<any>(attachmentUrl, { params: attachmentParams })); // Η μαζική κλήση attachments (εικόνες). 
            console.log(attachmentRes)

            // Αντιστοίχιση της κάθε εικόνας στο αντίστοιχο feature με βάση το objectId.
            for (let group of attachmentRes.attachmentGroups) {
                for (let feature of res.features) {
                    if (feature.attributes.OBJECTID == group.parentObjectId) {
                        for (let imgInfo of group.attachmentInfos) {
                            let objImages: any = {
                                image: imgInfo.url,
                                thumbImage: imgInfo.url, // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το Url.
                                alt: imgInfo.name, // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το alt.
                                title: imgInfo.name // Yποχρεωτικό το όνομα του πεδίου για να διαβάσει το title.
                            }
                            feature.attachments.push(objImages)
                        }
                    }
                }
            }

            // Τελικό αποτέλεσμα (Data: attribute, geometry, attachments)
            data.push({
                name: tableUrl[i].name,
                data: res.features
            });
        }
        this.dataServerAdmin.next(data); // Observable
        console.log(this.dataServerAdmin)
    }

    objectidDeleteEvent: any; // Το objectId του event που θα διαγραφεί.

    mapViewAdmin: any = null // Το view του χάρτη του Admin.

    latitudeAdmin: any; // Γεωγραφικό πλάτος (φ) - Υ Admin.
    longitudeAdmin: any; // Γεωγραφικό μήκος (λ) - Χ Admin

    statusTable: any = [] // Ο πίνακας με τις εκκρεμότητες

    openAcceptPopup = false; // Ενεργοποίηση popup "αποδοχή".
    openCancelPopup = false; // Ενεργοποίηση popup "ακύρωση".

    // Απαραίτητο για την μεταφορά συνάρτησης onAddButtonClick().
    private newPointInMap = new Subject<void>();
    newPointInMap$ = this.newPointInMap.asObservable();
    newPointInMapFunction() {
        this.newPointInMap.next();
    }

    openEventPopup = false; // Ορίζει αν το pupup προσθήκης θα αφορά νέο σημείο ή νεα εκδήλωση.

    serviceJsonValuesEvents: any; // Τα data των events add.
    serviceJsonValuesEventsUpdate: any // Τα data των events update.

    serviceJsonValuesPointsAdd: any // Τα data των points add.

    loadingAdmin = false; // Βοηθάει να φαίνεται ή να μη φαίνεται το Spinner στο Save.

    public popupAddEvent: MatDialogRef<FormAdminComponent> | null = null; // Για να κλείνω το Popup από άλλο Component.
    public popupEditEvents: MatDialogRef<EditEventsComponent> | null = null; // Για να κλείνω το Popup από άλλο Component.

    editObjectId: any; // Το objectId του event που θα τροποποιηθεί.

    objectidDeletePoint: any; // Το objectId του new Point που θα διαγραφεί.
    categoryDeletePoint: any; // Η κατηγορία (για να βρεθεί το url) του new Point που θα διαγραφεί.

    objectidAcceptPoint: any; // Το objectId του new Point που θα αποδεχτεί.
    categoryAcceptPoint: any; // Η κατηγορία (για να βρεθεί το url) του new Point που θα αποδεχτεί.
    longAcceptPoint: any; // Το Χ του new Point που θα αποδεχτεί.
    latAcceptPoint: any; // Το Υ του new Point που θα αποδεχτεί.


}
