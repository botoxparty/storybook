import React from 'react';
import { styled } from '@storybook/theming';
import { Tabs, Icons, IconButton } from '@storybook/components';
import { SafeTab } from './SafeTab';

const DesktopOnlyIconButton = styled(IconButton)({
  // Hides full screen icon at mobile breakpoint defined in app.js
  '@media (max-width: 599px)': {
    display: 'none',
  },
});

export interface AddonPanelProps {
  panels: {
    [k: string]: {
      title: string;
      render: React.ReactNode;
    };
  };
  actions: {
    togglePosition: () => void;
    toggleVisibility: () => void;
  };
  selectedPanel?: string;
  panelPosition?: 'right' | 'bottom';
}

export const AddonPanel = React.memo<AddonPanelProps>(
  ({ panels, actions, selectedPanel = '', panelPosition = 'right' }) => (
    <Tabs
      absolute
      selected={selectedPanel}
      actions={actions}
      flex
      tools={
        <>
          <DesktopOnlyIconButton
            key="position"
            onClick={actions.togglePosition}
            title="Change orientation"
          >
            <Icons icon={panelPosition === 'bottom' ? 'bottombar' : 'sidebaralt'} />
          </DesktopOnlyIconButton>
          <DesktopOnlyIconButton
            key="visibility"
            onClick={actions.toggleVisibility}
            title="Hide addons"
          >
            <Icons icon="close" />
          </DesktopOnlyIconButton>
        </>
      }
      id="storybook-panel-root"
    >
      {Object.entries(panels).map(([k, v]) => (
        <SafeTab key={k} id={k} title={v.title}>
          {v.render}
        </SafeTab>
      ))}
    </Tabs>
  )
);
