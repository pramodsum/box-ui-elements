/**
 * @flow
 * @file Mention component
 */

import * as React from 'react';

type Props = {
    children?: React.Node,
    id: number,
    mentionTrigger?: any,
    generateProfileUrl: Function
};

const Mention = ({ children, id, generateProfileUrl, ...rest }: Props): React.Node => {
    delete rest.mentionTrigger;
    return (
        <a {...rest} style={{ display: 'inline-block' }} href={generateProfileUrl(id)}>
            {children}
        </a>
    );
};

export default Mention;
