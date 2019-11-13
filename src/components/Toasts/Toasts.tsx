import React from 'react';
import { Toast as BToast } from 'react-bootstrap';
import "./Toasts.css";

export type ToastProps = {
  title: string;
  info: string;
  body: string;
};

const Toast: React.FC<ToastProps> = (props: ToastProps) => {
  return (
    <BToast>
      <BToast.Header closeButton={false}>
        <strong className='mr-auto'>{props.title}</strong>
        <small>{props.info}</small>
      </BToast.Header>
      <BToast.Body>
        {props.body}
      </BToast.Body>
    </BToast>
  );
};

export type ToastsProps = {
  toasts: ToastProps[];
  group: string;
  credit?: JSX.Element;
};

const Toasts: React.FC<ToastsProps> = (props: ToastsProps) => {
  return (
    <div className="toasts">
      <BToast className="Group-header">
        <BToast.Body>
          <strong className='mr-auto'>{props.group}</strong>
          <small>{props.credit}</small>
        </BToast.Body>
      </BToast>
      {props.toasts.map((toast, key) => <Toast key={key} {...toast}/>)}
    </div>
  );
};

export default Toasts;
