import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SingletonService } from '../service/singleton.service';
import { TransaksiService } from '../service/transaksi.service';


@Component({
  standalone: false,
  selector: 'app-konfirmasi',
  templateUrl: './konfirmasi.page.html',
  styleUrls: ['./konfirmasi.page.scss'],
})
export class KonfirmasiPage implements OnInit {
  // pesanan: any= null;
  transaksiList : any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,

    private transaksiService:TransaksiService,
    private singletonService:SingletonService
  ) {}

  ngOnInit() {
    this.transaksiService.all()
    .subscribe(response=>{
      response.data.forEach((transaksiData:any) => {
        if (transaksiData.status_pembayaran != "selesai"){
          this.transaksiList.push(transaksiData);
        }
      });
    })
    // this.pesanan = this.singletonService.temps['lastTransaksi'];
    
  }

  konfirmasiPesanan(transaksi_id:any) {
    this.transaksiService.update(transaksi_id, {
      status_pembayaran : 'selesai'
    })
    .subscribe(response=>{
      console.log(response);
      
    });

    // Navigasi ke halaman pesanan
    this.router.navigate(['/pesanan']);
  }
}
