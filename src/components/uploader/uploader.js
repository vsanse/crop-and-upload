import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import './uploader.scss';
import * as config from '../../global/config.json';

export default function Uploader() {
    const _URL = window.URL || window.webkitURL;
    const [galleryImages, setGalleryImages] = useState([]);
    const onDrop = (acceptedFiles) => {
        if (config.APPLY_SIZE_CONSTRAINT) {
            const validFiles = [];
            for (const file of acceptedFiles) {
                let img = new Image();
                img.src = _URL.createObjectURL(file);
                img.onload = () => {
                    if (
                        img.width === config.ALLOWED_WIDTH &&
                        img.height === config.ALLOWED_HEIGHT
                    ) {
                        validFiles.push(file);
                    }
                };
            }
            setGalleryImages(validFiles);
        } else {
            setGalleryImages(acceptedFiles);
        }
    };

    return (
        <div className='dropzone-container'>
            <Dropzone
                onDrop={onDrop}
                accept='image/*'
                multiple={config.ALLOW_MULTIPLE}
            >
                {({
                    getRootProps,
                    getInputProps,
                    isDragReject,
                    isDragActive,
                }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {isDragReject &&
                            'File type not accepted, please upload an image!'}
                        {!isDragActive &&
                            'Click here or drop a file to upload!'}
                        {isDragActive &&
                            !isDragReject &&
                            'Drop it like it\'s hot!'}
                    </div>
                )}
            </Dropzone>
        </div>
    );
}
