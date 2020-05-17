import React, { useState, useEffect } from "react";
import * as config from "../../global/config.json";
import "./preview.scss";
import Modal from "../modal";
import Edit from "../edit";
import Button from "../button";
export default function Preview(props) {
    const [previews, setPreviews] = useState(config.CROP_PREVIEW);
    const [previewUrl, setPreviewUrl] = useState([]);
    const [isBackdropVisible, setIsBackdropVisible] = useState(false);
    const [currentId, setCurrentId] = useState(-1);

    useEffect(() => {
        let promiseArr = [];
        for (const preview of Object.keys(previews)) {
            promiseArr.push(
                createCropPreview(previews[preview], `${preview}.jpeg`)
            );
        }
        Promise.all(promiseArr).then((values) => {
            setPreviewUrl(values);
        });
    }, [props.image, previews]);

    const onCancel = function () {
        setIsBackdropVisible(!isBackdropVisible);
        document.querySelector("body").classList.toggle("modal-open");
    };

    const createCropPreview = async (crop, fileName) => {
        if (props.image) {
            const canvas = document.createElement("canvas");
            const scaleX = props.image.naturalWidth / props.image.width;
            const scaleY = props.image.naturalHeight / props.image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                props.image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error("Canvas is empty"));
                        return;
                    }
                    blob.name = fileName;
                    resolve(window.URL.createObjectURL(blob));
                }, "image/jpeg");
            });
        }
    };

    const editPreview = (idx) => {
        onCancel();
        setCurrentId(idx);
    };

    const saveEditedPreview = (crop, id) => {
        onCancel();
        let existingPreviews = { ...previews };
        existingPreviews[id] = crop;
        setPreviews(existingPreviews);
    };

    return (
        <div className={`gallery ${props.image ? "active" : ""}`}>
            <div className="header">
                <p>Preview</p>
                <Button>Upload All</Button>
            </div>
            <div className="img-container">
                {previewUrl.map((url, idx) => {
                    let PREVIEW = Object.keys(previews)[idx];
                    return url ? (
                        <div className="img" key={idx}>
                            <img alt="crop preview" src={url} />
                            <p>
                                {PREVIEW}: {previews[PREVIEW].width} x{" "}
                                {previews[PREVIEW].height}
                            </p>
                            <Button
                                className="primary-btn"
                                onClick={() =>
                                    editPreview(Object.keys(previews)[idx])
                                }
                            >
                                Edit
                            </Button>
                        </div>
                    ) : (
                        ""
                    );
                })}
            </div>
            {isBackdropVisible && (
                <Modal onCancel={onCancel} visible={isBackdropVisible}>
                    <Edit
                        originalImage={props.originalImage}
                        currentId={currentId}
                        onSave={saveEditedPreview}
                    />
                </Modal>
            )}
        </div>
    );
}
