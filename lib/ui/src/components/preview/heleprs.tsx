import React, { Fragment } from 'react';
import memoize from 'memoizerific';
import { types } from '@storybook/addons';
import { CanvasTabs } from './toolbar/CanvasTabs';
import { FullScreenWidgets } from './toolbar/FullScreenWidgets';
import { ShareLinkWidget } from './toolbar/ShareLinkWidget';
import { ZoomWidgets } from './toolbar/ZoomWidgets';
import { BackgroundWidgets } from './toolbar/BackgroundWidgets';

/**
 *
 * @param queryParams
 */
export const stringifyQueryParams = (queryParams: object) =>
  Object.entries(queryParams).reduce((acc, [k, v]) => {
    return `${acc}&${k}=${v}`;
  }, '');

/**
 *
 */
export interface base {
  id?: string;
  title?: string;
  route?: (props: { storyId: string }) => any;
  match?: (props: any) => boolean;
  render: (props: { active: boolean; children?: React.ReactNode }) => React.ReactNode;
}

/**
 *
 */
type getElementList = (
  getElements: (type: types) => { [k: string]: base },
  type: string,
  bases: base[]
) => Required<base>[];

export const getElementList: getElementList = memoize(10)((getElements, type, base) =>
  base.concat(Object.values(getElements(type)))
);

/**
 *
 */
type list = {
  id?: string;
  key?: string;
  render: Function;
}[];

const displayItems = (list: list) =>
  list.filter(Boolean).reduce(
    (acc, item, index) => (
      <Fragment key={item.id || item.key || `f-${index}`}>
        {acc}
        {item.render() || item}
      </Fragment>
    ),
    null
  );

/**
 *
 * @param viewMode
 */
type matchViewMode = (mode: string) => (arg: { viewMode: string }) => boolean;

export const matchStoryMode: matchViewMode = mode => ({ viewMode }) => viewMode === mode;

/**
 *
 */
type getTools = (props: any) => { left: React.ReactNode; right: React.ReactNode };

export const getTools: getTools = memoize(10)(
  ({
    getElements,
    queryParams,
    storyId,
    viewMode,
    panels,
    path,
    location,
    actions,
    options,
    baseUrl,
  }) => {
    const filter = (item: base) =>
      item && (!item.match || item.match({ storyId, viewMode, location, path }));

    /**
     * LEFT TOOLS
     */
    const havePanel = !!panels.filter(({ id }) => id !== 'canvas').lenght;
    const routerProps = {
      path,
      location,
    };
    const canvasTabs = {
      render: () =>
        havePanel && (
          <CanvasTabs storyId={storyId} viewMode={viewMode} panels={panels} {...routerProps} />
        ),
    };
    const zoomTools = {
      match: matchStoryMode('story'),
      render: () => <ZoomWidgets />,
    };
    const backgroundTools = {
      match: matchStoryMode('story'),
      render: () => <BackgroundWidgets />,
    };
    const tools = getElementList(getElements, types.TOOL, [canvasTabs, zoomTools, backgroundTools]);
    const left = displayItems(tools.filter(filter));

    /**
     * RIGHT TOOLS
     */
    const fullScreen = {
      match: matchStoryMode('story'),
      render: () => (
        <FullScreenWidgets isFullscreen={options.isFullscreen} onClick={actions.toggleFullscreen} />
      ),
    };
    const shareLink = {
      match: matchStoryMode('story'),
      render: () => (
        <ShareLinkWidget storyId={storyId} baseUrl={baseUrl} queryParams={queryParams} />
      ),
    };
    const extraTools = getElementList(getElements, types.TOOLEXTRA, [fullScreen, shareLink]);
    const right = displayItems(extraTools.filter(filter));

    return { left, right };
  }
);
