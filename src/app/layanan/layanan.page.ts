import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MejaService } from '../service/meja.service';
import { SingletonService } from '../service/singleton.service';


@Component({
  standalone:false,
  selector: 'app-layanan',
  templateUrl: './layanan.page.html',
  styleUrls: ['./layanan.page.scss'],
})
export class LayananPage implements OnInit {
  jenisLayanan: string = '';

  mejaList:any[]=[];
  selectedMeja: any = null;
  
  constructor(
    private ngZone :NgZone,
    private route: ActivatedRoute,
    private router: Router,

    private mejaService:MejaService,
    private singletonService:SingletonService
  ) { }

  ngOnInit() {
    this.jenisLayanan = this.route.snapshot.paramMap.get('jenis')!;

    this.ngZone.run(()=>{
      this.mejaService.all()
      .subscribe(response=>{
        this.mejaList.push(...response.data);
      })
    })
  }

  onSelectMeja(meja: any) {
    if (meja.status_meja === 'tersedia') {
      this.selectedMeja = meja;
    }
  }

  tambahMeja() {
    if (this.selectedMeja) {
      this.singletonService.temps = {
        selectedMeja : this.selectedMeja,
        jenisLayanan : this.jenisLayanan
      };
      this.router.navigate(['/menu']);
    } else {
      alert('Silakan pilih meja terlebih dahulu');
    }
  }
  
  masukKeMenuLangsung() {
    this.singletonService.temps = {
        selectedMeja : this.selectedMeja,
        jenisLayanan : 'takeaway'
      };
    this.router.navigate(['/menu']);
  }

}
