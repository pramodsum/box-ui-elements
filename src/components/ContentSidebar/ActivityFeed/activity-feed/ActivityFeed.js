/**
 * @flow
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import classNames from 'classnames';

import ActiveState from './ActiveState';
import ApprovalCommentForm from '../approval-comment-form';
import EmptyState from './EmptyState';
import { collapseFeedState, shouldShowEmptyState } from './activityFeedUtils';
import type { FileVersions, Comments, Tasks, User, SelectorItems, BoxItem } from '../../../../flowTypes';
import type {
    CommentHandlers,
    TaskHandlers,
    ContactHandlers,
    VersionHandlers,
    Translations
} from '../activityFeedFlowTypes';

import './ActivityFeed.scss';

type Props = {
    file: BoxItem,
    versions?: FileVersions,
    comments?: Comments,
    tasks?: Tasks,
    isLoading?: boolean,
    inputState: {
        currentUser: User,
        approverSelectorContacts?: SelectorItems,
        mentionSelectorContacts?: SelectorItems,
        isDisabled?: boolean
    },
    handlers: {
        comments?: CommentHandlers,
        tasks?: TaskHandlers,
        contacts?: ContactHandlers,
        versions?: VersionHandlers
    },
    translations?: Translations,
    permissions?: {
        comments?: boolean,
        tasks?: boolean
    }
};

type State = {
    isInputOpen: boolean,
    approverSelectorContacts: Array<User>,
    mentionSelectorContacts: Array<User>
};

class ActivityFeed extends React.Component<Props, State> {
    static defaultProps = {
        isLoading: false
    };

    state = {
        isInputOpen: false,
        approverSelectorContacts: [],
        mentionSelectorContacts: []
    };

    feedContainer: null | HTMLElement;

    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = (): void => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = (): void => this.setState({ isInputOpen: false });
    approvalCommentFormSubmitHandler = (): void => this.setState({ isInputOpen: false });

    createComment = (args: any): void => {
        // create a placeholder pending comment
        // create actual comment and send to Box V2 api
        // call user passed in handlers.comments.create, if it exists
        const createComment = getProp(this.props, 'handlers.comments.create', noop);
        createComment(args);

        this.approvalCommentFormSubmitHandler();
    };

    deleteComment = (args: any): void => {
        // remove comment from list of comments
        // removeItemByTypeAndId('comment', args.id);
        // delete the comment via V2 API
        // call user passed in handlers.comments.delete, if it exists
        const deleteComment = getProp(this.props, 'handlers.comments.delete', noop);
        deleteComment(args);
    };

    createTask = (args: any): void => {
        // create a placeholder pending task
        // create actual task and send to Box V2 api
        // call user passed in handlers.tasks.create, if it exists
        const createTask = getProp(this.props, 'handlers.tasks.create', noop);
        createTask(args);

        this.approvalCommentFormSubmitHandler();
    };

    updateTask = (args: any): void => {
        // get previous task assignment state
        // update the task via v2 api
        // update task state OR
        // if it fails, revert to previous task state
        // call user passed in handlers.tasks.edit, if it exists
        const updateTask = getProp(this.props, 'handlers.tasks.edit', noop);
        updateTask(args);
    };

    deleteTask = (args: any): void => {
        // remove task from task list
        // removeItemByTypeAndId('task', args.id);
        // delete the task via v2 api
        // call user passed in handlers.tasks.delete, if it exists
        const deleteTask = getProp(this.props, 'handlers.tasks.delete', noop);
        deleteTask(args);
    };

    updateTaskAssignment = (taskId: string, taskAssignmentId: string, status: string): void => {
        // Determine fixedStatus from status. 'approved' === 'complete', 'rejected' === 'done'
        // get previous task state
        // add task to state
        // update assignment via V2 API
        // failure? revert to previous task state
        // call user passed in handlers.tasks.onTaskAssignmentUpdate, if it exists
        const updateTaskAssignment = getProp(this.props, 'handlers.tasks.onTaskAssignmentUpdate', noop);
        updateTaskAssignment(taskId, taskAssignmentId, status);
    };

    openVersionHistoryPopup = (data: any): void => {
        // get version number from data
        // open the pop for version history
        // call user passed in handlers.versions.info, if it exists
        const versionInfoHandler = getProp(this.props, 'handlers.versions.info', noop);
        versionInfoHandler(data);
    };

    getApproverSelectorContacts = (searchStr: string): void => {
        // using v2 api, search for approver on file with searchStr
        // use collaborators endpoint /files/ID/collaborators
        // update contacts state 'approverSelectorContacts'
        // call user passed in handlers.contacts.getApproverWithQuery, if it exists
        const getApproverWithQuery = getProp(this.props, 'handlers.contacts.getApproverWithQuery', noop);
        this.setState({ approverSelectorContacts: getApproverWithQuery(searchStr) });
    };

    getMentionSelectorContacts = (searchStr: string): void => {
        // using v2 api, search for mention on file with searchStr
        // use collaborators endpoint /files/ID/collaborators
        // update contacts state 'mentionSelectorContacts'
        // call user passed in handlers.contacts.getMentionWithQuery, if it exists
        const getMentionWithQuery = getProp(this.props, 'handlers.contacts.getMentionWithQuery', noop);
        this.setState({ mentionSelectorContacts: getMentionWithQuery(searchStr) });
    };

    render(): React.Node {
        const { handlers, inputState, isLoading, permissions, translations } = this.props;
        const { approverSelectorContacts, mentionSelectorContacts, isInputOpen } = this.state;
        const { currentUser } = inputState;
        const showApprovalCommentForm = !!(currentUser && getProp(handlers, 'comments.create', false));
        const hasCommentPermission = getProp(permissions, 'comments', false);
        const hasTaskPermission = getProp(permissions, 'tasks', false);

        const msOneDayAgo = 86400 * 1000;
        const TIME_STRING_SEPT_27_2017 = '2017-08-27T10:40:41-07:00';

        const feedState = [
            {
                createdAt: new Date().toISOString(),
                id: 'bb6d6c62-f411-43e8-840f-e17bb3611d34',
                action: 'applied',
                type: 'keywords',
                words: 'cartoon font logo brand clip art illustration line artwork'
            },
            {
                createdAt: new Date(Date.now() - 5 * msOneDayAgo).toISOString(),
                id: '123122432',
                taggedMessage: '私は、これは言うことを知りません ＠[2031225629:リュ]',
                createdBy: {
                    name: 'The man formerly known as Prince and other things',
                    id: 1
                },
                type: 'comment'
            },
            {
                createdAt: Date.now() - 1 * msOneDayAgo,
                id: '1231231234',
                taggedMessage: 'An error comment',
                isPending: true,
                error: {
                    title: 'An error occured',
                    message: 'Stuff got fudged up, who knows what happened. Probably your fault tho...',
                    action: {
                        text: 'Fix it',
                        onAction: () => console.log('confirm')
                    }
                },
                createdBy: { name: 'Kanye West', id: 10 },
                type: 'comment'
            },
            {
                createdAt: Date.now(),
                id: '148953',
                versionNumber: 1,
                createdBy: { name: 'Kanye West', id: 10 },
                action: 'upload',
                type: 'file_version'
            },
            {
                createdAt: Date.now(),
                id: '1489531',
                versionNumber: 2,
                createdBy: { name: 'Kanye West', id: 10 },
                action: 'upload',
                type: 'file_version'
            },
            {
                createdAt: Date.now(),
                id: '1489532',
                versionNumber: 3,
                createdBy: { name: 'Abel Tesfaye', id: 13 },
                action: 'upload',
                type: 'file_version'
            },
            {
                createdAt: Date.now(),
                id: '1489533',
                versionNumber: 4,
                createdBy: { name: 'Abel Tesfaye', id: 13 },
                action: 'upload',
                type: 'file_version'
            },
            {
                createdAt: new Date(Date.now() - 1500 * 1000).toISOString(),
                dueDate: Date.now(),
                id: '123125312',
                taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
                createdBy: { name: 'Aubrey Graham', id: 7 },
                isPending: true,
                error: {
                    title: 'An error occured',
                    message: 'Stuff got fudged up, who knows what happened. Probably your fault tho...',
                    action: {
                        text: 'Fix it',
                        onAction: () => console.log('confirm')
                    }
                },
                assignees: [
                    {
                        id: 0,
                        user: { name: 'Kanye West', id: 10 },
                        status: 'incomplete'
                    },
                    {
                        id: 1,
                        user: { name: 'The man formerly known as Prince and other things', id: 3 },
                        status: 'incomplete'
                    },
                    {
                        id: 2,
                        user: { name: 'Shawn Carter', id: 2 },
                        status: 'completed'
                    },
                    {
                        id: 3,
                        user: { name: 'Beyonce', id: 4 },
                        status: 'rejected'
                    }
                ],
                type: 'task'
            },
            {
                createdAt: Date.now(),
                dueDate: null,
                id: '123125',
                taggedMessage: 'Click this link http://www.google.com Also, <b>This text should not show up bold</b>',
                createdBy: { name: 'Aubrey Graham', id: 7 },
                assignees: [
                    {
                        id: 0,
                        user: { name: 'Kanye West', id: 10 },
                        status: 'incomplete'
                    },
                    {
                        id: 1,
                        user: { name: 'The man formerly known as Prince and other things', id: 3 },
                        status: 'incomplete'
                    },
                    {
                        id: 2,
                        user: { name: 'Shawn Carter', id: 2 },
                        status: 'completed'
                    },
                    {
                        id: 3,
                        user: { name: 'Beyonce', id: 4 },
                        status: 'rejected'
                    }
                ],
                type: 'task'
            },
            {
                createdAt: Date.now(),
                id: '123123',
                taggedMessage:
                    'Hey bru, how u doing @[2030326577:Young Jeezy]? @[123:Kanye] is dope! <a href="http://www.box.com">This should not show up as a link</a>',
                createdBy: { name: 'Kanye West', id: 2 },
                type: 'comment'
            },
            {
                createdAt: Date.now(),
                id: '123123123',
                taggedMessage: 'A pending comment',
                isPending: true,
                createdBy: { name: 'Kanye West', id: 2 },
                type: 'comment'
            },
            {
                createdAt: TIME_STRING_SEPT_27_2017,
                dueDate: Date.now(),
                id: '12312445',
                taggedMessage: 'Do it! Do it! Do it! Do it! Do it! Do it! Do it! Do it! .',
                createdBy: { name: 'Aubrey Graham', id: 7 },
                assignees: [
                    {
                        id: 0,
                        user: { name: 'Kanye West', id: 10 },
                        status: 'incomplete'
                    },
                    {
                        id: 1,
                        user: { name: 'The man formerly known as Prince and other things', id: 3 },
                        status: 'incomplete'
                    },
                    {
                        id: 2,
                        user: { name: 'Shawn Carter', id: 2 },
                        status: 'completed'
                    }
                ],
                type: 'task',
                isPending: true
            },
            {
                createdAt: Date.now(),
                id: '148954',
                versionNumber: 1,
                createdBy: {
                    name: 'The man formerly known as Prince and other things',
                    id: 1
                },
                action: 'restore',
                type: 'file_version'
            },
            {
                createdAt: Date.now(),
                id: '14895356',
                versionNumber: 9,
                createdBy: { name: 'Abel Tesfaye', id: 13 },
                action: 'upload',
                type: 'file_version'
            },
            {
                createdAt: Date.now(),
                id: '14895357',
                versionNumber: 7,
                createdBy: { name: 'Abel Tesfaye', id: 13 },
                action: 'upload',
                type: 'file_version'
            },
            {
                createdAt: Date.now(),
                id: '14895358',
                versionNumber: 7,
                createdBy: { name: 'Abel Tesfaye', id: 13 },
                action: 'upload',
                type: 'file_version'
            },
            {
                createdAt: Date.now(),
                id: '14895359',
                versionNumber: 6,
                createdBy: { name: 'Abel Tesfaye', id: 13 },
                action: 'upload',
                type: 'file_version'
            },
            {
                createdAt: Date.now(),
                id: '14895360',
                versionNumber: 5,
                createdBy: { name: 'Abel Tesfaye', id: 13 },
                action: 'upload',
                type: 'file_version'
            },
            {
                createdAt: Date.now(),
                id: '14895361',
                versionNumber: 4,
                createdBy: { name: 'Abel Tesfaye', id: 13 },
                action: 'upload',
                type: 'file_version'
            }
        ];

        return (
            // eslint-disable-next-line
            <div className="bcs-activity-feed" onKeyDown={this.onKeyDown}>
                <div
                    ref={(ref) => {
                        this.feedContainer = ref;
                    }}
                    className='bcs-activity-feed-items-container'
                >
                    {shouldShowEmptyState(feedState) ? (
                        <EmptyState isLoading={isLoading} showCommentMessage={showApprovalCommentForm} />
                    ) : (
                        <ActiveState
                            handlers={handlers}
                            items={collapseFeedState(feedState)}
                            currentUser={currentUser}
                            onTaskAssignmentUpdate={this.updateTaskAssignment}
                            onCommentDelete={hasCommentPermission ? this.deleteComment : noop}
                            onTaskDelete={hasTaskPermission ? this.deleteTask : noop}
                            onTaskEdit={hasTaskPermission ? this.updateTask : noop}
                            onVersionInfo={this.openVersionHistoryPopup}
                            translations={translations}
                            inputState={inputState}
                        />
                    )}
                </div>
                    <ApprovalCommentForm
                        onSubmit={() => {
                            if (this.feedContainer) {
                                this.feedContainer.scrollTop = 0;
                            }
                        }}
                        isDisabled={inputState.isDisabled}
                        approverSelectorContacts={approverSelectorContacts}
                        mentionSelectorContacts={mentionSelectorContacts}
                        className={classNames('bcs-activity-feed-comment-input', {
                            'bcs-is-disabled': inputState.isDisabled
                        })}
                        createComment={hasCommentPermission ? this.createComment : noop}
                        createTask={hasTaskPermission ? this.createTask : noop}
                        getApproverContactsWithQuery={this.getApproverSelectorContacts}
                        getMentionContactsWithQuery={this.getMentionSelectorContacts}
                        isOpen={isInputOpen}
                        user={currentUser}
                        onCancel={this.approvalCommentFormCancelHandler}
                        onFocus={this.approvalCommentFormFocusHandler}
                    />
            </div>
        );
    }
}

export default ActivityFeed;
