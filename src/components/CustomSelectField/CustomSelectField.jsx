import { KeyboardArrowRight } from '@material-ui/icons'
import React, { useState } from 'react'
import OptionsBottonSheet from './OptionsBottonSheet'

function CustomSelectField({ title, icon, value, setValue, options }) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)

  return (
    <>
      <div
        style={{ fontSize: "16px" }} className='flex-between w-100'
        onClick={() => setShowOptionsMenu(true)}
      >
        <p style={{ color: 'var(--primary-color-700)' }}>{title}</p>
        <p style={{ color: 'var(--color-forgot-password)', fontWeight: "600", display: "flex", alignItems: "center" }}>
          {value} <KeyboardArrowRight />
        </p>
      </div>
      <OptionsBottonSheet
        isOpen={showOptionsMenu}
        onDismiss={() => setShowOptionsMenu(false)}
        title={title} providedIcon={icon}
        options={options} value={value} setValue={setValue}
      />
    </>
  )
}

export default CustomSelectField