export function createUploadFile() {
    const file = new File([blob], 'untitled.scratch.png');

    // Convert file from the file API to upload item
    let uploadFile = file;
    const { name, size } = uploadFile;

    // Extract extension or use empty string if file has no extension
    let extension = name.substr(name.lastIndexOf('.') + 1);
    if (extension.length === name.length) {
        extension = '';
    }

    const api = this.getUploadAPI(uploadFile);
    const uploadItem: UploadItem = {
        api,
        extension,
        file: uploadFile,
        name,
        progress: 0,
        size,
        status: STATUS_PENDING
    };

    this.setState({ errorCode: '' });
    this.uploadFile(uploadItem);
}

/**
 * Helper to upload a single file.
 *
 * @param {UploadItem} item - Upload item object
 * @return {void}
 */
export function uploadFile(item: UploadItem) {
    const { rootFolderId } = this.props;
    const { api, file, options } = item;

    const uploadOptions: Object = {
        file,
        folderId: options && options.folderId ? options.folderId : rootFolderId,
        errorCallback: (error) => this.handleUploadError(item, error),
        successCallback: (entries) => this.handleUploadSuccess(item, entries),
        overwrite: true,
        fileId: options && options.fileId ? options.fileId : null
    };

    api.upload(uploadOptions);

    item.status = STATUS_IN_PROGRESS;
}

/**
 * Handles an upload error.
 *
 * @private
 * @param {UploadItem} item - Upload item corresponding to error
 * @param {Error} error - Upload error
 * @return {void}
 */
export function handleUploadError = (item: UploadItem, error: Error) => {
    const { onError } = this.props;
    const { file } = item;

    item.status = STATUS_ERROR;
    item.error = error;

    // Broadcast that there was an error uploading a file
    const errorData = useUploadsManager
        ? {
            item,
            error
        }
        : {
            file,
            error
        };

    onError(errorData);
};

/**
 * Handles a successful upload.
 *
 * @private
 * @param {UploadItem} item - Upload item corresponding to success event
 * @param {BoxItem[]} entries - Successfully uploaded Box File objects
 * @return {void}
 */
export function handleUploadSuccess = (item: UploadItem, entries?: BoxItem[]) => {
    item.progress = 100;
    item.status = STATUS_COMPLETE;

    const [boxItem] = entries;
    boxItem.permissions = {
        can_preview: true
    };
    this.preview(boxItem);
};
