import { Component } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { ModalController} from '@ionic/angular';  
import { LoadingController } from '@ionic/angular';
import { CapacitorHttp } from '@capacitor/core';
import { GeoServiceService } from '../services/geo-service.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {

  listaGasolinerasESP:any
  listaBaratas:any 
  newMap!:any

  constructor(public modalCtrl: ModalController,private loadingCtrl: LoadingController, private geo: GeoServiceService) { }

  ngAfterContentInit() { this.openMap() }

  async openMap(){
    this.firstShowLoading()
    CapacitorHttp.get({url:'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/'})
      .then(response => {
        this.listaGasolinerasESP = response.data.ListaEESSPrecio
        console.log(response)
        this.printCurrentPosition() 
      })
    const coordinates = await Geolocation.getCurrentPosition();

    let mylatitude = coordinates.coords.latitude
    let mylongitude = coordinates.coords.longitude

    const apiKey = 'AIzaSyDZUlsrDtQK7noZv8Poj-jXFHjvDJO4gJc';
    const mapRef = document.getElementById('map');

    this.newMap = await GoogleMap.create({
      id: 'my-map', // Unique identifier for this map instance
      element: mapRef!, // reference to the capacitor-google-map element
      apiKey: apiKey, // Your Google Maps API Key
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: mylatitude,
          lng: mylongitude,
        },
        zoom: 10, // The initial zoom level to be rendered by the map
      },
    });

    this.newMap.initialize
  }

  async firstShowLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando resultados...',
      duration: 3000,
    });
    loading.present();
  }

  async printCurrentPosition() {GeoServiceService
    
    const coordinates = await Geolocation.getCurrentPosition();
    let mylatitude = coordinates.coords.latitude
    let mylongitude = coordinates.coords.longitude
 
    var temporalList = []

    for (var i of this.listaGasolinerasESP){
      i.temp=this.geo.getDistanceBetweenPoints(parseFloat(i['Latitud'].replace(/,/g, '.')),parseFloat(i['Longitud (WGS84)'].replace(/,/g, '.')),mylatitude,mylongitude)
      temporalList.push(i)
    }
   
    //ordenamos la lista temporal
    temporalList.sort(function (a:any, b:any) {
      // A va primero que B
      if (a.temp < b.temp)
          return -1;
      // B va primero que A
      else if (a.temp > b.temp)
          return 1;
      // A y B son iguales
      else 
          return 0;
    });

    this.listaBaratas=[]

    for(var i:any=0;i!=10;i++){
      this.listaBaratas.push(temporalList[i])
    }

    for (var i of this.listaBaratas)
    await this.newMap.addMarker({
      coordinate: {
        lat: parseFloat(i['Latitud'].replace(/,/g, '.')), 
        lng: parseFloat(i['Longitud (WGS84)'].replace(/,/g, '.'))
        
      },
      iconUrl: "../../assets/icon/fuel_station_icon.ico",
      iconSize: {
        width: 52,
        height: 52
      },
      title:i['Latitud'],
      snippet:i['Latitud'],
    })
  };


}
