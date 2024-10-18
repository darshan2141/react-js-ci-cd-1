import React, { useEffect, useState } from 'react'
import { BottomSheet } from 'react-spring-bottom-sheet'
import CloseIcon from "../../assets/images/svg/close.svg";
import RightArrow from "../../assets/images/svg/rightArrow.svg";
import { txt } from "../../common/context";
import { FormControlLabel, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import clsx from 'clsx';
import { PrimaryButton } from '../CustomMUI/CustomButtons';
import { toast } from 'react-toastify';
import BottomDrawer from '../BottomDrawer/BottomDrawer';


const OptionsBottonSheet = ({ isOpen, onDismiss, title, providedIcon, options, value, setValue }) => {
	const [selectedOption, setSelectedOption] = useState(value);

	useEffect(() => {
		setSelectedOption(value)
	}, [value, isOpen])

	const useStyles = makeStyles({
		root: {
			'&:hover': {
				backgroundColor: 'transparent',
			},
		},
		icon: {
			borderRadius: '50%',
			width: 40,
			height: 40,
			boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
			backgroundColor: '#f5f8fa',
			backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
			'$root.Mui-focusVisible &': {
				outline: '2px auto rgba(19,124,189,.6)',
				outlineOffset: 2,
			},
			'input:hover ~ &': {
				backgroundColor: '#ebf1f5',
			},
			'input:disabled ~ &': {
				boxShadow: 'none',
				background: 'rgba(206,217,224,.5)',
			},
		},
		checkedIcon: {
			backgroundColor: '#137cbd',
			backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
			'&:before': {
				display: 'block',
				width: 40,
				height: 40,
				backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
				content: '""',
			},
			'input:hover ~ &': {
				backgroundColor: '#106ba3',
			},
		},
	});

	const classes = useStyles();

	const handleSubmit = () => {
		if (!selectedOption) {
			toast.error(`Please select a ${title}`)
			return
		}
		setValue(selectedOption)
		onDismiss()
	}

	return (
		<BottomDrawer isOpen={isOpen} onDismiss={onDismiss} title={title} providedIcon={providedIcon}>
			<RadioGroup
				name={title} className="mt-15"
				value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}
			>
				{options.map((option, index) => (
					<FormControlLabel
						key={index} value={option}
						label={<span style={{ fontSize: "20px", fontWeight: '600' }}>{option}</span>}
						control={
							<Radio
								disableRipple color="default"
								checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
								icon={<span className={classes.icon} />}
							/>
						}
					/>
				))}
			</RadioGroup>
			<PrimaryButton className="mt-15" onClick={() => handleSubmit()}>{txt.confirm}</PrimaryButton>
		</BottomDrawer>
	)
}

export default OptionsBottonSheet