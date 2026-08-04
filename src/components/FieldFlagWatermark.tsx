import React from 'react';
import { G } from 'react-native-svg';
import { CountryCode } from '../types/customize';
import { FlagArt } from './FlagIcon';

interface Props {
  x: number;
  y: number;
  height: number;
  code: CountryCode;
  opacity?: number;
  anchor?: 'top-left' | 'top-right';
}

const FLAG_VIEW_W = 60;
const FLAG_VIEW_H = 40;

/** Faded country flag watermark in a field corner (renders as Svg group, not nested Svg) */
export function FieldFlagWatermark({
  x,
  y,
  height,
  code,
  opacity = 0.3,
  anchor = 'top-left',
}: Props) {
  const scale = height / FLAG_VIEW_H;
  const flagWidth = FLAG_VIEW_W * scale;
  const translateX = anchor === 'top-right' ? x - flagWidth : x;

  return (
    <G opacity={opacity} transform={`translate(${translateX}, ${y}) scale(${scale})`}>
      <FlagArt code={code} />
    </G>
  );
}
