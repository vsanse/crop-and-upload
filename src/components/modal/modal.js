import React from 'react'
import './modal.scss';
export default function Modal(props) {
  return (
    <div className={`modal ${props.visible? "active":""}`}>
      <div className={'modal-backdrop'} onClick={props.onCancel}>
      </div>
      <div className={'modal-body'}>
        {props.children}
      </div>
    </div>)
}