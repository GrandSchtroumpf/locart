import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'la-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
