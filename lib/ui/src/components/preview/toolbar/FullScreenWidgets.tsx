import React from 'react';
import { styled } from '@storybook/theming';
import { Icons, IconButton } from '@storybook/components';

const DesktopOnly = styled.span({
  // Hides full screen icon at mobile breakpoint defined in app.js
  '@media (max-width: 599px)': {
    display: 'none',
  },
});

export interface FullScreenProps {
  isFullscreen: boolean;
  onClick: () => void;
}

export const FullScreenWidgets = ({ isFullscreen, onClick }: FullScreenProps) => (
  <DesktopOnly>
    <IconButton onClick={onClick} title={isFullscreen ? 'Exit full screen' : 'Go full screen'}>
      <Icons icon={isFullscreen ? 'close' : 'expand'} />
    </IconButton>
  </DesktopOnly>
);
