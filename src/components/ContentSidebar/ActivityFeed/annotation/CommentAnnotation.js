// @flow
import * as React from 'react';

import CommentList from './CommentList';

type Props = {
    onDelete: Function,
    error?: ActionItemError,
} & CommentProps;

const CommentAnnotation = ({ threadNumber, comments, onDelete }: Props) => (
    <div className="bcs-comment-annotation">
        <div className="bcs-annotation-number">{threadNumber}</div>
        <CommentList onDelete={onDelete} comments={comments} />
    </div>
);

export default CommentAnnotation;
