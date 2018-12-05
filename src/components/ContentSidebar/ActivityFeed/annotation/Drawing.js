// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Avatar from '../Avatar';

import messages from '../../../messages';

type Props = {
    onDelete: Function,
    error?: ActionItemError,
} & CommentProps;

const Drawing = ({ created_by, threadNumber, location }: Props) => (
    <div className="bcs-drawing">
        <div className="bcs-annotation-number">{threadNumber}</div>
        <div className="bcs-comment-container">
            <Avatar className="bcs-comment-avatar" user={created_by} />
            <div className="bcs-drawing-message">
                <FormattedMessage
                    {...messages.drew}
                    values={{
                        name: <strong>{created_by.name}</strong>,
                        version_number: '1',
                        page: location.page,
                    }}
                />
            </div>
        </div>
    </div>
);

export { Drawing as DrawingBase };
export default injectIntl(Drawing);
