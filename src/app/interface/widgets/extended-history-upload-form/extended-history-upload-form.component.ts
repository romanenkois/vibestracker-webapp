import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendedHistoryPreparerService } from '@services';
import { ExtendedHistoryPreparingState } from '@types';

@Component({
  selector: 'app-extended-history-upload-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './extended-history-upload-form.component.html',
  styleUrls: ['./extended-history-upload-form.component.scss'],
})
export class ExtendedHistoryUploadFormComponent {
  private readonly extendedHistoryPreparerService: ExtendedHistoryPreparerService =
    inject(ExtendedHistoryPreparerService);

  status: ExtendedHistoryPreparingState = 'idle';

  startingDate: string | null = null;
  endingDate: string | null = null;

  canUpload = false;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event'])
  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files?.length) {
      await this.handleFile(files[0]);
    }
  }

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      await this.handleFile(file);
    }
  }

  private async handleFile(file: File) {
    this.canUpload = false; // just in case
    try {
      this.extendedHistoryPreparerService
        .FullyProcessFile(file)
        .subscribe(
          (response: { status: ExtendedHistoryPreparingState; data?: any }) => {
            this.status = response.status;
            if (
              response.data &&
              response.status === 'all-prepared' &&
              response.data.sortedData
            ) {
              this.canUpload = true;
              this.startingDate = response.data.sortedData[0].ts;
              this.endingDate =
                response.data.sortedData[
                  response.data.sortedData.length - 1
                ].ts;
              console.log('Data:', response.data.sortedData);
            }
          },
        );
    } catch (error) {
      this.status = `error`;
    }
  }
}
