import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserTopItemsSimpleCommand } from '@commands';
import { CardSimpleAlbumComponent, CardSimpleArtistComponent, CardSimpleTrackComponent } from '@widgets';
import { UserTopItemsSimpleStorage } from '@storage';
import { Album, Artist, Genre, LoadingStatusEnum, SimpleItemsSelection, SimpleTimeFrame, Track } from '@types';
import { LoadingSpinner } from '@features';
import { TranslatePipe } from '@pipes';

@Component({
  selector: 'app-user-top-items-simple',
  imports: [
    CardSimpleAlbumComponent,
    CardSimpleArtistComponent,
    CardSimpleTrackComponent,
    LoadingSpinner,
    TranslatePipe,
  ],
  templateUrl: './user-top-items-simple.component.html',
  styleUrl: './user-top-items-simple.component.scss',
})
export class UserTopItemsSimpleComponent implements OnInit {
  private router: Router = inject(Router);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);

  private userTopItemsStorage: UserTopItemsSimpleStorage = inject(UserTopItemsSimpleStorage);
  private UserTopItemsCommand: UserTopItemsSimpleCommand = inject(UserTopItemsSimpleCommand);

  protected itemsType: WritableSignal<SimpleItemsSelection> = signal<SimpleItemsSelection>('tracks');
  protected periodOfTime: WritableSignal<SimpleTimeFrame> = signal<SimpleTimeFrame>('short_term');
  protected loadingState = signal(LoadingStatusEnum.Idle);

  protected userTopItems = computed<(Track | Artist | Album | Genre)[]>(() => {
    return this.userTopItemsStorage.getUserTopItems(this.periodOfTime(), this.itemsType());
  });

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params) => {
      const itemsType = params['items-type'];
      const periodOfTime = params['period-of-time'];

      if (itemsType && periodOfTime) {
        this.itemsType.set(itemsType as SimpleItemsSelection);
        this.periodOfTime.set(periodOfTime as SimpleTimeFrame);
      } else {
        this.itemsType.set(itemsType as SimpleItemsSelection);
        this.periodOfTime.set(periodOfTime as SimpleTimeFrame);

        this.router.navigate([], {
          relativeTo: this.activeRoute,
          queryParams: {
            'items-type': 'tracks',
            'period-of-time': 'short_term',
          },
        });
      }

      if (
        this.userTopItemsStorage.getUserTopItems(this.periodOfTime(), this.itemsType()).length === 0 &&
        this.periodOfTime() !== undefined &&
        this.itemsType() !== undefined
      ) {
        this.UserTopItemsCommand.loadInUserTopItems({
          type: this.itemsType(),
          timeFrame: this.periodOfTime(),
        }).subscribe((state) => {
          this.loadingState.set(state);
        });
      }
    });
  }

  protected loadMoreItems() {
    const itemType = this.itemsType();
    console.log('load more items', itemType);
    if (itemType !== 'genres' && itemType !== 'albums') {
      this.UserTopItemsCommand.loadInMoreUserTopItems({
        type: itemType,
        timeFrame: this.periodOfTime(),
      }).subscribe((state) => {
        console.log(state);
        this.loadingState.set(state);
      });
    }
  }
}
