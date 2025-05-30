import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStorage } from '@storage';
@Component({
  selector: 'app-extended-history',
  imports: [RouterLink, DatePipe],
  templateUrl: './extended-history.component.html',
  styleUrl: './extended-history.component.scss',
})
export default class ExtendedHistoryComponent {
  private readonly userStorage: UserStorage = inject(UserStorage);

  listeningData = computed(() => {
    const user = this.userStorage.getUser();

    const listeningData = user?.listeningData.find(
      (data) => data.type === 'expanded-history',
    );

    return listeningData ? listeningData : null;
  });
}
