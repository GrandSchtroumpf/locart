import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

// Do not provided in root to avoid root dep on HttpClientModule
@Injectable()
export class IconService {
  registered: string[] = [];
  constructor(private registry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  register(names: string | string[]) {
    const run = (name: string) => {
      if (this.registered.includes(name)) return;
      const path = `/assets/mat-icons/${name}.svg`;
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(path);
      this.registry.addSvgIcon(name, url);
      this.registered.push(name);
    };
    Array.isArray(names) ? names.forEach(run) : run(names);
  }
}
