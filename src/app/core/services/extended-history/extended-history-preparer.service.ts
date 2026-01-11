import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import JSZip from 'jszip';

import {
  ExtendedHistoryPreparingStateEnum,
  ExtendedStreamingHistoryDTO,
  ExtendedStreamingHistoryPrepared,
} from '@types';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryPreparerService {
  public FullyProcessFile(
    zipFile: File
  ): Observable<{ status: ExtendedHistoryPreparingStateEnum; data?: ExtendedStreamingHistoryPrepared[] }> {
    return new Observable<{
      status: ExtendedHistoryPreparingStateEnum;
      data?: ExtendedStreamingHistoryPrepared[];
    }>((observer) => {
      observer.next({ status: ExtendedHistoryPreparingStateEnum.StartedPreparing });

      // i am sorry, for whoever will read this

      this.extractStreamingHistory(zipFile)
        .then((unzippedFiles) => {
          if (unzippedFiles.length === 0) {
            observer.next({ status: ExtendedHistoryPreparingStateEnum.Error });
            observer.complete();
            throw new Error('No valid json files found in the zip archive');
          }
          observer.next({ status: ExtendedHistoryPreparingStateEnum.Unzipped });
          return this.mergeJsonFiles(unzippedFiles);
        })
        .then((mergedData) => {
          if (mergedData.length === 0) {
            observer.next({ status: ExtendedHistoryPreparingStateEnum.Error });
            observer.complete();
            throw new Error('No data in merged json files');
          }
          observer.next({ status: ExtendedHistoryPreparingStateEnum.Merged });
          return this.filterData(mergedData);
        })
        .then((filteredData) => {
          if (filteredData.length === 0) {
            observer.next({ status: ExtendedHistoryPreparingStateEnum.Error });
            observer.complete();
            throw new Error('All data has been discarded');
          }
          observer.next({ status: ExtendedHistoryPreparingStateEnum.Filtered });
          return this.transformData(filteredData);
        })
        .then((transformedData) => {
          observer.next({ status: ExtendedHistoryPreparingStateEnum.Transformed });
          return this.sortData(transformedData);
        })
        .then((sortedData: ExtendedStreamingHistoryPrepared[]) => {
          observer.next({ status: ExtendedHistoryPreparingStateEnum.Sorted });
          observer.next({
            status: ExtendedHistoryPreparingStateEnum.AllPrepared,
            data: sortedData,
          });
          observer.complete();
        })

        .catch((error) => {
          console.error('Error processing extended streaming history file:', error);
          observer.next(error);
          observer.complete();
        });

      return;

      // return () => {}; // Cleanup function
    });
  }

  // #region Private methods

  // unzips archive, and take sonly streaming history files
  private async extractStreamingHistory(zipFile: File): Promise<unknown[]> {
    const zip = await JSZip.loadAsync(zipFile);
    const jsonFiles: unknown[] = [];

    for (const fileName of Object.keys(zip.files)) {
      // console.log(fileName);
      if (
        fileName.startsWith('Spotify Extended Streaming History/Streaming_History_Audio_') &&
        fileName.endsWith('.json')
      ) {
        // console.log('Found JSON file:', fileName);
        const fileData = await zip.files[fileName].async('string');
        try {
          const json = JSON.parse(fileData);
          jsonFiles.push(json);
        } catch (e) {
          console.error(`Failed to parse JSON from ${fileName}`, e);
        }
      }
    }

    return jsonFiles;
  }

  // just merges all the json files into one
  private async mergeJsonFiles(jsonFiles: any[]): Promise<unknown[]> {
    const mergedData = jsonFiles.reduce((acc, file) => {
      if (Array.isArray(file)) {
        return acc.concat(file);
      } else if (typeof file === 'object') {
        return { ...acc, ...file };
      }
      return acc;
    }, []);
    return mergedData;
  }

  // filters the data in different ways
  private async filterData(data: any[]): Promise<ExtendedStreamingHistoryDTO[]> {
    // data = data as ExtendedStreamingHistoryDTO[];
    // Define minimum timestamp (January 1, 2008)
    const minTimestamp = new Date('2008-01-01T00:00:00Z').getTime();
    // Get current timestamp for future date validation
    const currentTimestamp = new Date().getTime();

    const filteredData: ExtendedStreamingHistoryDTO[] = data.filter((item) => {
      // Convert ISO string timestamp to milliseconds
      const itemTimestamp = new Date(item.ts).getTime();

      return (
        // we check if the most crucial fields are present, and not nulled
        'ts' in item &&
        item.ts != null &&
        'platform' in item &&
        item.platform != null &&
        'ms_played' in item &&
        item.ms_played != null &&
        'conn_country' in item &&
        item.conn_country != null &&
        'master_metadata_track_name' in item &&
        item.master_metadata_track_name != null &&
        'master_metadata_album_artist_name' in item &&
        item.master_metadata_album_artist_name != null &&
        'master_metadata_album_album_name' in item &&
        item.master_metadata_album_album_name != null &&
        'spotify_track_uri' in item &&
        item.spotify_track_uri != null &&
        // just  to be sure, as its used in next step
        item.spotify_track_uri.startsWith('spotify:track:') &&
        'reason_start' in item &&
        item.reason_start != null &&
        'reason_end' in item &&
        item.reason_end != null &&
        'shuffle' in item && // shuffle can be null by design
        'skipped' in item && // skipped can be null by design
        // we skip the tracks, that were skipped too early
        item.ms_played > 20000 &&
        // we skip the absurdly long records
        // 1 hour is the most we tolerate
        item.ms_played < 3600000 &&
        // check if timestamp is before Jan 1, 2008
        // it's the spotify release date
        itemTimestamp > minTimestamp &&
        //check if the timestamp is not in the future
        itemTimestamp <= currentTimestamp
      );
    });
    return filteredData;
  }

  // transforms the columns
  private async transformData(data: ExtendedStreamingHistoryDTO[]): Promise<ExtendedStreamingHistoryPrepared[]> {
    return data.map((item) => {
      return {
        ts: item.ts,
        platform: item.platform,
        ms_played: item.ms_played,
        conn_country: item.conn_country,
        uri: item.spotify_track_uri.replace('spotify:track:', ''),
        reason_start: item.reason_start,
        reason_end: item.reason_end,
        shuffle: item.shuffle,
        skipped: item.skipped,
      };
    });
  }

  // sorts by the timestamp, older go first
  private async sortData(data: ExtendedStreamingHistoryPrepared[]): Promise<ExtendedStreamingHistoryPrepared[]> {
    return data.sort((a: ExtendedStreamingHistoryPrepared, b: ExtendedStreamingHistoryPrepared) => {
      const dateA = new Date(a.ts).getTime();
      const dateB = new Date(b.ts).getTime();
      return dateA - dateB;
    });
  }

  // #endregion Private methods

  // TODO: remove
  // is used for testing
  private download(data: string) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'spotify-listening-history.json');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
