import { Pipe, NgModule } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";

@Pipe({ name: 'static' })
export class StaticPipe {
  constructor(
    private transloco: TranslocoService
  ) { }
  transform(key: string) {
    return this.transloco.translate(`static.${key}`)
  }
}

@NgModule({
  declarations: [StaticPipe],
  exports: [StaticPipe]
})
export class StaticPipeModule {

}
