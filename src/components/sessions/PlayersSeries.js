import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import PersistentDrawerRight from '../navBar/nav';
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from '../../common/Common'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom'

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sereisDetails: []
        };
        this.getResults = this.getSeriesResults.bind(this);
    }

    componentDidMount() {
        this.getSeriesResults()
        checkIfUserLoggedIn(this.props.history);
    }


    getSeriesResults() {
        sendHttpRequest('GET', BASE_URL + '/api/series/player/' + this.props.match.params.playerId).then((res) => {
            const data = res.data;
            if (data.status === 1) {
                const { sereisDetails } = data.data;
                this.setState({ sereisDetails })
            }
        }
        )
    }

    getMuiTheme = () => createMuiTheme({
        overrides: {
        }
    })

    render() {
        const { sereisDetails } = this.state;
        return (
            <div>
                <PersistentDrawerRight title="Series Results" />
                <div className="app-container -p-tb" style={{ margin: "40px 0" }}>
                    {sereisDetails.length ?
                        (sereisDetails.map((series, index) =>
                            <Card className="card-match">
                                <CardContent>
                                    <Card className="card">
                                        <div className="flex-center-vertical">
                                            <CardContent style={{ padding: '30px 0' }} >
                                                <div className="flex-center-vertical ">
                                                    <Typography className="label" style={{
                                                        width: "65%", height: "1%",
                                                        fontWeight: 'bold', marginBottom: "7%"
                                                    }} variant="h6" component="h6">
                                                        Series {('0' + (index + 1)).slice(-2)}</Typography>
                                                    <Typography className="label" style={{
                                                        width: 'fit-content', padding: '0 20px',
                                                        height: "1%", fontWeight: 'bold', marginBottom: "7%"
                                                    }} variant="h6" component="h6">
                                                        Matches - {series.noOfMatches}</Typography>
                                                    <Typography className="label" style={{
                                                        width: 'fit-content', padding: '0 20px',
                                                        height: "1%", fontWeight: 'bold', marginBottom: "7%"
                                                    }} variant="h6" component="h6">
                                                        Locations - {series.location || 'N/A'}</Typography>
                                                    <Typography className="label" style={{
                                                        width: 'fit-content', padding: '0 20px',
                                                        height: "1%", fontWeight: 'bold', marginBottom: "7%"
                                                    }} variant="h6" component="h6">
                                                        Date - {series.dateOfMatch || 'N/A'}</Typography>
                                                    <Typography className="label" style={{
                                                        width: 'fit-content', padding: '0 20px',
                                                        height: "1%", fontWeight: 'bold', marginBottom: "7%"
                                                    }} variant="h6" component="h6">
                                                        Time - {series.timeOfMatch || 'N/A'}</Typography>
                                                    <Button className="check-series" to={"/series-results/" + series._id}
                                                        component={NavLink} style={{
                                                            width: "80%",
                                                            minWidth: "20ch", height: "1%", fontWeight: 'bold'
                                                        }}>
                                                        Check Series
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </div>
                                    </Card>
                                </CardContent>
                            </Card>
                        )
                        ) : (<div>dafaf</div>)
                    }
                </div>
            </div>
        );
    }
}

export default Results;