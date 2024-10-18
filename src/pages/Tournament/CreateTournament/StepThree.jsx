import React from 'react'
import CustomSelectField from '../../../components/CustomSelectField/CustomSelectField'
import { toast } from 'react-toastify'
import { txt } from '../../../common/context'
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons'
import CustomTextField from '../../../components/CustomMUI/CustomTextField'
import { CircularProgress, MenuItem } from '@material-ui/core'

function StepThree({ formData, setFormData, handleSubmit, isLoading }) {
  const liveStreamingOptions = ["Yes", "No", "Maybe"]

  const saveChanges = (e) => {
    e.preventDefault()
    if (!formData.liveStreaming) {
      toast.error("Select live streaming option")
      return
    }
    handleSubmit()
  }

  return (
    <form onSubmit={saveChanges}>
      <CustomTextField
        label="Registration Deadline" type="date" value={formData.registrationDeadline} InputLabelProps={{ shrink: true }}
        onChange={(e) => setFormData("registrationDeadline", e.target.value)}
      />
      <div className='flex-between' style={{gap: '1rem'}}>
        <CustomTextField
          select value={formData.currency} fullWidth={false}
          onChange={(e) => setFormData("currencyType", e.target.value)}
          SelectProps={{ IconComponent: () => null }}
        >
          <MenuItem value='LKR'>🇱🇰</MenuItem>
          <MenuItem value='USD'>🇺🇸</MenuItem>
        </CustomTextField>
        <CustomTextField
          label="Registration fee" type="number" value={formData.registrationFee}
          onChange={(e) => setFormData("registrationFee", e.target.value)}
        />
      </div>
      <CustomSelectField
        title="Live streaming" options={liveStreamingOptions}
        value={formData.liveStreaming} setValue={(value) => setFormData("liveStreaming", value)}
      />
      <PrimaryButton
        className="mt-15" type='submit'
        endIcon={isLoading && <CircularProgress color='inherit' size={'1.5rem'} />}
      >
        {txt.confirm}
      </PrimaryButton>
    </form>
  )
}

export default StepThree