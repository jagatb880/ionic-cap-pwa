import { Component } from '@angular/core';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  type = 'native';

  constructor() {}

  async share() {
    let shareRet = await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: 'http://ionicframework.com/',
      dialogTitle: 'Share with buddies'
    });
  }

  itemCheck() {
    console.log('item visible');
  }

  segmentChanged(event) {
    console.log(event.detail.value);
    this.type = event.detail.value;
  }

}
