import React from 'react';
import { styled } from '@storybook/theming';
import { FlexBar } from '@storybook/components';

interface ToolbarProps extends React.ComponentProps<typeof FlexBar> {
  shown: boolean;
}

export const Toolbar = styled(({ shown, ...props }: ToolbarProps) => <FlexBar {...props} />)(
  {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    transition: 'transform .2s linear',
  },
  ({ shown }: any) => ({
    transform: shown ? 'translateY(0px)' : 'translateY(-40px)',
  })
);
