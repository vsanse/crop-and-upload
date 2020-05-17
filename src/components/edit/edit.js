import React, { useState } from "react";
import * as config from "../../global/config.json";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "../button";

export default function Edit(props) {
    const [crop, setCrop] = useState({
        ...config.CROP_PREVIEW[props.currentId],
    });
    const changeCrop = (updatedCrop) => {
        setCrop({
            ...crop,
            x: updatedCrop.x,
            y: updatedCrop.y,
        });
    };
    return (
        <div>
            <ReactCrop
                src={props.originalImage.preview}
                onComplete={() => {}}
                onChange={changeCrop}
                crop={crop}
                locked
            />
            <Button
                className="primary-btn primary-btn-fixed-top-right"
                onClick={() => props.onSave(crop, props.currentId)}
            >
                Save
            </Button>
        </div>
    );
}
