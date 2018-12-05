// @flow
import * as React from 'react';
import noop from 'lodash/noop';

import Highlight from './Highlight';
import Drawing from './Drawing';
import CommentAnnotation from './CommentAnnotation';

import './Annotation.scss';

type Props = {
    onDelete: Function,
    error?: ActionItemError,
} & CommentProps;

class Annotation extends React.PureComponent<Props> {
    static defaultProps = {
        isPending: false,
        permissions: {
            can_delete: false,
            can_edit: false,
        },
        onDelete: noop,
    };

    getAnnotationItem() {
        const {
            annotationType: type,
            id,
            details,
            isPending,
            error,
            message,
            onDelete,
            getAvatarUrl,
            currentUser,
            ...rest
        } = this.props;

        switch (type) {
            case 'draw':
                return (
                    <Drawing
                        id={id}
                        currentUser={currentUser}
                        onDelete={onDelete}
                        isEditing={false}
                        isPending={isPending}
                        getAvatarUrl={getAvatarUrl}
                        error={error}
                        {...rest}
                    />
                );
            case 'highlight':
                return (
                    <Highlight
                        id={id}
                        currentUser={currentUser}
                        onDelete={onDelete}
                        isEditing={false}
                        isPending={isPending}
                        getAvatarUrl={getAvatarUrl}
                        error={error}
                        {...rest}
                    />
                );
            case 'highlight-comment':
            case 'point':
                return (
                    <CommentAnnotation
                        id={id}
                        currentUser={currentUser}
                        onDelete={onDelete}
                        isEditing={false}
                        isPending={isPending}
                        getAvatarUrl={getAvatarUrl}
                        error={error}
                        {...rest}
                    />
                );
            default:
                return null;
        }
    }

    render() {
        return <div className="bcs-annotation">{this.getAnnotationItem()}</div>;
    }
}

export default Annotation;
