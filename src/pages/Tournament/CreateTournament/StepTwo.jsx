import React from 'react'
import CustomSelectField from '../../../components/CustomSelectField/CustomSelectField'
import { toast } from 'react-toastify'
import { txt } from '../../../common/context'
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons'
import BallIcon from '../../../assets/images/svg/ball.svg'
import PitchIcon from '../../../assets/images/svg/pitch.svg'
import CustomNumberField from '../../../components/CustomNumberField/CustomNumberField'

function StepTwo({ formData, setFormData, handleSubmit }) {
  const ballTypes = ["Tennis Ball", "Red Ball", "White Ball", "Pink Ball"]
  const pitchTypes = ["Indoor", "Matting", "Astra", "Turf", "Grass"]
  const tournamentTypes = ["League", "Knockout", "Group", "Round robin"]
  
  const saveChanges = () => {
    if (!formData.ballType) {
      toast.error("Select a ball type")
      return
    }
    if (!formData.pitchType) {
      toast.error("Select a pitch type")
      return
    }
    if (!formData.tournamentType) {
      toast.error("Select a tournament type")
      return
    }
    if (!formData.overs) {
      toast.error("Enter number of overs")
      return
    }
    if (!formData.teamCount) {
      toast.error("Enter number of teams")
      return
    }
    handleSubmit()
  }

  return (
    <div>
      <CustomSelectField
        title="Ball Type" icon={BallIcon} options={ballTypes}
        value={formData.ballType} setValue={(value) => setFormData("ballType", value)}
      />
      <CustomSelectField
        title="Pitch Type" icon={PitchIcon} options={pitchTypes}
        value={formData.pitchType} setValue={(value) => setFormData("pitchType",value)}
      />
      <CustomSelectField
        title="Tournament Type" options={tournamentTypes}
        value={formData.tournamentType} setValue={(value) => setFormData("tournamentType", value)}
      />
      <CustomNumberField
        title="No. of overs"
        value={formData.overs} maxValue={50}
        setValue={(value) => setFormData("overs", value)}
      />
      <CustomNumberField
        title="No. of teams"
        value={formData.teamCount} maxValue={20}
        setValue={(value) => setFormData("teamCount", value)}
      />
      <PrimaryButton className="mt-15" onClick={() => saveChanges()}>{txt.continue}</PrimaryButton>
    </div>
  )
}

export default StepTwo