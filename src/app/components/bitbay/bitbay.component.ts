import { Component, OnInit } from '@angular/core';

import { BitBayService } from '../../services/bitbay.service';

@Component({
  selector: 'app-bitbay',
  templateUrl: './bitbay.component.html',
  styleUrls: ['./bitbay.component.scss']
})
export class BitBayComponent implements OnInit {


  constructor(private bitBayService: BitBayService) { }

  ngOnInit() {

  }

}
