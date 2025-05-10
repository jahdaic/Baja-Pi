/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import { Calendar as ReactCalendar } from 'react-calendar';
import PositionedElement from '../../../components/layout/PositionedElement';

import '../../../css/time.css';
import 'react-clock/dist/Clock.css';

export interface ICalendar {
	children?: React.ReactElement<any, any> | null;
}

export const Calendar: React.FC<ICalendar> = () => {
	const [date, setDate] = useState<any>(new Date());

	return (
		<LayoutContainer id="time">
			<PositionedElement width="80vh" height="70vh" top="9vh" left="10vh">
				<ReactCalendar value={date} onChange={value => setDate(value)} />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Calendar;
