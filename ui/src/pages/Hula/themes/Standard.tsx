/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import HulaGirl from '../../../images/hula/hula-girl.gif';
import HulaBG from '../../../images/hula/hula-bg.jpg';

export interface IStandard {
	children?: React.ReactElement<any, any> | null;
}

export const Standard: React.FC<IStandard> = () => {
	return (
		<LayoutContainer id="standard" style={{ backgroundImage: `url('${HulaBG}')` }}>
			<PositionedElement width="75%" height="75%" bottom="5vh" left="12.5vh" center>
				<img src={HulaGirl} alt="Hula" height="100%" />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Standard;
