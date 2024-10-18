import React, { useState } from 'react'
import { BottomSheet } from 'react-spring-bottom-sheet'
import CloseIcon from "../../assets/images/svg/close.svg";
import Ball from "../../assets/images/svg/ball.svg";
import { txt } from "../../common/context";
import { makeStyles, Radio } from '@material-ui/core';
import clsx from 'clsx';
import { PrimaryButton } from './CustomButtons';
import CustomOtpInput from './CustomOtpInput';


const CustomOverBottomSheet = ({
    isOpen,
    onDismiss,
    setOver
}) => {
    const [numberOfOver, setNumberOfOver] = useState();
    const [isError, setIsError] = useState(false);

    return (
        <BottomSheet
            open={isOpen}
            onDismiss={onDismiss}
            snapPoints={({ maxHeight }) => [maxHeight - 80, maxHeight / 2.3]}
        >
            <div className="container">
                <div className="header">
                    <img src={Ball} alt="ball" />
                    <img
                        src={CloseIcon}
                        alt="Close"
                        className="close-icon"
                        onClick={onDismiss}
                    />
                </div>
                <div className="content">
                    <p className="sheet-header-text">{txt.number_of_overs}</p>
                    <p className="sheet-description-text">
                        {txt.add_as_per_your_requirement}
                    </p>

                    <div style={{
                        width: 'fit-content',
                        margin: '0 auto'
                    }}>
                        <CustomOtpInput
                            numInputs={2}
                            onChange={(value) => {
                                setIsError(false)
                                setNumberOfOver(value);
                            }}
                        />
                    </div>
                    {isError && <p className="error-message">Please enter valid over</p>}
                    <div className="button-container">
                        <PrimaryButton onClick={() => {
                            if (parseInt(numberOfOver) == 0) {
                                setIsError(true)
                            } else {
                                setOver(parseInt(numberOfOver))
                                onDismiss();
                            }
                        }}>
                            {txt.confirm}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </BottomSheet>
    )
}

export default CustomOverBottomSheet