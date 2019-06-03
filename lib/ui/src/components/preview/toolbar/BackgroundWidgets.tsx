import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { styled } from '@storybook/theming';
import { Icons, IconButton } from '@storybook/components';

/**
 * Styled
 */
const createGridStyles = (cellSize: number): any => {
  const cellSizeDoubled = cellSize * 2;
  const cellSizeSquared = cellSize ** 2;

  const gridSVGEncoded = encodeURIComponent(
    renderToStaticMarkup(
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke="gray"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="grid"
            width={cellSizeSquared}
            height={cellSizeSquared}
            patternUnits="userSpaceOnUse"
          >
            <rect width={cellSizeSquared} height={cellSizeSquared} fill="url(#smallGrid)" />
            <path
              d={`M ${cellSizeSquared} 0 L 0 0 0 ${cellSizeSquared}`}
              fill="none"
              stroke="gray"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    )
  );

  return {
    backgroundImage: `url("data:image/svg+xml,${gridSVGEncoded}")`,
    backgroundSize: `${cellSizeSquared}px ${cellSizeSquared}px, ${cellSizeSquared}px ${cellSizeSquared}px, ${cellSizeDoubled}px ${cellSizeDoubled}px, ${cellSizeDoubled}px ${cellSizeDoubled}px`,
    backgroundPosition: '-2px -2px',
    mixBlendMode: 'difference',
  };
};

const Grid = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  } as any,
  ({ theme }: any) => createGridStyles(theme.background.gridCellSize)
);

const Background = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'background .1s linear',
    iframe: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      border: '0 none',
    },
  },
  ({ theme }: any) => ({ background: theme.background.content })
);

/**
 * Context
 */
interface BackgroundContext {
  grid: boolean;
  setGrid: Function;
  value: string;
  setValue: Function;
}

const BackgroundContext = React.createContext<BackgroundContext>(null as any);

/**
 * Widgets
 */
export const BackgroundConsumer = BackgroundContext.Consumer;

export const BackgroundProvider: React.FunctionComponent = ({ children }) => {
  const [grid, setGrid] = useState(false);
  const [value, setValue] = useState('transparent');
  return (
    <BackgroundContext.Provider value={{ value, setValue, grid, setGrid }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const DefaultBackground: React.FunctionComponent = ({ children }) => (
  <BackgroundConsumer>
    {({ grid, value }) => (
      <Background id="storybook-preview-background" value={value}>
        {grid ? <Grid /> : null}
        {children}
      </Background>
    )}
  </BackgroundConsumer>
);

export const BackgroundWidgets = () => (
  <BackgroundConsumer>
    {({ grid, setGrid }) => (
      <IconButton active={!!grid} onClick={() => setGrid(!grid)} title="Toggle background grid">
        <Icons icon="grid" />
      </IconButton>
    )}
  </BackgroundConsumer>
);
