/**
 * @flow
 * @file Tasks component
 */

import React, { Component, ReactNode } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import Comment from '../comment';
import CompletedAssignment from './CompletedAssignment';
import messages from '../messages';
import PendingAssignment from './PendingAssignment';
import RejectedAssignment from './RejectedAssignment';
import { ActionItemError, User } from '../../../../flowTypes';
import { Comments, Contacts, InputState, Tasks, Translations, Versions } from '../activityFeedFlowTypes';

import './Task.scss';

const TASK_APPROVED = 'approved';
const TASK_REJECTED = 'rejected';
const TASK_COMPLETED = 'completed';
const TASK_INCOMPLETE = 'incomplete';

type Props = {
    assignees: Array<{
        id: number,
        user: User,
        status: string
    }>,
    createdAt: number | string,
    createdBy: User,
    currentUser: User,
    dueDate: any,
    error: ActionItemError,
    handlers: {
        comments: Comments,
        tasks: Tasks,
        contacts: Contacts,
        versions: Versions
    },
    id: string,
    inputState: InputState,
    isPending: boolean,
    onDelete: Function,
    onEdit: Function,
    onTaskAssignmentUpdate: Function,
    permissions: {
        comment_delete: boolean,
        comment_edit: boolean
    },
    translatedTaggedMessage: string,
    translations: Translations,
    taggedMessage: string
};

// eslint-disable-next-line
class Task extends Component<Props> {
    render(): ReactNode {
        const {
            assignees,
            createdAt,
            createdBy,
            currentUser,
            dueDate,
            error,
            handlers,
            id,
            inputState,
            isPending,
            onDelete,
            onEdit,
            onTaskAssignmentUpdate,
            permissions,
            taggedMessage,
            translatedTaggedMessage,
            translations
        } = this.props;
        return (
            <div className={`box-ui-task ${isPending || error ? 'is-pending' : ''}`}>
                <Comment
                    createdAt={createdAt}
                    createdBy={createdBy}
                    currentUser={currentUser}
                    error={error}
                    handlers={handlers}
                    id={id}
                    inputState={inputState}
                    isPending={isPending}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    permissions={permissions}
                    taggedMessage={taggedMessage}
                    translatedTaggedMessage={translatedTaggedMessage}
                    translations={translations}
                />
                <div className='box-ui-task-approvers-container'>
                    <div className='box-ui-task-approvers-header'>
                        <strong>
                            <FormattedMessage {...messages.tasksForApproval} />
                        </strong>
                        {dueDate ? (
                            <span className='box-ui-task-due-date'>
                                <FormattedMessage {...messages.taskDueDate} />
                                <FormattedDate value={dueDate} day='numeric' month='long' year='numeric' />
                            </span>
                        ) : null}
                    </div>
                    <div className='box-ui-task-assignees'>
                        {assignees.map(({ id: taskAssignmentId, user: assigneeUser, status }) => {
                            switch (status) {
                                case TASK_INCOMPLETE:
                                    return (
                                        <PendingAssignment
                                            {...assigneeUser}
                                            key={assigneeUser.id}
                                            onTaskApproval={() =>
                                                onTaskAssignmentUpdate(id, taskAssignmentId, TASK_APPROVED)
                                            }
                                            onTaskReject={() =>
                                                onTaskAssignmentUpdate(id, taskAssignmentId, TASK_REJECTED)
                                            }
                                            shouldShowActions={
                                                onTaskAssignmentUpdate && assigneeUser.id === currentUser.id
                                            }
                                        />
                                    );
                                case TASK_COMPLETED:
                                case TASK_APPROVED:
                                    return <CompletedAssignment {...assigneeUser} key={assigneeUser.id} />;
                                case TASK_REJECTED:
                                    return <RejectedAssignment {...assigneeUser} key={assigneeUser.id} />;
                                default:
                                    return null;
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
export default Task;