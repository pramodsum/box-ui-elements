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
import ActivityFeedSidebar from './ActivityFeedSidebar';
import hasSkillsData from './skillUtils';
import messages from '../messages';
import type { BoxItem } from '../../flowTypes';
import './Sidebar.scss';

type Props = {
    file: BoxItem,
    api: API,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasActivityFeed: boolean,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onInteraction: Function,
    onDescriptionChange: Function,
    descriptionTextareaProps: Object,
    intl: any
};

const Sidebar = ({
    file,
    api,
    getPreviewer,
    hasTitle,
    hasSkills,
    hasProperties,
    hasMetadata,
    hasAccessStats,
    hasClassification,
    hasActivityFeed,
    rootElement,
    appElement,
    onInteraction,
    onDescriptionChange,
    intl
}: Props) => {
    const shouldShowSkills = hasSkills && hasSkillsData(file);

    const Details = (
        <DetailsSidebar
            file={file}
            getPreviewer={getPreviewer}
            hasTitle={hasTitle}
            hasSkills={shouldShowSkills}
            hasProperties={hasProperties}
            hasMetadata={hasMetadata}
            hasAccessStats={hasAccessStats}
            hasClassification={hasClassification}
            appElement={appElement}
            rootElement={rootElement}
            onInteraction={onInteraction}
            onDescriptionChange={onDescriptionChange}
        />
    );

    const Activity = (
        <ActivityFeedSidebar
            file={file}
            api={api}
            getPreviewer={getPreviewer}
            hasTitle={hasTitle}
            hasSkills={shouldShowSkills}
            hasProperties={hasProperties}
            hasMetadata={hasMetadata}
            hasAccessStats={hasAccessStats}
            hasClassification={hasClassification}
            appElement={appElement}
            rootElement={rootElement}
        />
    );

    if (!hasActivityFeed) {
        return Details;
    }

    return (
        <TabView defaultSelectedIndex={shouldShowSkills ? 0 : 1}>
            <Tab title={intl.formatMessage(messages.sidebarDetailsTitle)}>{Details}</Tab>
            <Tab title='Activity'>{Activity}</Tab>
        </TabView>
    );
};

export default injectIntl(Sidebar);
