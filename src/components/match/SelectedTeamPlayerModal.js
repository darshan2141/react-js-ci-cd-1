import React, { useEffect, useState } from 'react'
import Header from '../CustomMUI/Header';
import { txt } from "../../common/context";
import CustomCard from '../CustomMUI/CustomCard';
import CustomRMPlayerBottomSheet from '../CustomMUI/CustomRMPlayerBottomSheet';
import { CustomAddPlayerButton } from '../CustomMUI/CustomSmallButton';
import { Box, CardActions } from '@material-ui/core';
import { PrimaryButton } from '../CustomMUI/CustomButtons';
import CustomBottomSheet from '../CustomMUI/CustomBottomSheet';
import { ShowToast } from '../CustomMUI/ToastMessage';
import CustomPhoneBottomSheet from '../CustomMUI/CustomPhoneBottomSheet';


const SelectedTeamPlayerModal = ({ show, setIsShow, selectedTeam, handleAction }) => {

    const [selectedTeamData, setSelectedTeamData] = useState();
    const [isRemovePlayer, setIsRemovePlayer] = useState(false);
    const [selectedRmPlayer, setSelectedRmPlayer] = useState();
    const [isOpenSheetTwo, setIsOpenSheetTwo] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState()
    const [isOpenSheetOne, setIsOpenSheetOne] = useState(false);

    useEffect(() => {
        let players = selectedTeam?.playerList.map((obj) => {
            return {
                ...obj, // Spread operator to copy the existing properties
                isVerified: selectedTeam?.owner?._id === localStorage.getItem("loggedInUserId"), // New parameter to add
            };
        });

        setSelectedTeamData({ ...selectedTeam, playerList: players })
    }, [selectedTeam])

    const removePlayer = () => {
        let data = selectedTeamData?.playerList.map((item) => {
            if (item._id == selectedRmPlayer._id) {
                return {
                    ...item, // Spread operator to copy the existing properties
                    isVerified: false, // New parameter to add
                };
            } else {
                return item;
            }
        });

        data = data.filter((item) => item.isVerified)

        setSelectedTeamData({ ...selectedTeamData, playerList: data })
        setIsRemovePlayer(false);
        setSelectedRmPlayer()
    };

    const playerVerified = () => {
        let data = selectedTeamData?.playerList.map((item) => {
            if (item._id == selectedPlayer._id) {
                return {
                    ...item,
                    isVerified: true,
                };
            } else {
                return item;
            }
        });
        setSelectedTeamData({ ...selectedTeamData, playerList: data })
    };

    const onPressConfirmTeam = () => {
        setIsOpenSheetTwo(true)
    }

    const onPressContinue = () => {

        if (selectedTeamData?.playerList.length < 5) {
            ShowToast("Add at least 6 players before creating a team", {
                position: "top-right",
                type: "error",
            });
            return;
        }
        if (selectedTeamData?.playerList.length > 17) {
            ShowToast("Team can have only 16 players", {
                position: "top-right",
                type: "error",
            });
            return;
        }
        setIsOpenSheetTwo(false);
        setIsShow(0)
        handleAction(selectedTeamData);
    }

    if (show !== 2) {
        return;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div>
                    <Header
                        title={selectedTeam?.name}
                        isModal={true}
                        closeModal={() => setIsShow(1)}
                    />

                    <div className="container top-padding">
                        <p className="text-left text-color">
                            {txt.confirm_the_players_to_select_and_finalize_your_team}
                        </p>
                    </div>


                    <div className="player-card-details">
                        {
                            selectedTeamData?.playerList?.map((item, index) => (
                                <CustomCard key={index}
                                    from={selectedTeam?.owner?._id === localStorage.getItem("loggedInUserId") && "createTeam"}
                                    player={item}
                                    name={item.isVerified ? "Verified" : "Verify"}
                                    onClick={(value) => {
                                        if (selectedTeam?.owner?._id === localStorage.getItem("loggedInUserId")) {
                                            setSelectedRmPlayer(value)
                                            setIsRemovePlayer(true)
                                        } else {
                                            setSelectedPlayer(value);
                                            console.log("clickVerify", value.contactNo);
                                            setIsOpenSheetOne(true);
                                        }
                                    }}
                                />
                            ))
                        }
                    </div>
                    {
                        (selectedTeam?.owner?._id === localStorage.getItem("loggedInUserId") || !!(selectedTeamData?.playerList.length >= 16)) &&
                        <CardActions className="card-actions">
                            <CustomAddPlayerButton
                                name={txt.add_more_player}
                                onClick={() => { setIsShow(3) }}
                            />
                        </CardActions>
                    }

                    <Box sx={{ mt: '20px' }}>
                        <PrimaryButton onClick={onPressConfirmTeam}
                            disabled={selectedTeamData?.playerList.length > 16 || selectedTeamData?.playerList.length < 6 || selectedTeamData?.playerList.some((player) => player.isVerified === false)}>
                            {txt.confirm_team}
                        </PrimaryButton>
                    </Box>


                    <CustomRMPlayerBottomSheet
                        isOpen={isRemovePlayer}
                        onDismiss={() => {
                            setIsRemovePlayer(false);
                            setSelectedRmPlayer();
                        }}
                        player={selectedRmPlayer}
                        onButton1Click={removePlayer}
                        onButton2Click={() => {
                            setIsRemovePlayer(false);
                            setSelectedRmPlayer();
                        }}
                    />

                    <CustomPhoneBottomSheet
                        isOpen={isOpenSheetOne}
                        onDismiss={() => {
                            setIsOpenSheetOne(false);
                        }}
                        onButton1Click={() => {
                            setIsOpenSheetOne(false);
                            setIsOpenSheetTwo(true);
                            playerVerified();
                        }}
                        selectedPlayer={selectedPlayer}
                    />


                    <CustomBottomSheet
                        isOpen={isOpenSheetTwo}
                        onDismiss={() => {
                            setIsOpenSheetTwo(false);
                        }}
                        onButton1Click={() => {
                            if (selectedPlayer) {
                                setIsOpenSheetTwo(false);
                                setSelectedPlayer(null);
                            } else {
                                onPressContinue()
                            }
                        }}
                        messageText={selectedPlayer ? txt.verification_successful : selectedTeam?.name + " " + txt.selected_successfully}
                        button1Text={txt.continue}
                    />

                </div>
            </div>


        </div>
    )
}

export default SelectedTeamPlayerModal