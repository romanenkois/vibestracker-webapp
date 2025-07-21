export type LoadingState =
  | 'idle'
  | 'nothing-to-load' // used, when we know that there is nothing to load, before we even try

  | 'loading'
  | 'appending' // used, when we have loaded something, and now loading more
  | 'reloading' // used when we must reload new data

  | 'resolved' // used when the loading is finished, but could be loaded again
  | 'all-resolved' // used when there is no more to append
  | 'resolved-empty' // the data was not loaded, but the request was send successfully

  | 'error';

export type UploadingStatus =
  | 'idle'
  | 'uploading'
  | 'resolved'
  | 'error'

export type ExtendedHistoryPreparingState =
  | 'idle'
  | 'started-preparing'
  | 'unzipped'
  | 'merged'
  | 'filtered'
  | 'transformed'
  | 'sorted'
  | 'all-prepared'
  | 'error';

  export type PreloadUserLoginState = 'idle' | 'loading' | 'resolved' | 'rejected';
