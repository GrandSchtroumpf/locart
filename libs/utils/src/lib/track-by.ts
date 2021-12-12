import { KeyValue } from "@angular/common";

export const trackById = <T extends { id: string }>(i: number, item: T) => item.id;
export const trackByPath = <T extends { path: string }>(i: number, item: T) => item.path;
export const trackByKey = (i: number, item: KeyValue<string, unknown>) => item.key;
export const trackByIndex = (i: number) => i;