import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn, isContactNo, isInputValid } from '../../common/Common';
import CustomTextField from "../CustomMUI/CustomTextField";
import { PrimaryButton, SecondaryButton } from "../CustomMUI/CustomButtons";

class AddGuestPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            contactNo: "",
            isLoading: false,
            errorText: ""
        };
    }

    componentDidMount() {
        checkIfUserLoggedIn(this.props.history);
    }

    handleAddGuestPlayer() {
        const { firstName, lastName, contactNo } = this.state;

        if (isInputValid(firstName)) {
            this.setState({ errorText: "*Please enter first name" })
            return;
        }
        if (isInputValid(lastName)) {
            this.setState({ errorText: "*Please enter last name" })
            return;
        }
        if (isInputValid(contactNo)) {
            this.setState({ errorText: "*Please enter contact number" })
            return;
        }
        if (!isContactNo(contactNo)) {
            this.setState({ errorText: "*Please enter a valid contact number" })
            return;
        }

        let params = {
            firstName: firstName,
            lastName: lastName,
            contactNo: contactNo
        };

        this.setState({ isLoading: true });

        sendHttpRequest("POST", BASE_URL + "/api/player", null, JSON.stringify(params)).then((data) => {
            this.setState({ isLoading: false })
            this.props.reloadGuestPlayers()
            this.props.onClose()
        }).catch((error) => {
            this.setState({ isLoading: false });
            this.setState({ errorText: "*" + error.message })
        });
    }

    render() {
        const { firstName, lastName, contactNo, isLoading, errorText } = this.state;
        return (
            <div>
                <h2 className='text-primary'>Add Guest Player</h2>
                <h4 style={{ color: '#ff1744' }}>{errorText}</h4>
                <CustomTextField
                    className='text-primary'
                    type="name"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => this.setState({ firstName: e.target.value })}
                />
                <CustomTextField
                    className='text-primary'
                    type="name"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => this.setState({ lastName: e.target.value })}
                />
                <CustomTextField
                    className='text-primary'
                    type="tel"
                    label="Contact Number"
                    value={contactNo}
                    onChange={(e) => this.setState({ contactNo: e.target.value })}
                />
                <div className='flex-center mt-15 mb-15'>
                    <SecondaryButton className="me-15 cancel-btn" onClick={() => this.props.onClose()}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton onClick={() => this.handleAddGuestPlayer()}>
                        {isLoading ? <CircularProgress /> : "Add Player"}
                    </PrimaryButton>
                </div>
            </div>
        );
    }
}
export default AddGuestPlayer;