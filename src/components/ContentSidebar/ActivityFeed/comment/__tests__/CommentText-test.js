import React from 'react';
import { mount, shallow } from 'enzyme';

import CommentText from '../CommentText';

describe('features/activity-feed/comment/CommentText', () => {
    test('should properly format tagged comment', () => {
        const commentText = {
            taggedMessage: 'How u doing @[2030326577:Young Jeezy]?'
        };

        const wrapper = shallow(<CommentText id='123' {...commentText} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should properly handle unicode variants of @ in tagged comments', () => {
        const commentText = {
            taggedMessage: 'Hi ﹫[123:Half] ＠[222:Full] @[432:Latin]'
        };

        const wrapper = shallow(<CommentText id='123' {...commentText} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should not show translate button by default, translation should be disabled', () => {
        const commentText = { taggedMessage: 'test' };

        const wrapper = mount(<CommentText id='123' {...commentText} />);
        expect(wrapper.find('.bcs-comment-text').text()).toEqual(commentText.taggedMessage);
        expect(wrapper.find('PlainButton.bcs-comment-translate').length).toEqual(0);
        expect(wrapper.prop('translationEnabled')).toBe(false);
        expect(wrapper.state('isLoading')).toBe(false);
    });

    test('should show translate button when translation is enabled', () => {
        const translations = { translationEnabled: true };
        const commentText = { taggedMessage: 'test' };

        const wrapper = mount(<CommentText id='123' {...commentText} {...translations} />);

        expect(wrapper.find('PlainButton.bcs-comment-translate').length).toEqual(1);
        expect(wrapper.state('isTranslation')).toBe(false);
        expect(wrapper.state('isLoading')).toBe(false);
    });

    test('should show original button when translation is enabled and already showing translated comment', () => {
        const translations = { translationEnabled: true };
        const commentText = {
            taggedMessage: 'test',
            translatedTaggedMessage: 'translated'
        };

        const wrapper = mount(<CommentText id='123' {...commentText} {...translations} />);
        wrapper.setState({ isTranslation: true });

        expect(wrapper.find('PlainButton.bcs-comment-translate').length).toEqual(1);
        expect(wrapper.state('isLoading')).toBe(false);
    });

    test('should show loading indicator when state is isLoading', () => {
        const translations = { translationEnabled: true };
        const commentText = {
            taggedMessage: 'test',
            translatedTaggedMessage: 'translated'
        };

        const wrapper = shallow(<CommentText id='123' {...commentText} {...translations} />);
        wrapper.setState({ isTranslation: false, isLoading: true });

        expect(wrapper.find('LoadingIndicator').length).toEqual(1);
    });

    test('should call onTranslate when translate button is clicked', () => {
        const onTranslateSpy = jest.fn();
        const translations = {
            translationEnabled: true,
            onTranslate: onTranslateSpy
        };
        const commentText = { taggedMessage: 'test' };

        const wrapper = mount(<CommentText id='123' {...commentText} {...translations} />);

        const translateBtn = wrapper.find('PlainButton.bcs-comment-translate');
        translateBtn.simulate('click');

        expect(onTranslateSpy).toHaveBeenCalledTimes(1);
        expect(wrapper.find('.bcs-comment-text-loading').length).toEqual(1);
        expect(wrapper.state('isTranslation')).toBe(true);
        expect(wrapper.state('isLoading')).toBe(true);
    });

    test('should not call onTranslate when translate button is clicked and translated comment exists', () => {
        const onTranslateSpy = jest.fn();
        const translations = {
            translationEnabled: true,
            onTranslate: onTranslateSpy
        };
        const commentText = {
            taggedMessage: 'test',
            translatedTaggedMessage: 'translated'
        };

        const wrapper = mount(<CommentText id='123' {...commentText} {...translations} />);
        wrapper.setState({ isTranslation: false });

        const translateBtn = wrapper.find('PlainButton.bcs-comment-translate');
        translateBtn.simulate('click');

        expect(onTranslateSpy).not.toHaveBeenCalled();
        expect(wrapper.find('PlainButton.bcs-comment-translate').length).toEqual(1);
        expect(wrapper.state('isTranslation')).toBe(true);
        expect(wrapper.state('isLoading')).toBe(false);
    });

    test('should show comment when show original button is clicked', () => {
        const onTranslateSpy = jest.fn();
        const translations = {
            translationEnabled: true,
            onTranslate: onTranslateSpy
        };
        const commentText = {
            taggedMessage: 'test',
            translatedTaggedMessage: 'translated'
        };

        const wrapper = mount(<CommentText id='123' {...commentText} {...translations} />);
        wrapper.setState({ isTranslation: true });

        const showOriginalBtn = wrapper.find('PlainButton.bcs-comment-translate');
        showOriginalBtn.simulate('click');

        expect(onTranslateSpy).not.toHaveBeenCalled();
        expect(wrapper.find('PlainButton.bcs-comment-translate').length).toEqual(1);
        expect(wrapper.state('isTranslation')).toBe(false);
        expect(wrapper.state('isLoading')).toBe(false);
    });
});