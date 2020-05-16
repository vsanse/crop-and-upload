import React, { useState, useEffect } from "react";
import * as config from "../../global/config.json";
import "./preview.scss";

export default function Preview(props) {
    const PREVIEWS = Object.keys(config.CROP_PREVIEW);
    const [previewUrl, setPreviewUrl] = useState([]);

    useEffect(() => {
        let promiseArr = [];
        for (const preview of PREVIEWS) {
            promiseArr.push(
                createCropPreview(
                    {
                        x: 0,
                        y: 0,
                        width: config.CROP_PREVIEW[preview][0],
                        height: config.CROP_PREVIEW[preview][1],
                    },
                    `${preview}.jpeg`
                )
            );
        }
        Promise.all(promiseArr).then((values) => {
            setPreviewUrl(values);
        });
    }, [props.image]);

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
    return (
        <div className={`gallery ${props.image ? "active" : ""}`}>
            <div className="header">
                <p>Preview</p>
                <button>Upload All</button>
            </div>
            <div className="img-container">
                {previewUrl.map((url, idx) =>
                    url ? (
                        <div className="img" key={idx}>
                            <img alt="crop preview" src={url} />
                            <p>
                                {PREVIEWS[idx]}:{" "}
                                {config.CROP_PREVIEW[PREVIEWS[idx]][0]} x{" "}
                                {config.CROP_PREVIEW[PREVIEWS[idx]][1]}
                            </p>
                        </div>
                    ) : (
                        ""
                    )
                )}
            </div>
        </div>
    );
}
