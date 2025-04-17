import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';
import { UserTopItemsSimpleCommand } from '@commands';
import {
  CardSimpleAlbumComponent,
  CardSimpleArtistComponent,
  CardSimpleGenreComponent,
  CardSimpleTrackComponent,
} from '@features';
import { UserTopItemsSimpleStorage } from '@storage';
import { Album, Artist, Genre, LoadingState, SimpleItemsSelection, SimpleTimeFrame, Track } from '@types';

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
  private userTopItemsStorage: UserTopItemsSimpleStorage = inject(
    UserTopItemsSimpleStorage
  );
  private UserTopItemsCommand: UserTopItemsSimpleCommand = inject(
    UserTopItemsSimpleCommand
  );

  itemsType: InputSignal<SimpleItemsSelection> = input.required();
  periodOfTime: InputSignal<SimpleTimeFrame> = input.required();

  loadingState: LoadingState = 'idle';

  userTopItems = computed<(Track | Artist | Album | Genre)[]>(() => {
    return this.userTopItemsStorage.getUserTopItems(
      this.periodOfTime(),
      this.itemsType()
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
    if (
      this.userTopItemsStorage.getUserTopItems(
        this.periodOfTime(),
        this.itemsType()
      ).length === 0
    ) {
      this.UserTopItemsCommand.loadInUserTopItems({
        type: this.itemsType(),
        timeFrame: this.periodOfTime(),
      }).subscribe((state: LoadingState) => {

        this.loadingState = state;
      });
    }
  }
}
