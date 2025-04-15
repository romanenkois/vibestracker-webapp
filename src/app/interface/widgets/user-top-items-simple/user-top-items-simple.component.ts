import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
  WritableSignal,
} from '@angular/core';
import { UserTopItemsSimpleCommand } from '@commands';
import { UserTopItemsSimpleStorage } from '@storage';
import { SimpleItemsSelection, SimpleTimeFrame } from '@types';

@Component({
  selector: 'app-user-top-items-simple',
  imports: [],
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

  userTopItems = computed(() => {
    switch (this.itemsType()) {
      case 'albums':
        return this.userTopItemsStorage.getUserTopAlbums(this.periodOfTime());
      case 'artists':
        return this.userTopItemsStorage.getUserTopArtists(this.periodOfTime());
      case 'tracks':
        return this.userTopItemsStorage.getUserTopTracks(this.periodOfTime());
      case 'genres':
        return this.userTopItemsStorage.getUserTopGenres(this.periodOfTime());
      default:
        return [];
    }
  });

  loadMoreItems() {
    // if (this.itemsType() !== 'genres' || this.itemsType() !== 'albums') {
    //   this.UserTopItemsCommand.
    // }
  }

  ngOnInit(): void {}
}
