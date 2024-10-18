import React, { useState } from 'react'
import { BottomSheet } from 'react-spring-bottom-sheet'
import CloseIcon from "../../assets/images/svg/close.svg";
import Pitch from "../../assets/images/svg/pitch.svg";
import { txt } from "../../common/context";
import { makeStyles, Radio } from '@material-ui/core';
import clsx from 'clsx';
import { PrimaryButton } from './CustomButtons';

const CustomPitchTypeBottomSheet = ({
    isOpen,
    onDismiss,
    setPitchType
}) => {

    const useStyles = makeStyles({
        root: {
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
        icon: {
            borderRadius: '50%',
            width: 40,
            height: 40,
            boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
            backgroundColor: '#f5f8fa',
            backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
            '$root.Mui-focusVisible &': {
                outline: '2px auto rgba(19,124,189,.6)',
                outlineOffset: 2,
            },
            'input:hover ~ &': {
                backgroundColor: '#ebf1f5',
            },
            'input:disabled ~ &': {
                boxShadow: 'none',
                background: 'rgba(206,217,224,.5)',
            },
        },
        checkedIcon: {
            backgroundColor: '#137cbd',
            backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
            '&:before': {
                display: 'block',
                width: 40,
                height: 40,
                backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
                content: '""',
            },
            'input:hover ~ &': {
                backgroundColor: '#106ba3',
            },
        },
    });

    const classes = useStyles();
    const [selectedPitch, setSelectedPitch] = useState();

    const pitchType = [
        'Rough',
        'Cement',
        'Turf',
        'Astroturf',
        'Mating',
    ]

    return (
        <BottomSheet
            open={isOpen}
            onDismiss={onDismiss}
            snapPoints={({ maxHeight }) => [maxHeight - 80, maxHeight / 1.4]}
        >
            <div className="container">
                <div className="header">
                    <img src={Pitch} alt="Pitch" />
                    <img
                        src={CloseIcon}
                        alt="Close"
                        className="close-icon"
                        onClick={onDismiss}
                    />
                </div>
                <div className="content">
                    <p className="sheet-header-text">{txt.pitch_type}</p>
                    <p className="sheet-description-text">
                        {txt.select_the_desired_pitch_type}
                    </p>

                    <div>
                        {
                            pitchType.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}>
                                    <Radio
                                        disableRipple
                                        checked={selectedPitch === idx}
                                        color="default"
                                        value={idx}
                                        checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                                        icon={<span className={classes.icon} />}
                                        onChange={(event) => {
                                            setSelectedPitch(idx)
                                        }}
                                    />
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'start'
                                    }}>
                                        <p style={{ fontSize: "20px", fontWeight: '600', margin: 0 }}>{item}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="button-container">
                        <PrimaryButton onClick={() => {
                            if (typeof selectedPitch === "number") {
                                onDismiss();
                                setPitchType(pitchType[selectedPitch])
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

export default CustomPitchTypeBottomSheet