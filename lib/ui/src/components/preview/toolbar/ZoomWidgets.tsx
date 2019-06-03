import React, { useContext, useState } from 'react';
import { Icons, IconButton, Separator } from '@storybook/components';

/**
 * Context
 */
interface ZoomContext {
  value: number;
  setValue: Function;
}

const ZoomContext = React.createContext<ZoomContext>(null as any);

/**
 * Widgets
 */
export const ZoomConsumer = ZoomContext.Consumer;

export const ZoomProvider: React.FunctionComponent = ({ children }) => {
  const [value, setValue] = useState(1);
  return <ZoomContext.Provider value={{ value, setValue }}>{children}</ZoomContext.Provider>;
};

export const ZoomWidgets = () => {
  type Event = React.MouseEvent<HTMLButtonElement, MouseEvent>;

  const { value, setValue } = useContext(ZoomContext);
  const zoomByScale = (rate: number) => (e: Event) => {
    e.preventDefault();
    setValue(value * rate);
  };
  const zoomReset = (e: Event) => {
    e.preventDefault();
    setValue(1);
  };

  return (
    <>
      <IconButton onClick={zoomByScale(0.8)} title="Zoom in">
        <Icons icon="zoom" />
      </IconButton>
      <IconButton onClick={zoomByScale(1.25)} title="Zoom out">
        <Icons icon="zoomout" />
      </IconButton>
      <IconButton onClick={zoomReset} title="Reset zoom">
        <Icons icon="zoomreset" />
      </IconButton>
      <Separator />
    </>
  );
};
