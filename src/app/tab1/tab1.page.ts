import { Component } from '@angular/core';
import { ModalController} from '@ionic/angular';  
import { ModalPage } from '../modal/modal.page';  
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';
import { CapacitorHttp } from '@capacitor/core';
import { AdsServiceService } from '../services/ads-service.service';
import { GeoServiceService } from '../services/geo-service.service';
import  dataGasolinerasJSON  from '../db/gasolineras.json';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  modalObj: any;
  listaGasolinerasESP:any
  listaBaratas:any = []

  constructor(
    public modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    public ads:AdsServiceService,
    private geo: GeoServiceService
    ) {
    
    this.logCurrentNetworkStatus()

    ads.adsInitialize()
    ads.banner()
    ads.interstitial()
    
    this.printCurrentPosition('') 
    this.firstShowLoading()
  }

  async firstShowLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando resultados...',
      duration: 2000,
    });
    loading.present();
  }

  async showModal() {  
    const modal = await this.modalCtrl.create({  
      component: ModalPage  ,
      componentProps:{
        id: this.modalObj
      }
    });  
   
    return await modal.present();  
  }  

  popup(id:string){
    var i!:any
    for (i of this.listaBaratas){
      if(i.IDEESS===id){
        this.modalObj = i
      }
    }
    this.showModal()
  }

  async logCurrentNetworkStatus() {
    const status = await Network.getStatus();
    if(status.connected===false) {
      const alert = await this.alertController.create({
        header: 'Error',
        subHeader: 'No tiene conexión a internet',
        message: 'La aplicación no puede descargar datos',
        buttons: ['OK'],
      });
  
      await alert.present();
    }
  };

  async printCurrentPosition(refresh:string) {
    if(refresh==='refresh'){ this.firstShowLoading() }
    const coordinates = await Geolocation.getCurrentPosition();
    let mylatitude = coordinates.coords.latitude
    let mylongitude = coordinates.coords.longitude
    
    interface templist{
      latitud:string,
      longitud:string,
      id:string,
      idMunicipio:string,
      temp:string
    }
    var temporalList:templist[] = []

    let listIdGas=dataGasolinerasJSON.dataGasolineras
    for (var i of listIdGas){
      let temp=this.geo.getDistanceBetweenPoints(parseFloat(i['latitud'].replace(/,/g, '.')),parseFloat(i['longitud'].replace(/,/g, '.')),mylatitude,mylongitude)
      let aux:templist={
        latitud: i.latitud,
        longitud: i.longitud,
        id: i.id,
        idMunicipio: i.idMunicipio,
        temp: temp
      }
      temporalList.push(aux)
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
    
    let listaIdBaratas=[]

    for(var j:any=0;j!=10;j++){
      listaIdBaratas.push(temporalList[j])
    }

    // Ahora que tenemos la lista de las más baratas, vamos a extraer sus municipios en una lista de mubnicipios, 
    // para luego filtrar por el.

    let listaMunicipios:any = []
    for(let barata of listaIdBaratas){
      if(!listaMunicipios.includes(barata.idMunicipio)) listaMunicipios.push(barata.idMunicipio)
    }

    // Ahora llamaremos filtrando por municipio con la lista de municipios que teniamos.

    for(let municipio of listaMunicipios){
      await CapacitorHttp.get({
       url:'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/'+municipio
      }).then(response => {
        let ListaEESSPrecio = response.data.ListaEESSPrecio
        for (let eess of ListaEESSPrecio){
          this.listaBaratas.push(eess)
        }
      })
    }

    console.log(this.listaBaratas)
    // Ordenamos la lista por el precio más económico
    
    this.listaBaratas.sort(function (a:any, b:any) {
      // A va primero que B
      if (a['Precio Gasolina 95 E5'] < b['Precio Gasolina 95 E5'])
          return -1;
      // B va primero que A
      else if (a['Precio Gasolina 95 E5'] > b['Precio Gasolina 95 E5'])
          return 1;
      // A y B son iguales
      else 
          return 0;
    });
  
  };
}
