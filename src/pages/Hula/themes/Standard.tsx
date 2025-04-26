/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import HulaGirl from '../../../images/hula/hula-girl.gif';

export interface IStandard {
	children?: React.ReactElement<any, any> | null;
}

export const Standard: React.FC<IStandard> = () => {
	return (
		<LayoutContainer id="standard">
			<PositionedElement width="100%" height="100%" top="0" left="0" center>
				<img src={HulaGirl} alt="Hula" height="100%" />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Standard;
