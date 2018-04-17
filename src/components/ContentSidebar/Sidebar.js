/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import TabView from 'box-react-ui/lib/components/tab-view/TabView';
import Tab from 'box-react-ui/lib/components/tab-view/Tab';
import DetailsSidebar from './DetailsSidebar';
import { hasSkills as hasSkillsData } from './Skills/skillUtils';
import messages from '../messages';
import type { AccessStats, BoxItem, FileVersions, Errors } from '../../flowTypes';
import './Sidebar.scss';
import ActivityFeed from './ActivityFeed/activity-feed/ActivityFeed';

const feedState = [
    {
        createdAt: Date.now(),
        id: '123123',
        taggedMessage: 'I got 99 problems but @[123:Aubrey Graham] ain\'t one!',
        createdBy: { name: 'Kanye West', id: 2 },
        type: 'comment'
    }
];

const currentUser = { name: 'Sumedha Pramod', id: 1 };

type Props = {
    file: BoxItem,
    api: API,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasNotices: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasActivityFeed: boolean,
    hasVersions: boolean,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onAccessStatsClick?: Function,
    onInteraction: Function,
    onDescriptionChange: Function,
    onVersionHistoryClick?: Function,
    descriptionTextareaProps: Object,
    intl: any,
    versions?: FileVersions,
    accessStats?: AccessStats,
    fileError?: Errors,
    versionError?: Errors
};

const Sidebar = ({
    file,
    api,
    getPreviewer,
    hasTitle,
    hasSkills,
    hasProperties,
    hasMetadata,
    hasNotices,
    hasAccessStats,
    hasClassification,
    hasActivityFeed,
    hasVersions,
    rootElement,
    appElement,
    onAccessStatsClick,
    onInteraction,
    onDescriptionChange,
    intl,
    onVersionHistoryClick,
    versions,
    accessStats,
    fileError,
    versionError
}: Props) => {
    const shouldShowSkills = hasSkills && hasSkillsData(file);

    const allHandlers = {
        comments: {
            create: ({ text }) => console.log(`comment create: ${text}`),
            delete: ({ id }) => console.log(`delete comment: ${id}`)
        },
        tasks: {
            create: () => console.log('task create'),
            delete: ({ id }) => console.log(`delete task: ${id}`),
            edit: ({ id, text }) => console.log(`edit task: ${id} with comment ${text}`),
            onTaskAssignmentUpdate: (taskId, taskAssignmentId, status) =>
                console.log(`task assignment update: ${status}`)
        },
        contacts: {
            getApproverWithQuery: (mentionString) =>
                getCollaborators(file.id, mentionString, fetchCollaboratorsSuccessCallback),
            getMentionWithQuery: (mentionString) =>
                getCollaborators(file.id, mentionString, fetchCollaboratorsSuccessCallback)
        },
        versions: {
            info: (version) => console.log('version info for version: ', version)
        }
    };

    const Details = (
        <DetailsSidebar
            file={file}
            getPreviewer={getPreviewer}
            hasTitle={hasTitle}
            hasSkills={shouldShowSkills}
            hasProperties={hasProperties}
            hasMetadata={hasMetadata}
            hasNotices={hasNotices}
            hasAccessStats={hasAccessStats}
            hasClassification={hasClassification}
            hasVersions={hasVersions}
            appElement={appElement}
            rootElement={rootElement}
            onAccessStatsClick={onAccessStatsClick}
            onInteraction={onInteraction}
            onDescriptionChange={onDescriptionChange}
            onVersionHistoryClick={onVersionHistoryClick}
            versions={versions}
            accessStats={accessStats}
            fileError={fileError}
            versionError={versionError}
        />
    );

    const ActivityFeedSidebar = hasActivityFeed ? (
        <ActivityFeed
            api={api}
            feedState={feedState}
            inputState={{
                currentUser,
                isDisabled: false
            }}
            handlers={allHandlers}
        />
    ) : null;

    return (
        <TabView defaultSelectedIndex={shouldShowSkills ? 0 : 1}>
            <Tab title={intl.formatMessage(messages.sidebarDetailsTitle)}>{Details}</Tab>
            <Tab title='Activity'>{ActivityFeedSidebar}</Tab>
        </TabView>
    );
};

export default injectIntl(Sidebar);
