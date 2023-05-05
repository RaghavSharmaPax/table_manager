import React, { ReactNode } from "react";
import "./styles.css";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const Modal = ({
  title,
  children,
  closeModal,
}: {
  title: string;
  children: ReactNode;
  closeModal: () => void;
}) => {
  return (
    <div className="modal__background">
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <Button type="button" text="" onClick={closeModal}>
            <FontAwesomeIcon icon={faClose} />
          </Button>
        </div>
        <hr />
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
