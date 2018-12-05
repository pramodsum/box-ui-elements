// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Avatar from '../Avatar';

import messages from '../../../messages';

type Props = {
    onDelete: Function,
    error?: ActionItemError,
} & CommentProps;

const Highlight = ({ created_by, threadNumber, location }: Props) => (
    <div className="bcs-highlight">
        <div className="bcs-annotation-number">{threadNumber}</div>
        <div className="bcs-comment-container">
            <Avatar className="bcs-comment-avatar" user={created_by} />
            <div className="bcs-highlight-message">
                <FormattedMessage
                    {...messages.highlighted}
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

export { Highlight as HighlightBase };
export default injectIntl(Highlight);
