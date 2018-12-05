/**
 * @flow
 * @file AddApproval component for ApprovalCommentForm component
 */

import * as React from 'react';

import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconAdd from 'box-react-ui/lib/icons/general/IconAdd';

type Props = {
    onAnnotationModeToggle: Function,
    isEnabled: boolean,
};

const AddAnnotation = ({ onAnnotationModeToggle, isEnabled }: Props): React.Node => (
    <PlainButton className="bcs-add-annotation-btn" onClick={onAnnotationModeToggle}>
        <IconAdd height={16} width={16} color={isEnabled ? '#0061d5' : null} />
    </PlainButton>
);

export default AddAnnotation;
