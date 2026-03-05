import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="map" style="height: 450px; width: 100%;"></div>`
})
export class MapComponent implements OnInit {

  @Input() lat!: number;
  @Input() lng!: number;

  ngOnInit(): void {
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    const map = L.map('map').setView([this.lat, this.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([this.lat, this.lng], { icon: defaultIcon })
      .addTo(map)
      .openPopup();
  }
}