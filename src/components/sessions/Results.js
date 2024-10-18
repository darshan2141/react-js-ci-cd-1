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
            matchList: [],
            winningTeam: 'IDK'
        };
        this.getResults = this.getSeriesResults.bind(this);
    }

    componentDidMount() {
        this.getSeriesResults()
        // checkIfUserLoggedIn(this.props.history);
    }


    getSeriesResults() {
        sendHttpRequest('GET', BASE_URL + '/api/series/' + this.props.match.params.seriesId).then((res) => {
            const data = res.data;
            if (data.status === 1) {
                const { matchList } = data.data;
                let winningTeam
                if (data.data.status === 'COMPLETE') {
                    if (matchList.teamARuns == matchList.teamBRuns) { winningTeam = 'Draw' }
                    else { winningTeam = matchList.teamARuns > matchList.teamBRuns ? 'teamA' : 'teamB' }
                }
                else { winningTeam = 'N/A' }
                this.setState({ matchList, winningTeam })
            }
        }
        )
    }

    getMuiTheme = () => createMuiTheme({
        overrides: {
        }
    })

    render() {
        const { matchList, winningTeam } = this.state;
        return (
            <div>
                <PersistentDrawerRight title="Series Results" />
                <div className="app-container -p-tb" style={{ margin: "40px 0" }}>
                    {matchList.map((match, index) =>
                        <Card className="card-match">
                            <CardContent>
                                <Card className="card">
                                    <div className="flex-center-vertical">
                                        <CardContent style={{}} >
                                            <div className="flex-center-vertical ">
                                                <Typography className="label" style={{ width: "65%", height: "1%", fontWeight: 'bold', marginBottom: "7%" }} variant="h6" component="h6"> Match {('0' + (index + 1)).slice(-2)}</Typography>
                                                <Typography className="label" style={{ width: 'fit-content', padding: '0 20px', height: "1%", fontWeight: 'bold', marginBottom: "7%" }} variant="h6" component="h6">Overs - {match.overs || 0}</Typography>
                                                <Typography className="label" style={{ width: 'fit-content', padding: '0 20px', height: "1%", fontWeight: 'bold', marginBottom: "7%" }} variant="h6" component="h6">Won - {winningTeam}</Typography>
                                                <Button className="check-score" to={"/match/" + match._id} component={NavLink} style={{
                                                    width: "80%",
                                                    minWidth: "20ch", height: "1%", fontWeight: 'bold'
                                                }}>
                                                    Check Scoreboard
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </CardContent>
                        </Card>
                    )
                    }
                </div>
            </div>
        );
    }
}

export default Results;
