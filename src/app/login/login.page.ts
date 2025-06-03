import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private alertController: AlertController, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nipRegex = /^\d{8,12}$/;

    if (!this.username || !this.password) {
      await this.showAlert('Login Gagal', 'Username dan password wajib diisi.');
      return;
    }

    if (!emailRegex.test(this.username)) {
      await this.showAlert('Format Salah', 'Username harus berupa email.');
      return;
    }

    if (!nipRegex.test(this.password)) {
      await this.showAlert('Format Salah', 'Password harus berupa NIP (8–12 digit angka).');
      return;
    }

    if (this.username === 'admin@example.com' && this.password === '12345678') {
      await this.showAlert('Login Berhasil', 'Selamat datang kembali!');
      this.router.navigate(['/home']);
    } else {
      await this.showAlert('Login Gagal', 'Email atau NIP salah.');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
