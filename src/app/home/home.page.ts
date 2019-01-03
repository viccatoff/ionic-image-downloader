import { Component } from '@angular/core';

import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { HTTP } from '@ionic-native/http/ngx';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    public imageUrl;
    public imageShow = false;
    readonly targetDir;

    constructor(
        private httpNative: HTTP,
    ) {
        this.targetDir = FilesystemDirectory.Data;
    }

    public getData(): void {
        this.download('http://personal.psu.edu/xqz5228/jpg.jpg').then(imageUrl => {
          console.log('imageUrl', imageUrl);

          this.imageUrl = imageUrl;
          this.imageShow = true;
        }).catch(e => {
          console.log('error', e);
        });
    }

    public download(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const fileName = 'test2.jpg';

            Filesystem.getUri({
                directory: this.targetDir,
                path: ''
            }).then((result) => {
                const targetPath = result.uri + '/' + fileName;
                console.log('getUri res', result);

                this.httpNative.downloadFile(url, null, null, targetPath).then((res) => {
                    console.log('downloaded', res);
                    if (res) {
                        resolve((<any>window).Ionic.WebView.convertFileSrc(targetPath));
                    } else {
                        reject();
                    }
                }).catch(reject);

            }).catch(reject);
        });
    }

}
