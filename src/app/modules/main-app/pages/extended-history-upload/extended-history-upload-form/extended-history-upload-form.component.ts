import { Component, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtendedHistoryPreparerService, ScreenNotificationService } from '@services';
import { ExtendedHistoryPreparingState, ExtendedStreamingHistory, UploadingStatus } from '@types';
import { ExtendedHistoryCommand } from '@commands';

@Component({
  selector: 'app-extended-history-upload-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './extended-history-upload-form.component.html',
  styleUrls: ['./extended-history-upload-form.component.scss'],
})
export class ExtendedHistoryUploadFormComponent {
  private _extendedHistoryPreparerService: ExtendedHistoryPreparerService = inject(ExtendedHistoryPreparerService);
  private _extendedHistoryCommand: ExtendedHistoryCommand = inject(ExtendedHistoryCommand);
  private _screenNotificationService: ScreenNotificationService = inject(ScreenNotificationService);

  protected processingStatus: WritableSignal<ExtendedHistoryPreparingState> = signal('idle');
  protected uploadingStatus: WritableSignal<UploadingStatus> = signal('idle');

  protected startingDate: WritableSignal<string | null> = signal(null);
  protected endingDate: WritableSignal<string | null> = signal(null);

  protected canUpload: WritableSignal<boolean> = signal(false);
  private history: WritableSignal<ExtendedStreamingHistory[]> = signal([]);

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

  protected async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      await this.handleFile(file);
    }
  }

  private async handleFile(file: File) {
    this.canUpload.set(false);
    try {
      this._extendedHistoryPreparerService
        .FullyProcessFile(file)
        .subscribe((response: { status: ExtendedHistoryPreparingState; data?: ExtendedStreamingHistory[] }) => {
          this.processingStatus.set(response.status);
          if (response.data && response.data.length > 0 && response.status === 'all-prepared') {
            this.canUpload.set(true);
            this.history.set(response.data);
            this.startingDate.set(response.data[0].ts);
            this.endingDate.set(response.data[response.data.length - 1].ts);
            console.log('Data:', response.data);
          }
        });
    } catch (error) {
      this.processingStatus.set('error');
    }
  }

  protected uploadHistory() {
    if (this.history().length === 0) {
      this._screenNotificationService.sendMessage({
        title: 'alert_emptyExtendedHistory-title',
        message: 'alert_emptyExtendedHistory-message',
        buttonMessage: 'alert_emptyExtendedHistory-buttonMessage',
      });
      return;
    }
    console.log('Uploading history:', this.history());
    this._extendedHistoryCommand
      .uploadExtendedHistory({
        history: this.history(),
      })
      .subscribe((status: UploadingStatus) => {
        this.uploadingStatus.set(status);
      });
  }
}
