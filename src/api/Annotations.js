// @flow
import axios from 'axios';
import Base from './Base';

import { PLACEHOLDER_USER } from '../constants';

const FIELDS = 'item,thread,details,message,created_by,created_at,modified_at,permissions';

class API extends Base {
    /** @property {string} */
    apiHost: string;

    /** @property {string} */
    fileId: string;

    /** @property {User} */
    user: User;

    /** @property {StringMap} */
    headers: StringMap = {};

    /** @property {Axios} */
    axios: Axios = axios.create();

    /** @property {BoxItemPermissions} */
    permissions: BoxItemPermissions = {
        can_annotate: false,
        can_view_annotations_all: false,
        can_view_annotations_self: false,
    };

    /** @property {CancelTokenSource} */
    axiosSource: CancelTokenSource = axios.CancelToken.source();

    /**
     * [destructor]
     *
     * @return {void}
     */
    destroy() {
        if (this.axiosSource) {
            this.axiosSource.cancel();
        }
    }

    /**
     * Construct the URL to read annotations
     *
     * @return {string} Promise that resolves with fetched annotations
     */
    getUrl(fileId: string): string {
        return `${this.getBaseApiUrl()}/files/${fileId}/annotations`;
    }

    /**
     * Fetches and organizes the annotations for the specified file version id
     *
     * @param {string} version - File version ID
     * @return {Promise} Promise that resolves with thread map
     */
    fetchVersionAnnotations(
        id: string,
        version: string,
        successCallback: Function,
        errorCallback: Function,
    ): Promise<AnnotationMap> {
        const url = this.getUrl(id);
        const params = {
            version,
            fields: FIELDS,
        };

        return this.xhr.getHeaders(`file_${id}`, {}).then(hdrs =>
            this.xhr.axios
                .get(url, {
                    cancelToken: this.xhr.axiosSource.token,
                    params,
                    headers: hdrs,
                    parsedUrl: this.xhr.getParsedUrl(url),
                })
                .then(this.formatAnnotations)
                .catch(errorCallback),
        );
    }

    /**
     * Generates a map of thread ID to annotations in thread.
     *
     * @param {AnnotationData[]} annotations - Annotations to generate map from
     * @return {AnnotationMap} Map of thread ID to annotations in that thread
     */
    createAnnotationMap = (entries): AnnotationMap => {
        const annotations = {};

        // Construct map of thread ID to annotations
        entries.forEach(entry => {
            const { id, details, permissions, thread: threadNumber, ...rest } = entry;
            const { threadID, location, type } = details;

            // Ignore annotations without a valid details
            // NOTE: Annotations created via the API can contain invalid parameters
            if (!location || !threadID || !type) {
                return;
            }

            // Corrects any annotation page number to 1 instead of -1
            const fixedLocation = location;
            if (!fixedLocation.page || fixedLocation.page < 0) {
                fixedLocation.page = 1;
            }

            if (!annotations[threadID]) {
                annotations[threadID] = {};
            }

            const annotation: Annotation = {
                id,
                threadID,
                type: 'annotation',
                annotationType: type,
                location: fixedLocation,
                threadNumber,
                ...rest,
                canAnnotate: true,
                canDelete: permissions.can_delete,
                comments: this.appendComments(entry, annotations[threadID].comments)
            };

            // NOTE: Highlight comment annotations can be structured as a plain highlight
            // followed by a collection of comments. This will correctly set the annotation
            // type for such annotations as 'highlight-comment'
            if (annotation.type === 'highlight' && annotation.comments.length > 0) {
                annotation.type = 'highlight-comment';
            }

            annotations[threadID] = annotation;
        });

        return Object.entries(annotations);
    };

    formatUserInfo(user): User {
        const { profile_image, login, ...rest } = user;
        return {
            ...rest,
            email: login,
            avatar_url: profile_image,
        };
    }

    formatComment(entry: AnnotationData): CommentProps {
        const { id, message, permissions, created_by, created_at, modified_at } = entry;
        return {
            id,
            message,
            permissions,
            created_by: this.formatUserInfo(created_by),
            created_at,
            modified_at,
            isPending: false,
        };
    }

    appendComments(entry: AnnotationData, comments: Comments = []): Comments {
        const { message } = entry;
        if (message && message.trim() !== '') {
            comments.push(this.formatComment(entry));
        }

        return comments;
    }

    formatAnnotations = response => {
        const { data } = response;
        const { entries } = data;

        return {
            total_count: entries.length,
            entries: this.createAnnotationMap(entries).map((data: Array<any>) => {
                const annotation = data[1];
                if (annotation.comments.length > 0) {
                    annotation.comments = annotation.comments.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
                }
                return annotation;
            }),
        };
    };

    createAnnotation(data): Promise<AnnotationMap> {
        const { id, annotation, successCallback, errorCallback } = data;
        const url = `${this.getBaseApiUrl()}/annotations`;

        return this.xhr.getHeaders(`file_${id}`, {}).then(hdrs =>
            this.xhr.axios({
                url,
                data: annotation,
                method: 'POST',
                cancelToken: this.xhr.axiosSource.token,
                headers: hdrs,
                parsedUrl: this.xhr.getParsedUrl(url),
            })
            .then(successCallback)
            .catch(errorCallback),
        );
    }
}

export default API;
