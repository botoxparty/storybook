import React from 'react';
import { styled } from '@storybook/theming';
import { NotificationItem, NotificationItemProps } from './NotificationItem';

const List = styled.div(
  {
    zIndex: 10,

    '> * + *': {
      marginTop: 10,
    },
    '&:empty': {
      display: 'none',
    },
  },
  ({ placement }: any) =>
    placement || {
      bottom: 0,
      left: 0,
      right: 0,
      position: 'fixed',
    }
);

export interface NotificationListProps {
  notifications: NotificationItemProps['notification'][];
  placement?: {
    position?: string;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
}

export const NotificationList = ({ notifications, placement }: NotificationListProps) => (
  <List placement={placement}>
    {notifications.map(notification => (
      <NotificationItem key={notification.id} notification={notification} />
    ))}
  </List>
);
