// @flow
import * as React from 'react';

import { BOX_BLUE } from '../../common/variables';
import AccessibleSVG from '../accessible-svg';

type Props = {
    className?: string,
    color?: string,
    height?: number,
    /** A text-only string describing the icon if it's not purely decorative for accessibility */
    title?: string | React.Element<any>,
    width?: number,
};

const InfoBadge = ({ className = '', color = BOX_BLUE, height = 16, title, width = 16 }: Props) => (
    <AccessibleSVG
        className={`info-badge ${className}`}
        height={height}
        title={title}
        viewBox="0 0 16 16"
        width={width}
    >
        <path
            className="fill-color"
            d="M15 8c0-3.9-3.1-7-7-7S1 4.1 1 8s3.1 7 7 7 7-3.1 7-7zM0 8c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z"
            fill={color}
        />
        <path
            className="fill-color"
            d="M9 5c0-.6-.4-1-1-1s-1 .4-1 1 .4 1 1 1 1-.4 1-1zM6 5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM7 12h2V9H7v3zm0-4h2c.6 0 1 .4 1 1v3c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1z"
            fill={color}
        />
    </AccessibleSVG>
);

export default InfoBadge;
