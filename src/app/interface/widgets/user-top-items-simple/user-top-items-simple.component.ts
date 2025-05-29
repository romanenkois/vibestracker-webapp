import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserTopItemsSimpleCommand } from '@commands';
import {
  CardSimpleAlbumComponent,
  CardSimpleArtistComponent,
  CardSimpleGenreComponent,
  CardSimpleTrackComponent,
} from '@features';
import { UserTopItemsSimpleStorage } from '@storage';
import {
  Album,
  Artist,
  Genre,
  LoadingState,
  SimpleItemsSelection,
  SimpleTimeFrame,
  Track,
} from '@types';

@Component({
  selector: 'app-user-top-items-simple',
  imports: [
    CardSimpleAlbumComponent,
    CardSimpleArtistComponent,
    CardSimpleGenreComponent,
    CardSimpleTrackComponent,
  ],
  templateUrl: './user-top-items-simple.component.html',
  styleUrl: './user-top-items-simple.component.scss',
})
export class UserTopItemsSimpleComponent implements OnInit {
  private router: Router = inject(Router);
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);

  private userTopItemsStorage: UserTopItemsSimpleStorage = inject(
    UserTopItemsSimpleStorage,
  );
  private UserTopItemsCommand: UserTopItemsSimpleCommand = inject(
    UserTopItemsSimpleCommand,
  );

  itemsType: WritableSignal<SimpleItemsSelection> =
    signal<SimpleItemsSelection>('tracks');
  periodOfTime: WritableSignal<SimpleTimeFrame> =
    signal<SimpleTimeFrame>('short_term');
  loadingState: LoadingState = 'idle';

  userTopItems = computed<(Track | Artist | Album | Genre)[]>(() => {
    return this.userTopItemsStorage.getUserTopItems(
      this.periodOfTime(),
      this.itemsType(),
    );
  });

  loadMoreItems() {
    const itemType = this.itemsType();
    if (itemType !== 'genres' && itemType !== 'albums') {
      this.UserTopItemsCommand.loadInMoreUserTopItems({
        type: itemType,
        timeFrame: this.periodOfTime(),
      }).subscribe((state: LoadingState) => {
        this.loadingState = state;
      });
    }
  }

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
        this.userTopItemsStorage.getUserTopItems(
          this.periodOfTime(),
          this.itemsType(),
        ).length === 0 &&
        this.periodOfTime() !== undefined &&
        this.itemsType() !== undefined
      ) {
        this.UserTopItemsCommand.loadInUserTopItems({
          type: this.itemsType(),
          timeFrame: this.periodOfTime(),
        }).subscribe((state: LoadingState) => {
          this.loadingState = state;
        });
      }
    });
  }
}
