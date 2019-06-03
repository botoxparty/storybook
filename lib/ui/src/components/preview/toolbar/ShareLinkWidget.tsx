import window from 'global';
import React from 'react';
import { Icons, IconButton } from '@storybook/components';
import { stringifyQueryParams } from '../heleprs';

export interface IFrameEjectorProps {
  storyId: string;
  baseUrl: string;
  queryParams: object;
}

export const ShareLinkWidget = ({ storyId, baseUrl, queryParams }: IFrameEjectorProps) => (
  <IconButton
    key="opener"
    onClick={() => window.open(`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`)}
    title="Open canvas in new tab"
  >
    <Icons icon="share" />
  </IconButton>
);
