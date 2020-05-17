import React, { useState, createRef } from 'react';
import Dropzone from 'react-dropzone';
import './uploader.scss';
import * as config from '../../global/config.json';
import Preview from '../preview';
import { NotificationManager } from 'react-notifications';

export default function Uploader() {
    const _URL = window.URL || window.webkitURL;
    const [galleryImages, setGalleryImages] = useState([]);
    const [elRefs, setElRefs] = React.useState([]);

    const onDrop = (acceptedFiles) => {
        let refs = Array(acceptedFiles.length)
            .fill()
            .map((_, i) => createRef());
        const validFiles = [];
        // eslint-disable-next-line array-callback-return
        acceptedFiles.map((file, idx) => {
            let img = new Image();
            img.src = _URL.createObjectURL(file);
            img.onload = () => {
                if (config.APPLY_SIZE_CONSTRAINT) {
                    if (
                        img.width === config.ALLOWED_WIDTH &&
                        img.height === config.ALLOWED_HEIGHT
                    ) {
                        validFiles.push(
                            Object.assign(file, {
                                preview: img.src,
                            })
                        );
                        refs[idx].current = img;
                    } else {
                        NotificationManager.error(`Inavlid dimensions! Image should be of size ${config.ALLOWED_WIDTH} x ${config.ALLOWED_HEIGHT}`, 'Error!');
      
                    }
                } else {
                    validFiles.push(
                        Object.assign(file, {
                            preview: img.src,
                        })
                    );
                    refs[idx].current = img;
                }
                setElRefs(refs);
            };
            setGalleryImages(validFiles);
        });
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
            {elRefs.map((image, idx) => (
                <Preview key={idx} image={image.current} originalImage = {galleryImages[idx]}  />
            ))}
        </div>
    );
}
