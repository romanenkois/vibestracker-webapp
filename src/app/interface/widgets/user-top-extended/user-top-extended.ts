import { Component, computed, inject, OnInit } from '@angular/core';
import { SpotifyItemsCommand } from '@commands';
import { ExtendedHistoryService } from '@services';
import { SpotifyItemsStorage } from '@storage';
import { LoadingState, Track } from '@types';

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
  private readonly spotifyItemsStorage: SpotifyItemsStorage =
    inject(SpotifyItemsStorage);
  private readonly spotifyItemsCommand: SpotifyItemsCommand =
    inject(SpotifyItemsCommand);

  state: LoadingState = 'idle';

  protected tracksIds = computed(() => {
    return this.extendedHistoryService
      .topTracks()
      .slice(0, 20)
      .map((track: any) => track.id);
  });

  protected topTracks = computed(() => {
    this.spotifyItemsCommand
      .loadTracks(this.tracksIds())
      .subscribe((status: LoadingState) => {
        this.state = status;
      });
    return this.spotifyItemsStorage.getTracks([...this.tracksIds()]);
  });

  ngOnInit() {}
}
