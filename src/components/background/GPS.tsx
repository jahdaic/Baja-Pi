/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSpeedometer, setLocation, setSpeed } from '../../store/siteSlice';
import * as Utility from '../../scripts/Utility';

export interface IGPS {
	stop?: boolean;
	children: React.ReactElement<any, any> | null;
}

const GPS: React.FC<IGPS> = ({ stop, children, ...props }) => {
	const dispatch = useAppDispatch();
	const { speed, location } = useAppSelector(selectSpeedometer);
	const timeout = 500; // 500ms
	const [timeoutID, setTimeoutID] = useState<any>(0);

	const updateLocation = () => {
		if (stop) return;

		try {
			fetch(process.env.REACT_APP_GPSD_SERVER_URL || '')
				.then(response => response.json())
				.then(gps => {
					dispatch(
						setLocation({
							latitude: gps?.lat || location.latitude || 0,
							longitude: gps?.lon || location.longitude || 0,
							altitude: Utility.metersToFeet(gps?.altMSL || 0) || location.altitude || 0,
							speed: Utility.metersPerSecondToMPH(gps?.speed || 0) || location.speed || 0,
							heading: gps?.track || location.heading || 0,
							climb: Utility.metersToFeet(gps?.climb || 0) || location.climb || 0,
							error: {
								latitude: Utility.metersToFeet(gps?.epx || 0) || location.error.latitude || 0,
								longitude: Utility.metersToFeet(gps?.epy || 0) || location.error.longitude || 0,
								altitude: Utility.metersToFeet(gps?.epv || 0) || location.error.altitude || 0,
								speed: Utility.metersPerSecondToMPH(gps?.eps || 0) || location.error.speed || 0,
								heading: gps?.epd || location.error.heading || 0,
								climb: Utility.metersToFeet(gps?.epc || 0) || location.error.climb || 0,
								request: '',
							},
						}),
					);

					dispatch(setSpeed(Utility.metersPerSecondToMPH(gps?.speed || 0) || speed || 0));
				})
				.catch(err => {
					console.log(err);

					setLocation({
						...location,
						error: {
							...location.error,
							request: err,
						},
					});
				});

			// if (!response.ok) throw new Error(`Response status: ${response.status}`);

			// const gps = await response.json();

			// dispatch(
			// 	setLocation({
			// 		latitude: gps?.lat || location.latitude || 0,
			// 		longitude: gps?.lon || location.longitude || 0,
			// 		altitude: Utility.metersToFeet(gps?.alt || 0) || location.altitude || 0,
			// 		speed: Utility.metersPerSecondToMPH(gps?.speed || 0) || location.speed || 0,
			// 		heading: gps?.track || location.heading || 0,
			// 		climb: gps?.climb || location.climb || 0,
			// 		error: {
			// 			latitude: gps?.lat || location.error.latitude || 0,
			// 			longitude: gps?.lon || location.error.longitude || 0,
			// 			altitude: Utility.metersToFeet(gps?.epv || 0) || location.error.altitude || 0,
			// 			speed: Utility.metersToFeet(gps?.epx || 0) || location.error.speed || 0,
			// 			heading: gps?.track || location.error.heading || 0,
			// 		},
			// 	}),
			// );
		} catch (error: any) {
			console.log(error.message);
		} finally {
			setTimeoutID(setTimeout(updateLocation, timeout));
		}
	};

	useEffect(() => {
		setTimeoutID(setTimeout(updateLocation, timeout));

		return () => clearTimeout(timeoutID);
	}, []);

	return children;
};

export default GPS;
