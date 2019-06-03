import window from 'global';
import React, { Component } from 'react';
import { stringifyQueryParams } from './heleprs';

const iFrameDOMId = 'storybook-preview-iframe';

interface IFrameProps {
  storyId: string;
  scale: number;
  title: string;
  baseUrl: string;
  queryParams: object;
}

export class IFrame extends Component<IFrameProps> {
  static defaultProps = {
    title: 'preview',
  };

  iframe = null as HTMLIFrameElement | null;

  componentDidMount() {
    this.iframe = window.document.getElementById(iFrameDOMId);
  }

  shouldComponentUpdate(nextProps: any) {
    const { scale } = this.props;

    if (scale !== nextProps.scale) {
      this.setIframeBodyStyle({
        width: `${nextProps.scale * 100}%`,
        height: `${nextProps.scale * 100}%`,
        transform: `scale(${1 / nextProps.scale})`,
        transformOrigin: 'top left',
      });
    }

    // this component renders an iframe, which gets updates via post-messages
    // never update this component, it will cause the iframe to refresh
    return false;
  }

  setIframeBodyStyle(style: Partial<CSSStyleDeclaration>) {
    const { iframe } = this;
    if (iframe && iframe.contentDocument) {
      Object.assign(iframe.contentDocument.body.style, style);
    }
  }

  render() {
    const { storyId, title, baseUrl, scale, queryParams, ...rest } = this.props;
    return (
      <iframe
        scrolling="yes"
        id={iFrameDOMId}
        title={title}
        src={`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`}
        allowFullScreen
        {...rest}
      />
    );
  }
}
