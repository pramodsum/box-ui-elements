/**
 * @flow
 * @file ActivityFeed sidebar component
 * @author Box
 */

import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import ApprovalCommentForm from 'box-react-ui/lib/features/activity-feed/approval-comment-form/ApprovalCommentForm';
import SidebarContent from './SidebarContent';
import type { BoxItem } from '../../flowTypes';

import './ActivityFeedSidebar.scss';

const currentUser = { name: 'Sumedha Pramod', id: 18 };

/* eslint-disable jsx-a11y/label-has-for */
class ActivityFeedSidebar extends Component<Props, State> {
    file: BoxItem;
    api: API;
    getPreviewer: Function;
    hasTitle: boolean;
    rootElement: HTMLElement;
    appElement: HTMLElement;
    intl: any;
    props: Props;

    constructor(props) {
        super(props);
        this.api = this.props.api;
        this.state = {
            isInputOpen: false,
            collaborators: []
        };
    }

    handleMention = (mentionString) => {
        if (!mentionString.length) {
            return;
        }

        if (this.mentionDebounceHandler) {
            clearTimeout(this.mentionDebounceHandler);
            this.mentionDebounceHandler = null;
        }

        this.mentionDebounceHandler = setTimeout(() => {
            const { file } = this.props;
            this.fetchCollabMatches(file.id, mentionString);
        }, 500);
    };

    onKeyDown = (event) => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    parseContactsFromCollabs(collabResults: Array): void {
        if (!collabResults) {
            return;
        }

        const collaborators = [];
        collabResults.forEach((collab) => {
            const { id, name, login } = collab;
            collaborators.push({ id, name, email: login });
        });
        this.setState({ collaborators });
    }

    /**
     * Network error callback
     *
     * @private
     * @param {Error} error error object
     * @return {void}
     */
    errorCallback = (error: Error): void => {
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */
    };

    /**
     * File fetch success callback
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    collabSuccessCallback = (collabs: BoxCollabCollection): void => {
        const contacts = collabs.data.entries || [];
        this.parseContactsFromCollabs(contacts);
    };

    fetchCollabMatches(id: string, searchString: string = ''): void {
        console.log(searchString);
        const fileAPI = this.api.getFileAPI();
        fileAPI.collaborations(id, searchString, this.collabSuccessCallback, this.errorCallback);
    }

    approvalCommentFormFocusHandler = () => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = () => this.setState({ isInputOpen: false });
    approvalCommentFormSubmitHandler = () => this.setState({ isInputOpen: false });
    createCommentHandler = (args) => {
        console.log(`comment create: ${args.text}`);
        this.approvalCommentFormSubmitHandler();
    };

    render() {
        const { collaborators, isInputOpen } = this.state;

        return (
            <SidebarContent>
                <ApprovalCommentForm
                    mentionSelectorContacts={collaborators.map((contact) => ({
                        id: contact.id,
                        name: contact.name,
                        item: contact
                    }))}
                    className='box-ui-activity-feed-comment-input'
                    createComment={this.createCommentHandler}
                    getMentionContactsWithQuery={this.handleMention}
                    isOpen={isInputOpen}
                    user={currentUser}
                    onCancel={this.approvalCommentFormCancelHandler}
                    onFocus={this.approvalCommentFormFocusHandler}
                />
            </SidebarContent>
        );
    }
}

export default injectIntl(ActivityFeedSidebar);
