import React, { useState } from 'react'
import SelectYourTeamModal from './SelectYourTeamModal';

const CreateMatchModal = () => {

	const [isShow, setIsShow] = useState(true);

	return (
		<>
			{
				!isShow ?
					(<div onClick={() => setIsShow(true)}>CreateMatchModal</div>)
					:
					(
						<SelectYourTeamModal
							show={isShow}
							setIsShow={setIsShow}
						/>
					)
			}
		</>
	)
}

export default CreateMatchModal