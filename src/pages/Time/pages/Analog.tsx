/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import Clock from 'react-clock';

import '../../../css/weather.css';
import PositionedElement from '../../../components/layout/PositionedElement';

export interface IAnalog {
	children?: React.ReactElement<any, any> | null;
}

export const Analog: React.FC<IAnalog> = () => {
	const [time, setTime] = useState(new Date());

	const updateTime = () => {
		setTime(new Date());
	};

	useEffect(() => {
		const interval = setInterval(updateTime, 500); // 0.5 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<LayoutContainer id="weather" style={{ background: 'red' }}>
			<PositionedElement width="90vh" top="0" left="0">
				<Clock value={time} size="90vh" />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Analog;
