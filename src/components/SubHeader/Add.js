/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'box-react-ui/lib/components/button/Button';
import DropdownMenu from 'box-react-ui/lib/components/dropdown-menu/DropdownMenu';
import Menu from 'box-react-ui/lib/components/menu/Menu';
import MenuItem from 'box-react-ui/lib/components/menu/MenuItem';
import IconAddThin from 'box-react-ui/lib/icons/general/IconAddThin';
import messages from '../messages';
import './Add.scss';

type Props = {
    showUpload: boolean,
    showCreate: boolean,
    onUpload: Function,
    onCreate: Function,
    onCreateScratch: Function,
    isLoaded: boolean,
    rootElement: HTMLElement
};

const Add = ({
    onUpload,
    onCreate,
    onCreateScratch,
    isLoaded,
    showUpload = true,
    showCreate = true,
    rootElement
}: Props) => (
    <Button onClick={onCreateScratch} type='button' className='be-btn-add' isDisabled={!isLoaded}>
        <IconAddThin />
    </Button>
);

export default Add;
