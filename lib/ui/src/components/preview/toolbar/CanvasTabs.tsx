import React from 'react';
import { Link } from '@storybook/router';
import { styled } from '@storybook/theming';
import { TabButton, TabBar, Separator } from '@storybook/components';

const UnStyledLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'inherit',
  display: 'inline-block',
});

export interface CanvasTabsProps {
  panels: {
    id: string;
    title: string;
    route: Function;
    match: Function;
  }[];
  storyId: string;
  viewMode: string;
  path: string;
  location: object;
}

export const CanvasTabs = ({ panels, storyId, viewMode, path, location }: CanvasTabsProps) => (
  <>
    <TabBar /* todo: to-confirm: scroll={false} */>
      {panels.map((panel, index) => {
        const to = panel.route({ storyId, viewMode, path, location });
        const isActive = panel.match({ storyId, viewMode, path, location });
        return (
          <UnStyledLink key={panel.id || `l${index}`} to={to}>
            <TabButton active={isActive}>{panel.title}</TabButton>
          </UnStyledLink>
        );
      })}
    </TabBar>
    <Separator />
  </>
);
