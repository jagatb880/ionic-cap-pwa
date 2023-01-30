import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
// import { isPlatform } from '@ionic/angular';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  selectImage: any = {};

  constructor() { }

  ngOnInit() {
  }

  checkPlatformForWeb() {
    if(Capacitor.getPlatform() == 'web') return true;
    return false;
  }

  async getPhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      // allowEditing: true,
      source: CameraSource.Prompt,
      width: 600,
      resultType: this.checkPlatformForWeb() ? CameraResultType.DataUrl : CameraResultType.Uri
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    console.log('image: ', image);
    // this.selectImage = image.webPath;
    this.selectImage = image;
    // if(this.checkPlatformForWeb()) this.selectImage.webPath = this.selectImage.dataUrl;

    // Can be set to the src of an image now
    // imageElement.src = imageUrl;

    if(this.checkPlatformForWeb()) this.shareViaWeb();
    else this.nativeDeviceShare();
    
  }  

  async nativeDeviceShare() {
    let shareRet = await Share.share({
      title: 'Image Sharing',
      text: 'Share this Image',
      url: this.selectImage?.path,
      dialogTitle: 'Image Sharing',
    });
  }

  srcToFile(src, fileName, mimeType) {
    return (fetch(src)
        .then((res) => { return res.arrayBuffer(); })
        .then((buf) => { return new File([buf], fileName, {type:mimeType}); })
    );
  }

  async shareViaWeb() {
    try {
      const imageFile = await this.srcToFile(this.selectImage.dataUrl, 'shareImage.png', 'image/png');
      console.log('imageFile: ', imageFile);
      let filesArray = [];
      filesArray[0] = imageFile;
      const result = await navigator.share({
        files: filesArray,
        title: 'Share this image',
        text: 'Share via web',
      });
      console.log('Share successful', result);
    } catch(e) {
      console.log('Share failed', e);
    }
  }

}
