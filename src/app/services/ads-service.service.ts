import { Injectable } from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, 
  AdMobBannerSize, AdOptions, AdLoadInfo, InterstitialAdPluginEvents } from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root'
})
export class AdsServiceService {

  constructor() {   }

  adsInitialize(){
    console.log("Admob initializing ...")
    AdMob.initialize({})
  }

  banner(){
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      // Subscribe Banner Event Listener
    });

    AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
      // Subscribe Change Banner Size
    });

    const options: BannerAdOptions = {
      adId: 'ca-app-pub-9669223673392187/9855701262',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
      // npa: true
    };
    AdMob.showBanner(options);
}

async interstitial(): Promise<void> {
  AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
    // Subscribe prepared interstitial
  });

  const options: AdOptions = {
    adId: 'ca-app-pub-9669223673392187/7144997197',
    isTesting: true
    // npa: true
  };
  await AdMob.prepareInterstitial(options);
  await AdMob.showInterstitial();
}

}
