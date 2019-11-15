import React from 'react';
import { Toast as BToast } from 'react-bootstrap';
import "./Toasts.css";

export type ToastData = {
  title: string;
  dist: number;
  body: string;
};

export type ToastProps = ToastData & {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
};

const Toast: React.FC<ToastProps> = (props: ToastProps) => {
  return (
    <BToast onClick={(e) => props.onClick(e)}>
      <BToast.Header closeButton={false}>
        <strong className='mr-auto'>{props.title}</strong>
        <small>{`${Math.round(props.dist)} m`}</small>
      </BToast.Header>
      <BToast.Body>
        {props.body}
      </BToast.Body>
    </BToast>
  );
};

export type ToastsProps = {
  toasts: ToastData[];
  group: string;
  credit?: JSX.Element;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
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
      {props.toasts.map((toast, key) => <Toast key={key} onClick={props.onClick} {...toast}/>)}
    </div>
  );
};

export default Toasts;
