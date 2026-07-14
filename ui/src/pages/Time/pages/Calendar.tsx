/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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

	const updateDate = () => {
		setDate(new Date());
	};

	useEffect(() => {
		const interval = setInterval(updateDate, 60000); // 1 minute

		return () => clearInterval(interval);
	}, []);

	return (
		<LayoutContainer id="time">
			<PositionedElement width="80vh" height="70vh" top="9vh" left="10vh">
				<ReactCalendar value={date} calendarType="gregory" onChange={value => setDate(value)} />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Calendar;
