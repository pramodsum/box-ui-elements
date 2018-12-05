// @flow
import * as React from 'react';

import CommentComponent from '../comment';

type Props = {
    comments: Array<any>,
    onClick: Function,
};

const CollapsedComments = ({ comments, onClick }: Props) => {
    const firstComment = comments[0];
    const lastComment = comments[comments.length - 1];
    const commentsLeft = comments.length - 2;

    return (
        <ul>
            <li key={firstComment.id} className="bcs-annotation-comment-item">
                <CommentComponent tagged_message={firstComment.message} {...firstComment} />
            </li>
            <button className="bcs-annotation-comment-list-expand-button" onClick={onClick}>
                {comments.length > 3 ? `${commentsLeft} more replies` : `${commentsLeft} more reply`}
            </button>
            <li key={lastComment.id} className="bcs-annotation-comment-item">
                <CommentComponent tagged_message={lastComment.message} {...lastComment} />
            </li>
        </ul>
    );
};

export default CollapsedComments;
