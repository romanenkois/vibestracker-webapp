import { Component, inject, OnInit } from '@angular/core';
import { ExtendedHistoryService } from '@services';
import { Track } from '@types';

@Component({
  selector: 'app-user-top-extended',
  imports: [],
  templateUrl: './user-top-extended.html',
  styleUrl: './user-top-extended.scss',
})
export class UserTopExtended implements OnInit {
  private extendedHistoryService: ExtendedHistoryService = inject(
    ExtendedHistoryService,
  );

  topTracks: Track[] = [];

  ngOnInit() {
    // if (this.extendedHistoryService.userExtendedData().length > 0) {
    this.extendedHistoryService
      .getUserTopTracks()
      .subscribe((tracks: Track[]) => {
        this.topTracks = tracks;
      })
    }
  // }
}
