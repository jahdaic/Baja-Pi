/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';

import ShantaeDance from '../../../images/shantae.gif';

export interface IShantae {
	children?: React.ReactElement<any, any> | null;
}

export const Shantae: React.FC<IShantae> = () => {
	return (
		<LayoutContainer id="standard">
			<PositionedElement width="100%" height="100%" top="0" left="0" center>
				<img src={ShantaeDance} alt="Hula" height="100%" />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Shantae;
