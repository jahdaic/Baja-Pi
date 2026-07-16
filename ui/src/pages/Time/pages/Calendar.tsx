import React, { useEffect, useState } from 'react';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import { Calendar as ReactCalendar } from 'react-calendar';
import PositionedElement from '../../../components/layout/PositionedElement';
import { useAppSelector } from '../../../store/hooks';
import * as Utility from '../../../scripts/Utility';

import '../../../css/time.css';
import 'react-clock/dist/Clock.css';

export interface ICalendar {
	children?: React.ReactElement<any, any> | null;
}

export const Calendar: React.FC<ICalendar> = () => {
	const timezone = useAppSelector(state => state.weather.weather.timezone);
	const [date, setDate] = useState<any>(() => Utility.getZonedDate(timezone));

	useEffect(() => {
		// Track "today" in the current location's time zone (device-local until known).
		setDate(Utility.getZonedDate(timezone));
		const interval = setInterval(() => setDate(Utility.getZonedDate(timezone)), 60000); // 1 minute

		return () => clearInterval(interval);
	}, [timezone]);

	return (
		<LayoutContainer id="time">
			<PositionedElement width="80vh" height="70vh" top="9vh" left="10vh">
				<ReactCalendar value={date} calendarType="gregory" onChange={value => setDate(value)} />
			</PositionedElement>
		</LayoutContainer>
	);
};

export default Calendar;
