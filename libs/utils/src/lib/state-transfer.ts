import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class StateTransferService {
  constructor(
    @Inject(PLATFORM_ID) private plateformId: object,
    private transferState: TransferState
  ) {}

  set<T>(id: string, value: T) {
    if (isPlatformServer(this.plateformId)) {
      const key = makeStateKey<T>(id);
      this.transferState.set(key, value);
    }
    return value;
  }

  get<T>(id: string, defaultValue?: T) {
    if (isPlatformBrowser(this.plateformId)) {
      const key = makeStateKey<T>(id);
      if (this.transferState.hasKey(key)) {
        const value = this.transferState.get(key, defaultValue);
        this.transferState.remove(key);
        return value;
      }
    }
    return defaultValue;
  }
}
