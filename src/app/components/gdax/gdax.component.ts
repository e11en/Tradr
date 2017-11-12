import { Component, OnInit } from '@angular/core';

import { GdaxService } from '../../services/gdax.service';

@Component({
  selector: 'app-gdax',
  templateUrl: './gdax.component.html',
  styleUrls: ['./gdax.component.scss']
})
export class GdaxComponent implements OnInit {

  constructor(private gdaxService: GdaxService) { }

  ngOnInit() {

  }

}
