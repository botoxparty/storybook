import React from 'react';
import { NotificationItem, NotificationItemProps } from './NotificationItem';

const buildExample = (notification: NotificationItemProps['notification']) => {
  const story = () => <NotificationItem notification={notification} />;
  story.storyData = { notification };
  return story;
};

export const simple = buildExample({
  content: '🎉 Storybook is cool!',
});

export const longText = buildExample({
  content: '🎉 This is a long message that extends over two lines!',
});

export const withLink = buildExample({
  ...simple.storyData.notification,
  content: '🎉 Storybook X.X is available! Download now »',
  link: '/some/path',
});

export default {
  component: NotificationItem,
  title: 'UI|Notifications/Item',
  decorators: [(storyFn: any) => <div style={{ width: '240px', margin: '1rem' }}>{storyFn()}</div>],
};
