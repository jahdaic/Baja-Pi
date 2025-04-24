/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import StitchHula from '../../../images/stitch.gif';

export interface IStitch {
	children?: React.ReactElement<any, any> | null;
}

export const Stitch: React.FC<IStitch> = () => {
	return (
		<LayoutContainer id="standard">
			<PositionedElement width="100%" height="100%" top="0" left="0" center>
				<img src={StitchHula} alt="Hula" width="90%" />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Stitch;
