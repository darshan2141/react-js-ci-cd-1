import React from 'react'
import { BottomSheet } from 'react-spring-bottom-sheet'
import CloseIcon from "../../assets/images/svg/close.svg";
import RightArrow from "../../assets/images/svg/rightArrow.svg";
import './BottomDrawer.css'

const BottomDrawer = ({ isOpen, onDismiss, title, providedIcon, children }) => {
  return (
    <BottomSheet open={isOpen} onDismiss={onDismiss} >
      <div className="container">
        <div className="flex-between mb-15">
          <img src={providedIcon || RightArrow} alt="Drawer Icon" />
          <img src={CloseIcon} alt="Close" style={{ cursor: 'pointer' }} onClick={onDismiss} />
        </div>
        <div className="sheet-header-text">{title}</div>
        <div className="sheet-description-text"> {`Select the desired ${title}`} </div>
        {children}
      </div>
    </BottomSheet>
  )
}

export default BottomDrawer