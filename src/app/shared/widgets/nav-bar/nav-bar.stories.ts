import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { NavBarComponent } from './nav-bar.component';

const meta = {
  title: 'Widgets/NavBar',
  component: NavBarComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([]), provideHttpClient()],
    }),
  ],
} satisfies Meta<typeof NavBarComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
