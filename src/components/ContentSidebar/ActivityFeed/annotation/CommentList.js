// @flow
import * as React from 'react';

import CommentComponent from '../comment';
import CollapsedComments from './CollapsedComments';

type Props = {
    comments: Array<any>,
};

type State = {
    isCollapsed: boolean,
};

class CommentList extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { isCollapsed: true };
    }

    onExpandList = () => {
        const { isCollapsed } = this.state;
        this.setState({ isCollapsed: !isCollapsed });
    };

    render() {
        const { comments, onDelete, annotationType } = this.props;
        const { isCollapsed } = this.state;
        return (
            <div className="bcs-annotation-comment-list">
                {comments.length > 3 && isCollapsed ? (
                    <CollapsedComments comments={comments} onClick={this.onExpandList} />
                ) : (
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id} className="bcs-annotation-comment-item">
                                <CommentComponent
                                    annotationType={annotationType}
                                    onDelete={onDelete}
                                    tagged_message={comment.message}
                                    {...comment}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default CommentList;
