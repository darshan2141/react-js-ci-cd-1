import { Avatar, Box, Card, Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { CustomCardButton } from './CustomSmallButton'

const TeamCard = ({ teamData, handleAction, btnTitle }) => {

    return (
        <>
            <Card elevation={0} style={{ background: 'none' }}>
                <Box sx={{ paddingBottom: "5%" }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Avatar
                                src={teamData?.name}
                                alt={teamData?.name}
                                sx={{ width: 60, height: 60 }}
                            />
                        </Grid>
                        <Grid item xs>
                            <Box>
                                <div
                                    style={{
                                        color: "#000",
                                        fontFamily: "DM Sans",
                                        fontWeight: 400,
                                        fontSize: "15px",
                                    }}
                                >
                                    {teamData?.name}
                                </div>
                            </Box>
                        </Grid>
                        <Grid item>
                            <CustomCardButton
                                onClick={() => {
                                    handleAction(teamData)
                                }}
                                name={btnTitle || 'Select'}
                            ></CustomCardButton>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </>
    )
}

export default TeamCard