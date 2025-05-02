export type LoadingState =
  | 'idle'
  | 'loading'
  | 'resolved'
  | 'appending'
  | 'all-resolved' /* is used when there is no more to append */
  | 'error';

export type ExtendedHistoryPreparingState =
  | 'idle'
  | 'started-preparing'
  | 'unzipped'
  | 'merged'
  | 'filtered'
  | 'transformed'
  | 'sorted'
  | 'all-prepared'
  | 'uploading'
  | 'all-resolved'
  | 'error';
