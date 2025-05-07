/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import StitchHula from '../../../images/hula/stitch.gif';
import StitchBG from '../../../images/hula/stitch-bg.jpg';

export interface IStitch {
	children?: React.ReactElement<any, any> | null;
}

export const Stitch: React.FC<IStitch> = () => {
	return (
		<LayoutContainer id="standard" style={{ backgroundImage: `url('${StitchBG}')` }}>
			<PositionedElement width="75%" height="75%" bottom="0vh" left="12.5vh" center>
				<img src={StitchHula} alt="Hula" width="90%" />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Stitch;
