/**
 * @flow
 * @file AddApproval component for ApprovalCommentForm component
 */

import React from 'react';
import type { Node } from 'react';

import Checkbox from 'box-react-ui/lib/components/checkbox/Checkbox';

import AddApprovalFields from './AddApprovalFields';
import messages from '../../../messages';
import type { SelectorItems } from '../../../../flowTypes';

type Props = {
    approvalDate: ?number,
    approvers: SelectorItems,
    approverSelectorContacts: SelectorItems,
    approverSelectorError: string,
    formatMessage: Function,
    isAddApprovalVisible: boolean,
    onApprovalDateChange: Function,
    onApproverSelectorInput: Function,
    onApproverSelectorRemove: Function,
    onApproverSelectorSelect: Function
};

const AddApproval = ({
    approvalDate,
    approvers,
    approverSelectorContacts,
    approverSelectorError,
    formatMessage,
    isAddApprovalVisible,
    onApprovalDateChange,
    onApproverSelectorInput,
    onApproverSelectorRemove,
    onApproverSelectorSelect
}: Props): Node => (
    <div className='bcs-comment-add-approver'>
        <Checkbox
            className='bcs-comment-add-approver-checkbox'
            label={formatMessage(messages.approvalAddTask)}
            name='addApproval'
            isChecked={isAddApprovalVisible}
            tooltip={formatMessage(messages.approvalAddTaskTooltip)}
        />
        {isAddApprovalVisible ? (
            <AddApprovalFields
                approvalDate={approvalDate}
                approvers={approvers}
                approverSelectorContacts={approverSelectorContacts}
                approverSelectorError={approverSelectorError}
                formatMessage={formatMessage}
                onApproverSelectorInput={onApproverSelectorInput}
                onApproverSelectorRemove={onApproverSelectorRemove}
                onApproverSelectorSelect={onApproverSelectorSelect}
                onApprovalDateChange={onApprovalDateChange}
            />
        ) : null}
    </div>
);

export default AddApproval;
