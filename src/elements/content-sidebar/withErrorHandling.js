/**
 * @flow
 * @file withErrorHandling higher order component
 * @author Box
 */

import * as React from 'react';
import ErrorMask from 'components/error-mask/ErrorMask';
import InlineError from 'components/inline-error/InlineError';
import { FormattedMessage } from 'react-intl';

import SidebarSection from './SidebarSection';

type Props = {
    errorCode?: string,
} & Errors;

const withErrorHandling = (WrappedComponent: React.ComponentType<any>) => ({
    maskError,
    inlineError,
    errorCode,
    ...rest
}: Props) => {
    if (maskError) {
        return (
            <SidebarSection>
                <ErrorMask
                    errorHeader={<FormattedMessage {...maskError.errorHeader} />}
                    errorSubHeader={
                        maskError.errorSubHeader ? <FormattedMessage {...maskError.errorSubHeader} /> : undefined
                    }
                />
            </SidebarSection>
        );
    }
    if (inlineError) {
        return (
            <React.Fragment>
                <InlineError title={<FormattedMessage {...inlineError.title} />}>
                    {<FormattedMessage {...inlineError.content} />}
                </InlineError>
                <WrappedComponent {...rest} />
            </React.Fragment>
        );
    }

    return <WrappedComponent {...rest} />;
};

export default withErrorHandling;
