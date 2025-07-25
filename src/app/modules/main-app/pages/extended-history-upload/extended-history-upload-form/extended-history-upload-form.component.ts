import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendedHistoryPreparerService } from '@services';
import {
  ExtendedHistoryPreparingState,
  ExtendedStreamingHistory,
  UploadingStatus,
} from '@types';
import { ExtendedHistoryCommand } from '@commands';

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
  private readonly extendedHistoryCommand: ExtendedHistoryCommand = inject(
    ExtendedHistoryCommand,
  );

  processingStatus: ExtendedHistoryPreparingState = 'idle';
  uploadingStatus: UploadingStatus = 'idle';

  startingDate: string | null = null;
  endingDate: string | null = null;

  canUpload = false;
  history: ExtendedStreamingHistory[] = [];

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
          (response: {
            status: ExtendedHistoryPreparingState;
            data?: ExtendedStreamingHistory[];
          }) => {
            this.processingStatus = response.status;
            if (
              response.data &&
              response.data.length > 0 &&
              response.status === 'all-prepared'
            ) {
              this.canUpload = true;
              this.history = response.data;
              this.startingDate = response.data[0].ts;
              this.endingDate = response.data[response.data.length - 1].ts;
              console.log('Data:', response.data);
            }
          },
        );
    } catch (error) {
      this.processingStatus = `error`;
    }
  }

  protected uploadHistory() {
    if (this.history.length === 0) {
      console.warn('No history to upload');
      return;
    }
    console.log('Uploading history:', this.history);
    this.extendedHistoryCommand
      .uploadExtendedHistory({
        history: this.history,
      })
      .subscribe((status: UploadingStatus) => {
        this.uploadingStatus = status;
      });
  }
}
