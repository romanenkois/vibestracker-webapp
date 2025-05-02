import { Injectable } from '@angular/core';
import JSZip from 'jszip';
import { Observable } from 'rxjs';
import { ExtendedHistoryPreparingState, ExtendedStreamingHistoryDTO } from '@types';

@Injectable({
  providedIn: 'root',
})
export class ExtendedHistoryPreparerService {
  public FullyProcessFile(zipFile: File): Observable<ExtendedHistoryPreparingState> {
    return new Observable<ExtendedHistoryPreparingState>((observer) => {
      observer.next('started-preparing');

      // i am sorry for whoever will read this

      this.extractStreamingHistory(zipFile)
        .then((unzippedFiles) => {
          observer.next('unzipped');
          return this.mergeJsonFiles(unzippedFiles);
        })
        .then((mergedData) => {
          observer.next('merged');
          const dataSizeMB = (JSON.stringify(mergedData).length / (1024 * 1024)).toFixed(2);
          console.log('Merged data:', mergedData.length, 'items,', dataSizeMB, 'MB');
          return this.filterData(mergedData);
        })
        .then((filteredData) => {
          observer.next('filtered');
          const dataSizeMB = (JSON.stringify(filteredData).length / (1024 * 1024)).toFixed(2);
          console.log('Filtered data:', filteredData.length, 'items,', dataSizeMB, 'MB');
          return this.transformData(filteredData);
        })
        .then((transformedData) => {
          observer.next('transformed');
          const dataSizeMB = (JSON.stringify(transformedData).length / (1024 * 1024)).toFixed(2);
          console.log(`Transformed data: ${dataSizeMB}, MB`);
          return this.sortData(transformedData);
        })
        .then((sortedData)=>{
          observer.next('sorted');
          const dataSizeMB = (JSON.stringify(sortedData).length / (1024 * 1024)).toFixed(2);
          console.log(`Sorted data: ${dataSizeMB} MB`);
          observer.next('all-resolved');
          observer.complete();
        })

        .catch((error) => observer.error(error));

      return () => {}; // Cleanup function
    });
  }

  private async extractStreamingHistory(zipFile: File): Promise<any[]> {
    const zip = await JSZip.loadAsync(zipFile);
    const jsonFiles: any[] = [];

    for (const fileName of Object.keys(zip.files)) {
      // console.log(fileName);
      if (
        fileName.startsWith(
          'Spotify Extended Streaming History/Streaming_History_Audio_',
        ) &&
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

  private async mergeJsonFiles(jsonFiles: any[]): Promise<any> {
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

  private async filterData(data: any[]): Promise<any[]> {
    // Define minimum timestamp (January 1, 2008)
    const minTimestamp = new Date('2008-01-01T00:00:00Z').getTime();
    // Get current timestamp for future date validation
    const currentTimestamp = new Date().getTime();

    const filteredData: ExtendedStreamingHistoryDTO[] = data.filter(
      (item: ExtendedStreamingHistoryDTO) => {
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
      },
    );
    return filteredData;
  }

  private async transformData(data: any[]): Promise<any[]> {
    return data.map((item: ExtendedStreamingHistoryDTO) => {
      return {
        ts: item.ts,
        platform: item.platform,
        ms_played: item.ms_played,
        conn_country: item.conn_country,
        track_name: item.master_metadata_track_name,
        track_artist: item.master_metadata_album_artist_name,
        track_album: item.master_metadata_album_album_name,
        uri: item.spotify_track_uri.replace('spotify:track:', ''),
        reason_start: item.reason_start,
        reason_end: item.reason_end,
        shuffle: item.shuffle,
        skipped: item.skipped,
      };
    });
  }

  private async sortData(data: any[]): Promise<any[]> {
    return data.sort((a: ExtendedStreamingHistoryDTO, b: ExtendedStreamingHistoryDTO) => {
      const dateA = new Date(a.ts).getTime();
      const dateB = new Date(b.ts).getTime();
      return dateA - dateB;
    });
  }

  // TODO: remove
  // is used for testing
  private download(data: string): void {
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
