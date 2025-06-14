import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KonfirmasiPage } from './konfirmasi.page';

describe('KonfirmasiPage', () => {
  let component: KonfirmasiPage;
  let fixture: ComponentFixture<KonfirmasiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KonfirmasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
