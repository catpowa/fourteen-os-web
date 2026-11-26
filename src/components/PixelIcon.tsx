import type { CSSProperties } from 'react';

/** Original 32 × 32 pixel drawings. Name labels belong to the surrounding control. */
export type PixelIconName = 'computer' | 'welcome' | 'about' | 'work' | 'archive' | 'garden' | 'lab' | 'finds' | 'contact' | 'calculator' | 'notes' | 'finder' | 'readme' | 'scrapbook' | 'settings' | 'clock' | 'trash' | 'help' | 'file' | 'photo' | 'video' | 'folder' | 'folder-open' | 'floppy' | 'save' | 'camera' | 'flower' | 'pencil' | 'brush' | 'ruler' | 'mouse' | 'eye' | 'heart' | 'star' | 'sun' | 'chip' | 'terminal' | 'download' | 'upload' | 'sound' | 'mute' | 'stamp' | 'scissors' | 'tag' | 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'close' | 'image' | 'note' | 'mail' | 'control-panel' | 'art-machine' | 'tool-garden' | 'document' | 'gif' | 'disk';
export interface PixelIconProps {
  name: PixelIconName | string;
  size?: number;
  className?: string;
  title?: string;
  style?: CSSProperties;
}
export function PixelIcon({ name, size = 32, className = '', title, style }: PixelIconProps) {
  return <svg width={size} height={size} viewBox="0 0 32 32" className={`pixel-icon ${className}`} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false" shapeRendering="crispEdges" style={{ display: 'inline-block', flexShrink: 0, imageRendering: 'pixelated', ...style }}>
    {title && <title>{title}</title>}
    <use href={`/icons/sprite.svg#${name}`} />
  </svg>;
}
export default PixelIcon;
