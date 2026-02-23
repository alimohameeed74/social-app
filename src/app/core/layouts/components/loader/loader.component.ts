import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../services/flowbit/flowbit.service.js';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
