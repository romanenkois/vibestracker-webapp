import { WritableSignal } from '@angular/core';
import { Subscriber } from 'rxjs';

import { DeletingStatusEnum, LoadingStatusEnum, UploadingStatusEnum } from '@types';

// export function successResponseHandler<Respose>(params: {
//   observable: Subscriber<LoadingStatusEnum>;
//   response: { [key: string]: Respose };
//   responseObjectName: string;
//   signalToWrite: WritableSignal<Respose>;
// }) {
//   const dataResponse = params.response[params.responseObjectName];
//   const dataIsArray = Array.isArray(dataResponse);

//   if (dataIsArray) {
//     if (dataResponse.length) {
//       params.signalToWrite.set(dataResponse);
//       params.observable.next(LoadingStatusEnum.Resolved);
//     } else {
//       params.observable.next(LoadingStatusEnum.ResolvedEmpty);
//     }
//   } else {
//     if (dataResponse) {
//       params.signalToWrite.set(dataResponse);
//       params.observable.next(LoadingStatusEnum.Resolved);
//     }
//   }
// }

// export function apiHandler() {}

// export function errorResponseHandler<TStatus extends LoadingStatusEnum | UploadingStatusEnum | DeletingStatusEnum>(params: {
//   observable: Subscriber<TStatus>;

// }

