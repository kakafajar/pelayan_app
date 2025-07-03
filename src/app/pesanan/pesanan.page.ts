import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

import { AuthService } from '../service/auth.service';
import { TransaksiService } from '../service/transaksi.service';
import { OrderService } from '../service/order.service';

@Component({
  standalone: false,
  selector: 'app-pesanan',
  templateUrl: './pesanan.page.html',
  styleUrls: ['./pesanan.page.scss'],
})
export class PesananPage {
  @ViewChild(IonModal) buktiPembayaranModal !: IonModal;

  currentBuktiTransaksiData = {
    index : 0,
    fileBukti : null,
    status_pembayaran : null
  };
  transaksiList : any[] = [];
  statusFilter: string = 'semua';
  previewImage:any;

  constructor(
    private alertController: AlertController,

    private authService:AuthService,
    private transaksiService:TransaksiService,
    // private mejaService:MejaService,
    private orderService:OrderService
  ){}

  ionViewWillEnter(){
    this.transaksiList =[];
    this.transaksiService.all()
    .subscribe(response=>{
      this.transaksiList.push(...response.data.reverse());
      // console.log(response.data);
      
    })
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'proses': return 'warning';
      // case 'proses': return 'primary';
      case 'sudah dibuat': return 'success';
      case 'selesai': return 'primary';
      // case 'bayar': return 'tertiary';
      default: return 'medium';
    }
  }

  logout(){
    this.authService.logout();
  }

  getBuktiFileImage(){
    if (this.currentBuktiTransaksiData.fileBukti){
      return this.previewImage;
    }
    else if (this.transaksiList[this.currentBuktiTransaksiData.index].bukti_pembayaran){
      return this.transaksiList[this.currentBuktiTransaksiData.index].bukti_pembayaran;
    }
    return '';
  }

  onBuktiFileChange(event:any){
    this.currentBuktiTransaksiData.fileBukti = event.target.files[0]
    const file = new FileReader();

    file.onload = (e:any)=>{
      this.previewImage = e.target.result;
    }

    file.readAsDataURL(event.target.files[0]);
  }

  setBuktiModal(transaksi_index:any){
    this.currentBuktiTransaksiData.index = transaksi_index;
    this.buktiPembayaranModal.present();
  }

  konfirmasiBuktiPembayaran(event:CustomEvent<OverlayEventDetail>){
    console.log(event.detail);
    
    if (event.detail.role === 'save') {
      const formData = new FormData();
      const bukti :any= this.currentBuktiTransaksiData.fileBukti;
      const status : any = this.currentBuktiTransaksiData.status_pembayaran;

      if (bukti != null){
        formData.append("bukti_pembayaran", bukti);
      }
      if (status != null){
        formData.append("status_pembayaran", status);
      }
      
      this.transaksiService.update(this.transaksiList[this.currentBuktiTransaksiData.index].id, formData)
      .subscribe(response=>{
        console.log(response);
        const transaksi = this.transaksiList[this.currentBuktiTransaksiData.index];
        transaksi.bukti_pembayaran = response.data.bukti_pembayaran;
        transaksi.status_pembayaran = response.data.status_pembayaran;
      },async error=>{
        const alert = await this.alertController.create({
          header: "error",
          message: error.message
        })
        await alert.present();
      });
      
    }
    this.currentBuktiTransaksiData.fileBukti = null;
    this.currentBuktiTransaksiData.status_pembayaran = null;
  }

  dismissBukti(response:string){
    this.buktiPembayaranModal.dismiss(null, response);
  }

  async finishOrder(transaksi_index: any) {
    const alert = await this.alertController.create({
      header: 'Finish Order',
      message: 'Apakah Meja sudah tersedia?',
      buttons: [
        {
          text: 'Belum',
          role: 'cancel'
        },
        {
          text: 'Sudah',
          handler: ()=>{
            this.orderService.update(this.transaksiList[transaksi_index].order.id, {
              status_order : "selesai"
            })
            .subscribe((response)=>{
              // console.log(response);
              
              ;this.transaksiList[transaksi_index].order.status_order = response.data.status_order;
            }, error=>{
              console.log(error);
              
            });
          }
        }
      ]
    });

    await alert.present();
  }


  hasFilteredTransaksi(): boolean {
    return this.transaksiList.some(t =>
      this.statusFilter === 'semua' ||
      t?.order?.status_order?.toLowerCase() === this.statusFilter
    );
  }

}
