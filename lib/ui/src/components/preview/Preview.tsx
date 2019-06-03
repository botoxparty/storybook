import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

import { SET_CURRENT_STORY } from '@storybook/core-events';
import { types } from '@storybook/addons';
import { styled } from '@storybook/theming';

import { Toolbar } from './Toolbar';
import { BackgroundProvider, DefaultBackground } from './toolbar/BackgroundWidgets';
import { ZoomProvider, ZoomConsumer } from './toolbar/ZoomWidgets';
import { IFrame } from './IFrame';
import { getElementList, getTools, matchStoryMode, base } from './heleprs';

/**
 * Root
 */
interface ActualPreviewProps {
  id: string;
  wrappers: any[];
  active: boolean;
  scale: number;
  baseUrl: string;
  storyId: string;
  queryParams: object;
}

const ActualPreview = ({
  active,
  wrappers,
  baseUrl,
  id,
  scale,
  storyId,
  queryParams,
}: ActualPreviewProps) =>
  wrappers.reduceRight(
    (children, wrapper, index) => wrapper.render({ index, children, id, storyId, active }),
    <IFrame
      key={id}
      title={id}
      storyId={storyId}
      baseUrl={baseUrl}
      scale={scale}
      queryParams={queryParams}
    />
  );

/**
 * Styles
 */
export const FrameWrap = styled.div(({ offset }: any) => ({
  position: 'absolute',
  overflow: 'auto',
  left: 0,
  right: 0,
  bottom: 0,
  top: offset,
  zIndex: 3,
  transition: 'all 0.1s linear',
  height: `calc(100% - ${offset}px)`,
  background: 'transparent',
}));

/**
 * Preview
 */
interface PreviewProps {
  id: string;
  description?: string;
  api: {
    on: Function;
    off: Function;
    emit: Function;
  };
  storyId: string;
  path: string;
  viewMode: string;
  location: object;
  getElements: Function;
  queryParams: object;
  options: {
    isFullscreen: boolean;
    isToolshown: boolean;
  };
  actions: object;
  baseUrl: string;
}

export class Preview extends Component<PreviewProps> {
  static defaultProps = {
    baseUrl: 'iframe.html',
  };

  shouldComponentUpdate({ storyId, viewMode, options, queryParams }: PreviewProps) {
    const { props } = this;

    return (
      options.isFullscreen !== props.options.isFullscreen ||
      options.isToolshown !== props.options.isToolshown ||
      viewMode !== props.viewMode ||
      storyId !== props.storyId ||
      queryParams !== props.queryParams
    );
  }

  componentDidUpdate(prevProps: PreviewProps) {
    const { api, storyId } = this.props;
    const { storyId: prevStoryId } = prevProps;
    if (storyId && storyId !== prevStoryId) {
      api.emit(SET_CURRENT_STORY, { storyId });
    }
  }

  render() {
    const previewProps = this.props;
    const { getElements, options } = previewProps;
    const { id, baseUrl, storyId, queryParams } = previewProps;

    const defaultWrappers: base[] = [
      { render: ({ active, children }) => <div hidden={!active}>{children}</div> },
      { render: ({ children }) => <DefaultBackground>{children}</DefaultBackground> },
    ];

    const wrappers = getElementList(getElements, types.PREVIEW, defaultWrappers);
    const actualPreviewBaseProps = { id, baseUrl, storyId, queryParams, wrappers };

    const panels = getElementList(getElements, types.TAB, [
      {
        id: 'canvas',
        title: 'Canvas',
        route: ({ storyId }) => `/story/${storyId}`,
        match: matchStoryMode,
        render: ({ active }) => (
          <ZoomConsumer>
            {({ value }) => (
              <ActualPreview {...actualPreviewBaseProps} active={active} scale={value} />
            )}
          </ZoomConsumer>
        ),
      },
    ]);

    const toolbarHeight = options.isToolshown ? 40 : 0;
    const { left, right } = getTools({ ...previewProps, panels });
    const { path, location, viewMode, description } = previewProps;
    return (
      <BackgroundProvider>
        <ZoomProvider>
          <>
            {id === 'main' && (
              <Helmet>
                <title>{description ? `${description} ⋅ ` : ''}Storybook</title>
              </Helmet>
            )}
            <Toolbar shown={options.isToolshown} border>
              {left}
              {right}
            </Toolbar>
            <FrameWrap offset={toolbarHeight}>
              {panels.map(panel => (
                <Fragment key={panel.id}>
                  {panel.render({ active: panel.match({ storyId, viewMode, location, path }) })}
                </Fragment>
              ))}
            </FrameWrap>
          </>
        </ZoomProvider>
      </BackgroundProvider>
    );
  }
}
