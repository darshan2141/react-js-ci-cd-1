import React from 'react'
import CustomTextField from '../../../components/CustomMUI/CustomTextField'
import { txt } from '../../../common/context'
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons'

function StepOne({ formData, setFormData, handleSubmit }) {

  const saveChanges = (e) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <form onSubmit={saveChanges}>
      <CustomTextField
        label="Name" type="text" value={formData.name}
        onChange={(e) => setFormData("name", e.target.value)}
      />
      <CustomTextField
        label="Start Date" type="date" value={formData.startDate} InputLabelProps={{ shrink: true }}
        onChange={(e) => setFormData("startDate", e.target.value)}
      />
      <CustomTextField
        label="End Date" type="date" value={formData.endDate} InputLabelProps={{ shrink: true }}
        onChange={(e) => setFormData("endDate", e.target.value)}
      />
      <CustomTextField
        label="Ground" type="text" value={formData.ground}
        onChange={(e) => setFormData("ground", e.target.value)}
      />
      <PrimaryButton className="mt-15" type="submit">{txt.continue}</PrimaryButton>
    </form>
  )
}

export default StepOne