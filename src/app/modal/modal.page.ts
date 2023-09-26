import { Component, OnInit } from '@angular/core';  
import { ModalController , NavParams} from '@ionic/angular';  


@Component({  
  selector: 'app-modal',  
  templateUrl: './modal.page.html',  
  styleUrls: ['./modal.page.scss'],  
})  
export class ModalPage implements OnInit {  
  
  modalObj: any;

  constructor(public modalCtrl: ModalController,private navParams: NavParams) {}  
  
  ngOnInit() {  
    let data = this.navParams.data
    this.modalObj = data['id']
    console.log(this.modalObj)
  }  
  dismiss() {  
    this.modalCtrl.dismiss();  
  }  
  public setObj(){

  }
}  