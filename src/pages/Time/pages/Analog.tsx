/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import Clock from 'react-clock';
import PositionedElement from '../../../components/layout/PositionedElement';

import '../../../css/time.css';
import 'react-clock/dist/Clock.css';

export interface IAnalog {
	children?: React.ReactElement<any, any> | null;
}

export const Analog: React.FC<IAnalog> = () => {
	const [time, setTime] = useState(new Date());
	const size = window.innerHeight;

	const updateTime = () => {
		setTime(new Date());
	};

	useEffect(() => {
		const interval = setInterval(updateTime, 500); // 0.5 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<LayoutContainer id="time">
			<PositionedElement width="100vh" height="100vh" top="0vh" left="0vh">
				<Clock
					value={time}
					size="100vh"
					hourHandWidth={size * 0.0166}
					hourHandLength={70}
					minuteHandWidth={size * 0.0166}
					minuteHandLength={85}
					secondHandWidth={size * 0.0041}
					secondHandLength={90}
					hourMarksWidth={size * 0.0166}
					renderNumbers
				/>
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Analog;
