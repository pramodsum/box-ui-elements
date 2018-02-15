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
const contactData = [
    { email: 'agraham@box.com', id: '1', name: 'Aubrey Graham' },
    { email: 'atesfaye@box.com', id: '2', name: 'Abel Tesfaye' },
    { email: 'klamar@box.com', id: '3', name: 'Kendrick Lamar' },
    { email: 'bigsean@box.com', id: '4', name: 'Sean Anderson' },
    { email: 'kwest@box.com', id: '5', name: 'Kanye West' },
    { email: 'jayz@box.com', id: '6', name: 'Shawn Carter' },
    { email: 'bknowles@box.com', id: '7', name: 'Beyonce Knowles' },
    { email: 'jcole@box.com', id: '8', name: 'Jermaine Cole' }
];

/* eslint-disable jsx-a11y/label-has-for */
class ActivityFeedSidebar extends Component<Props, State> {
    file: BoxItem;
    getPreviewer: Function;
    hasTitle: boolean;
    rootElement: HTMLElement;
    appElement: HTMLElement;
    intl: any;
    props: Props;

    constructor(props) {
        super(props);
        this.state = {
            isInputOpen: false,
            contacts: []
        };
    }

    isMatchingContact(mentionString, contact) {
        const { email, name } = contact;
        return email.toLowerCase().indexOf(mentionString) > -1 || name.toLowerCase().indexOf(mentionString) > -1;
    }

    handleMention = (mentionString) => {
        if (!mentionString.length) {
            return;
        }
        const matchingContacts = contactData.reduce(
            (prev, contact) => (this.isMatchingContact(mentionString, contact) ? prev.concat([contact]) : prev),
            []
        );

        this.setState({
            contacts: matchingContacts
        });
    };

    onKeyDown = (event) => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = () => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = () => this.setState({ isInputOpen: false });
    approvalCommentFormSubmitHandler = () => this.setState({ isInputOpen: false });
    createCommentHandler = (args) => {
        console.log(`comment create: ${args.text}`);
        this.approvalCommentFormSubmitHandler();
    };

    render() {
        const { contacts, isInputOpen } = this.state;

        return (
            <SidebarContent>
                <ApprovalCommentForm
                    mentionSelectorContacts={contacts.map((contact) => ({
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
