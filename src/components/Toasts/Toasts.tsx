import React from 'react';
import { Toast as BToast } from 'react-bootstrap';

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
};

const Toasts: React.FC<ToastsProps> = (props: ToastsProps) => {
  return (
    <>
      {props.toasts.map((toast, key) => <Toast key={key} {...toast}/>)}
    </>
  );
};

export default Toasts;
