import React, { ReactNode } from "react";
import "./styles.css";

const Modal = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className="modal__background">
      <div className="modal">
        <h2>{title}</h2>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
