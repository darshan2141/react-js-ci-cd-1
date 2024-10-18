import { Card, Dialog, DialogContent, Divider } from '@material-ui/core'
import { Share } from '@material-ui/icons'
import React from 'react'
import { PrimaryButton } from '../CustomMUI/CustomButtons'
import StartMatchModal from './StartMatchModal'
import { checkIfUserLoggedIn } from '../../common/Common'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMatch: null,
      userId: "",
      showStartMatchModal: false,
    };
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    this.setState({ userId: localStorage.getItem('loggedInUserId') })
  }

  render() {
    const { showStartMatchModal, userId } = this.state;
    return (
      <div style={{ width: "100%" }}>
        <Card className="card">
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "45%" }}>
                  <div className="text-primary text-start">
                    <small>{this.props.data.teamA.poolId.name}</small> <br />
                    <h3 className='my-0'>{this.props.data.teamA.name}</h3>
                  </div>
                </td>
                <td style={{ width: "10%" }}>
                  <h2 className="text-primary my-0">vs</h2>
                </td>
                <td style={{ width: "45%" }} className='text-end'>
                  <div className="text-primary">
                    <small>{this.props.data.teamB.poolId.name}</small> <br />
                    <h3 className='my-0'>{this.props.data.teamB.name}</h3>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {!this.props.isTournament && (
            <div>
              <Divider className='mt-15' />
              <div className="flex-between text-primary">
                <div>
                  <div> Ground: {this.props.data.ground} </div>
                  <div> Pitch Type: {this.props.data.pitchType}</div>
                </div>
                <div>
                  <div> Ball: {this.props.data.ballType} </div>
                  <div> Overs: {this.props.data.overs}</div>
                </div>
              </div>
            </div>
          )}
          <Divider className='mb-15' />
          <div className='flex-between'>
            {this.props.data.status === "STARTED" && this.props.data.createdBy === userId ? (
              <PrimaryButton onClick={() => { this.props.history.push(`/scoresheet/${this.props.data._id}`) }}>
                Score Match
              </PrimaryButton>
            ) : this.props.data.status === "COMPLETE" || this.props.data.status === "STARTED" ? (
              <PrimaryButton onClick={() => { this.props.history.push(`/match/${this.props.data._id}`) }}>
                View Scorecard
              </PrimaryButton>
            ) : this.props.data.status === "NOT-STARTED" && this.props.data.createdBy === userId ? (
              <PrimaryButton onClick={() => this.setState({ showStartMatchModal: true })}>
                Start Match
              </PrimaryButton>
            ) : null}
            <PrimaryButton
              onClick={() => {
                navigator.clipboard.writeText(`https://indoor.fieldr.lk/match/${this.props.data._id}`)
                toast.success("Link copied to clipboard")
              }}>
              <Share />
            </PrimaryButton>
          </div>
        </Card>
        <Dialog fullWidth open={showStartMatchModal} onClose={() => this.setState({ showStartMatchModal: false })} >
          <DialogContent>
            <StartMatchModal
              data={this.props.data}
              onClose={() => this.setState({ showStartMatchModal: false })}
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withRouter(Match)