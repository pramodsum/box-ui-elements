/**
 * @flow
 * @file Helper for the box recents api
 * @author Box
 */

import flatten from 'utils/flatten';
import { getBadItemError } from 'utils/error';
import { FOLDER_FIELDS_TO_FETCH } from 'utils/fields';
import Base from './Base';
import FileAPI from './File';
import FolderAPI from './Folder';
import WebLinkAPI from './WebLink';
import { DEFAULT_ROOT, CACHE_PREFIX_RECENTS, FIELD_DATE, SORT_DESC, ERROR_CODE_FETCH_RECENTS } from '../constants';

class Recents extends Base {
    /**
     * @property {string}
     */
    key: string;

    /**
     * @property {string}
     */
    id: string;

    /**
     * @property {Function}
     */
    successCallback: Function;

    /**
     * @property {Function}
     */
    errorCallback: ElementsErrorCallback;

    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_RECENTS}${id}`;
    }

    /**
     * URL for recents api
     *
     * @return {string} base url for files
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/recent_items`;
    }

    /**
     * Returns the results
     *
     * @return {void}
     */
    finish(): void {
        if (this.isDestroyed()) {
            return;
        }

        const cache: APICache = this.getCache();
        const recents: FlattenedBoxItem = cache.get(this.key);
        const { item_collection }: FlattenedBoxItem = recents;
        if (!item_collection) {
            throw getBadItemError();
        }

        const { entries }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries)) {
            throw getBadItemError();
        }

        const collection: Collection = {
            id: this.id,
            items: entries.map((key: string) => cache.get(key)),
            percentLoaded: 100,
            sortBy: FIELD_DATE, // Results are always sorted by date
            sortDirection: SORT_DESC, // Results are always sorted descending
        };
        this.successCallback(collection);
    }

    /**
     * Handles the folder Recents response
     *
     * @param {Object} response
     * @return {void}
     */
    recentsSuccessHandler = ({ data }: { data: RecentCollection }): void => {
        if (this.isDestroyed()) {
            return;
        }

        const {
            entries,
            order: { by, direction },
        }: RecentCollection = data;
        const items: BoxItem[] = [];

        entries.forEach(({ item, interacted_at }: Recent) => {
            const { path_collection }: BoxItem = item;
            const shouldInclude =
                this.id === DEFAULT_ROOT ||
                (!!path_collection && path_collection.entries.findIndex((crumb: Crumb) => crumb.id === this.id) !== -1);
            if (shouldInclude) {
                items.push(Object.assign(item, { interacted_at }));
            }
        });

        const flattenedItems: string[] = flatten(
            items,
            new FolderAPI(this.options),
            new FileAPI(this.options),
            new WebLinkAPI(this.options),
        );

        this.getCache().set(this.key, {
            item_collection: {
                entries: flattenedItems,
                order: [
                    {
                        by,
                        direction,
                    },
                ],
            },
        });
        this.finish();
    };

    /**
     * Handles the Recents error
     *
     * @param {Error} error fetch error
     * @return {void}
     */
    recentsErrorHandler = (error: Error): void => {
        if (this.isDestroyed()) {
            return;
        }

        this.errorCallback(error, this.errorCode);
    };

    /**
     * Does the network request
     *
     * @return {Promise}
     */
    recentsRequest(): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        this.errorCode = ERROR_CODE_FETCH_RECENTS;
        return this.xhr
            .get({
                url: this.getUrl(),
                params: {
                    fields: FOLDER_FIELDS_TO_FETCH.toString(),
                },
            })
            .then(this.recentsSuccessHandler)
            .catch(this.recentsErrorHandler);
    }

    /**
     * Gets recent files
     *
     * @param {string} id - parent folder id
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {boolean|void} [options.forceFetch] - Bypasses the cache
     * @return {void}
     */
    recents(id: string, successCallback: Function, errorCallback: ElementsErrorCallback, options: Object = {}): void {
        if (this.isDestroyed()) {
            return;
        }

        // Save references
        this.id = id;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        const cache: APICache = this.getCache();
        this.key = this.getCacheKey(this.id);

        // Clear the cache if needed
        if (options.forceFetch) {
            cache.unset(this.key);
        }

        // Return the Cache value if it exists
        if (cache.has(this.key)) {
            this.finish();
            return;
        }

        // Make the XHR request
        this.recentsRequest();
    }
}

export default Recents;
