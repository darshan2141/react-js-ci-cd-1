import React from "react";
import { MenuItem } from "@material-ui/core";
import { PrimaryButton, SecondaryButton } from "../CustomMUI/CustomButtons";
import CustomTextField from "../CustomMUI/CustomTextField";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn, isContactNo, isEmail } from "../../common/Common";
import { toast } from "react-toastify";

class EditProfileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      battingStyle: "",
      bowlingArm: "",
      bowlingStyle: "",
      email: "",
      contactNo: "",
    };
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    checkIfUserLoggedIn(this.props.history);
    this.getUserDetails();
  }

  saveChanges() {
    const { battingStyle, bowlingArm, bowlingStyle, email, contactNo } = this.state;

    if (!battingStyle) {
      toast.error("Select Batting Style");
      return;
    }
    if (!bowlingArm) {
      toast.error("Select Bowling Arm");
      return;
    }
    if (!bowlingStyle) {
      toast.error("Select Bowling Style");
      return;
    }
    if (!isEmail(email)) {
      toast.error("Enter valid email address");
      return;
    }
    if (!isContactNo(contactNo)) {
      toast.error("Enter a valid contact number")
      return;
    }

    const data = {
      battingStyle: battingStyle,
      bowlingArm: bowlingArm,
      bowlingStyle: bowlingStyle,
      email: email,
      contactNo: contactNo
    };

    sendHttpRequest("PUT", BASE_URL + "/api/player/" + localStorage.getItem("loggedInUserId"), null, JSON.stringify(data)).then(() => {
      toast.success("Profile Details Updated Successfully");
      this.props.onClose()
    }).catch((error) => {
      toast.error(error.response.data.message)
    });
  }

  getUserDetails() {
    sendHttpRequest("GET", BASE_URL + "/api/player/" + localStorage.getItem("loggedInUserId")).then((res) => {
      this.setState({
        email: res.data.data.email,
        contactNo: res.data.data.contactNo,
        battingStyle: res.data.data.battingStyle,
        bowlingArm: res.data.data.bowlingArm,
        bowlingStyle: res.data.data.bowlingStyle,
      });
    }).catch((error) => {
      toast.error(error.response.data.message)
    });
  }

  render() {
    const { battingStyle, bowlingArm, bowlingStyle, email, contactNo } = this.state;

    return (
      <div>
        <CustomTextField
          className='text-capitalize text-primary'
          select
          label="Batting Style"
          value={battingStyle}
          onChange={(e) => this.setState({ battingStyle: e.target.value })}
        >
          <MenuItem value="Right Hand">Right Hand Batsman</MenuItem>
          <MenuItem value="Left Hand">Left Hand Batsman</MenuItem>
        </CustomTextField>
        <CustomTextField
          select
          label="Bowling Arm"
          value={bowlingArm}
          onChange={(e) => this.setState({ bowlingArm: e.target.value })}
        >
          <MenuItem value="Right Hand">Right Hand</MenuItem>
          <MenuItem value="Left Hand">Left Hand</MenuItem>
        </CustomTextField>
        <CustomTextField
          select
          label="Bowling Style"
          value={bowlingStyle}
          onChange={(e) => this.setState({ bowlingStyle: e.target.value })}
        >
          <MenuItem value="Fast">Fast</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Slow">Slow</MenuItem>
          <MenuItem value="Leg Spin">Leg Spin</MenuItem>
          <MenuItem className='text-capitalize text-primary' value="Off Spin">Off Spin</MenuItem>
        </CustomTextField>
        <CustomTextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => this.setState({ email: e.target.value })}
        />
        <CustomTextField
          label="Contact Number"
          type="tel"
          value={contactNo}
          onChange={(e) => this.setState({ contactNo: e.target.value })}
        />
        <div className='flex-center my-15'>
          <SecondaryButton
            className="me-15 cancel-btn"
            onClick={() => this.props.onClose()}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={this.saveChanges}>
            Save
          </PrimaryButton>
        </div>
      </div>
    );
  }
}

export default EditProfileModal;