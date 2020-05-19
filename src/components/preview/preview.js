import React,{useState,useEffect} from "react";
import * as config from "../../global/config.json";
import "./preview.scss";
import Modal from "../modal";
import Edit from "../edit";
import Button from "../button";
import axios from "axios";
import {NotificationManager} from 'react-notifications';
export default function Preview(props) {
    const [previews,setPreviews]=useState(config.CROP_PREVIEW);
    const [previewUrl,setPreviewUrl]=useState([]);
    const [isBackdropVisible,setIsBackdropVisible]=useState(false);
    const [currentId,setCurrentId]=useState(-1);
    const [images,setImages]=useState([]);
    const [uploadPercentage,setUploadPercentage]=useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        let promiseArr=[];
        for(const preview of Object.keys(previews)) {
            promiseArr.push(
                createCropPreview(previews[preview],`${preview}.jpeg`)
            );
        }
        Promise.all(promiseArr).then((values) => {
            let previewData = { urls:[],blobs:[]};
            values.reduce(populatePreviewData, previewData);
            setImages(previewData.blobs);
            setPreviewUrl(previewData.urls);
        });
    },[props.image,previews]);

    const populatePreviewData = (previewData,value)=>{
        if(value){
            previewData.urls.push(value.url);
            previewData.blobs.push(value.blob);
        }
        return previewData;
    }

    const onCancel=function() {
        setIsBackdropVisible(!isBackdropVisible);
        document.querySelector("body").classList.toggle("modal-open");
    };

    const createCropPreview=async (crop,fileName) => {
        if(props.image) {
            const canvas=document.createElement("canvas");
            const scaleX=props.image.naturalWidth/props.image.width;
            const scaleY=props.image.naturalHeight/props.image.height;
            canvas.width=crop.width;
            canvas.height=crop.height;
            const ctx=canvas.getContext("2d");

            ctx.drawImage(
                props.image,
                crop.x*scaleX,
                crop.y*scaleY,
                crop.width*scaleX,
                crop.height*scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            return new Promise((resolve,reject) => {
                canvas.toBlob((blob) => {
                    if(!blob) {
                        reject(new Error("Canvas is empty"));
                        return;
                    }

                    blob.name=fileName;
                    resolve({
                        blob: blob,
                        url: window.URL.createObjectURL(blob)
                    });
                },"image/jpeg");
            });
        }
    };

    const editPreview=(idx) => {
        onCancel();
        setCurrentId(idx);
    };

    const saveEditedPreview=(crop,id) => {
        onCancel();
        let existingPreviews={...previews};
        existingPreviews[id]=crop;
        setPreviews(existingPreviews);
    };
    const createUploadRequest =(requestsAndConfig, image)=>{
        let url= `${process.env.REACT_APP_CLOUDINARY_ENDPOINT}/${process.env.REACT_APP_CLOUDINARY_VERSION}/${process.env.REACT_APP_CLOUD}/${process.env.REACT_APP_CLOUD_UPLOAD_TYPE}/${process.env.REACT_APP_ACTION}`
        let {requests, config} = requestsAndConfig;
        image.lastModifiedDate=new Date();
        let formData=new FormData();
        formData.append("api_key",process.env.REACT_APP_CLOUD_API);
        formData.append("file",image);
        formData.append("upload_preset",`${process.env.REACT_APP_CLOUD_UPLOAD_PRESET}`);
        requests.push(axios.post(url,formData,config ));
        return requestsAndConfig;
    }
    const uploadToCloud=() => {
        setIsUploading(true);
        let config = {
            onUploadProgress: (progressEvent)=>{
                setUploadPercentage(50);
            }
        }
        const {requests} =images.reduce(createUploadRequest,{requests:[],config})
        axios.all(requests).then(()=>{
            setUploadPercentage(100);
            NotificationManager.success('Uploading images done.')
            setTimeout(()=>{
                setIsUploading(false);
            }, 1000)
        }).catch((err)=>{
            NotificationManager.error('Uploading images failed.');
            setTimeout(()=>{
                setIsUploading(false);
            }, 1000)
        })
       
    }

    return (
        <div className={`gallery ${props.image? "active":""}`}>
            <div className="header">
                <p>Preview</p>
                <Button onClick={uploadToCloud}>Upload All</Button>
            </div>

            { isUploading &&( <progress id = 'upload-progress' value={uploadPercentage} max="100"> `${uploadPercentage}%` </progress>)}
            <div className="img-container">
                {previewUrl.map((url,idx) => {
                    let PREVIEW=Object.keys(previews)[idx];
                    return url? (
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
                    ):(
                            ""
                        );
                })}
            </div>
            {isBackdropVisible&&(
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
