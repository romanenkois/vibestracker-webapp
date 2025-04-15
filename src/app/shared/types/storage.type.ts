import { WritableSignal } from "@angular/core";
import { SimpleTimeFrame } from "@types";

export type UserTopItemsSimpleStorageType<T> = WritableSignal<{
  [term in SimpleTimeFrame]?: Array<T>;
}>
