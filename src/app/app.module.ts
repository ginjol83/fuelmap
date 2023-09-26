import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AdsServiceService } from './services/ads-service.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeoServiceService } from './services/geo-service.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },AdsServiceService,GeoServiceService],
  bootstrap: [AppComponent],
})
export class AppModule {}
