/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DownloadVisualButton from './DownloadVisualButton';

describe('DownloadVisualButton Component', () => {
  it('renders the JPEG download button', () => {
    const cardRef = createRef<HTMLDivElement>();
    render(
      <DownloadVisualButton
        cardRef={cardRef}
        visualTitle="Test_Visual"
        isDarkMode={false}
      />
    );

    expect(screen.getByText('JPEG')).toBeDefined();
  });

  it('opens dropdown menu showing Light Mode and Night Mode options on click', () => {
    const cardRef = createRef<HTMLDivElement>();
    render(
      <DownloadVisualButton
        cardRef={cardRef}
        visualTitle="Test_Visual"
        isDarkMode={false}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText(/download as jpeg/i)).toBeDefined();
    expect(screen.getByText('Light Mode JPEG')).toBeDefined();
    expect(screen.getByText('Night Mode JPEG')).toBeDefined();
  });

  it('calls onSetTheme and onResetTheme callbacks when an option is selected', async () => {
    const cardRef = { current: document.createElement('div') };
    const onSetTheme = vi.fn();
    const onResetTheme = vi.fn();

    render(
      <DownloadVisualButton
        cardRef={cardRef}
        visualTitle="Test_Visual"
        isDarkMode={false}
        onSetTheme={onSetTheme}
        onResetTheme={onResetTheme}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const lightOption = screen.getByText('Light Mode JPEG');
    fireEvent.click(lightOption);

    expect(onSetTheme).toHaveBeenCalledWith('light');
  });
});
