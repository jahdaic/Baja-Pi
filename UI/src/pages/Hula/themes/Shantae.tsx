/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import ShantaeDance from '../../../images/hula/shantae.gif';
import ShantaeBG from '../../../images/hula/shantae-bg.jpg';

export interface IShantae {
	children?: React.ReactElement<any, any> | null;
}

export const Shantae: React.FC<IShantae> = () => {
	return (
		<LayoutContainer id="standard" style={{ backgroundImage: `url('${ShantaeBG}')` }}>
			<PositionedElement width="70%" height="70%" top="30vh" left="10vh" center>
				<img src={ShantaeDance} alt="Hula" height="100%" />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Shantae;
