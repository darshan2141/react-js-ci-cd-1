import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@material-ui/core";
import { toast } from "react-toastify";
import { sendHttpRequest, BASE_URL, checkIfUserLoggedIn } from "../../../common/Common";
import MatchIcon from "../../../assets/images/svg/match.svg";
import Header from "../../../components/CustomMUI/Header";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

function CreateTournament(props) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    ground: "",
    ballType: "",
    pitchType: "",
    tournamentType: "",
    overs: 0,
    teamCount: 0,
    registrationDeadline: "",
    currency: "LKR",
    registrationFee: 0,
    liveStreaming: "",
  });

  useEffect(() => {
    checkIfUserLoggedIn(props.history);
  }, [props]);

  const handleFormDataChange = (key, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  function createTournament() {
    const data = {
      ...formData,
      startDate: new Date(formData.startDate).toLocaleDateString(),
      endDate: new Date(formData.endDate).toLocaleDateString(),
      registrationDeadline: new Date(formData.registrationDeadline).toLocaleDateString(),
      createdBy: localStorage.getItem("loggedInUserId")
    }

    setIsLoading(true);
    sendHttpRequest("POST", BASE_URL + "/api/tournament/", null, JSON.stringify(data)).then((res) => {
      toast.success(res.data.message)
      props.history.push("/tournament/all")
    }).catch((error) => {
      toast.error(error?.response?.data?.message)
    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <div className="app-container">
      <Header isModal={step !== 1} closeModal={() => setStep((previousStep) => previousStep - 1)} />
      <Card className="px-15" elevation={0}>
        <CardContent>
          <img src={MatchIcon} className="profile-pic" />
          <h1 className="text-left">Create Tournament</h1>
          <p className="text-left text-color">Start By Entering the details of your tournament</p>
          {step === 1 ? (
            <StepOne formData={formData} setFormData={handleFormDataChange} handleSubmit={() => setStep(2)} />
          ) : step === 2 ? (
            <StepTwo formData={formData} setFormData={handleFormDataChange} handleSubmit={() => setStep(3)} />
          ) : (
            <StepThree formData={formData} setFormData={handleFormDataChange} handleSubmit={() => createTournament()} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateTournament;
