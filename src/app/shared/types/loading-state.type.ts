export enum LoadingStatusEnum {
  Idle = 'idle',
  NothingToLoad = 'nothing-to-load', // used, when we know that there is nothing to load, before we even try
  Loading = 'loading',
  Finalizing = 'finalizing', // used, when the main loading is done, but some final operations are being made
  Appending = 'appending', // used, when we have loaded something, and now loading more
  Reloading = 'reloading', // used when we must reload new data
  Resolved = 'resolved', // used when the loading is finished, but could be loaded again
  AllResolved = 'all-resolved', // used when there is no more to append
  ResolvedEmpty = 'resolved-empty', // the data was not loaded, but the request was send successfully
  Error = 'error',
}

export enum LoadingStatusSimpleEnum {
  Idle = 'idle',
  Loading = 'loading',
  Resolved = 'resolved',
  Error = 'error',
}

export enum UploadingStatusEnum {
  Idle = 'idle',
  Uploading = 'uploading',
  Resolved = 'resolved',
  Error = 'error',
}
export enum DeletingStatusEnum {
  Idle = 'idle',
  Deleting = 'deleting',
  Deleted = 'deleted',
  Error = 'error',
}

export enum PreloadUserLoginStatusEnum {
  Idle = 'idle',
  Loading = 'loading',
  Resolved = 'resolved',
  Rejected = 'rejected',
}

export enum ExtendedHistoryPreparingStateEnum {
  Idle = 'idle',
  StartedPreparing = 'started-preparing',
  Unzipped = 'unzipped',
  Merged = 'merged',
  Filtered = 'filtered',
  Transformed = 'transformed',
  Sorted = 'sorted',
  AllPrepared = 'all-prepared',
  Error = 'error',
}
