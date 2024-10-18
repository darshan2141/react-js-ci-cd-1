import React from "react";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";

class AccessDenied extends React.Component {
    render() {
        return (
            <div>
                <div className="app-container" style={{ backgroundColor: '#53CDF6' }}>
                    <Card className="card-header" style={{ opacity: '0.8' }}>
                        <CardContent>
                            <Typography variant="h5">
                                403 - Access Denied
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card className="card-header" style={{ opacity: '0.8' }}>
                        <CardContent>
                            <Typography variant="caption">
                                You don't have permission to view this page
                            </Typography>
                        </CardContent>
                    </Card>
                    <Button
                        style={{
                            backgroundColor: "white",
                            color: "#25ccf7",
                            position: "relative",
                            border: "2px solid #25ccf7",
                            marginTop: "20px",
                        }}
                        variant="contained" component={NavLink} to='/'
                    >
                        Login
                    </Button>
                </div>
            </div>
        );
    }
}

export default AccessDenied;