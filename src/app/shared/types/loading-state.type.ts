export type LoadingState =
  | 'idle'
  | 'loading'
  | 'resolved' // used when the loading is finished, but could be loaded again
  | 'appending' // used, when we have loaded something, and now loading more
  | 'all-resolved' // used when there is no more to append
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
