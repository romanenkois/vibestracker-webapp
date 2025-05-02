import { Component, inject } from '@angular/core';
import { ExtendedHistoryPreparerService } from '@services';

@Component({
  selector: 'app-extended-history-upload-form',
  imports: [],
  templateUrl: './extended-history-upload-form.component.html',
  styleUrl: './extended-history-upload-form.component.scss'
})
export class ExtendedHistoryUploadFormComponent {
  private readonly extendedHistoryPreparerService: ExtendedHistoryPreparerService = inject(ExtendedHistoryPreparerService);
  status: string = 'idle';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const zipFile = input.files[0];

      this.extendedHistoryPreparerService.FullyProcessFile(zipFile).subscribe((response: any) => {
        this.status = response;
      })
    }
  }
}
