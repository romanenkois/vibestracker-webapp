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
    try {
      this.extendedHistoryPreparerService
        .FullyProcessFile(file)
        .subscribe(
          (response: { status: ExtendedHistoryPreparingState; data?: any }) => {
            this.status = response.status;
            if (response.data && response.status === 'all-prepared' && response.data.preparedData) {
              console.log('Data:', response.data);
            }
          },
        );
    } catch (error) {
      this.status = `error`;
    }
  }
}
