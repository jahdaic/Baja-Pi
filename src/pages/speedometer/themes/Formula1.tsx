import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../speedometerSlice';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import PositionedElement from '../../../components/layout/PositionedElement';
import Panel from '../../../components/layout/Panel';

export const Formula1 = () => {
  const {speed, rpm, fuel, oilTemperature,
	oilPressure,
	voltage,
	headlights,
	turnSignal,
	checkEngine} = useAppSelector(selectSpeedometer);

  return (
	<LayoutContainer id="formula1">
		<Panel width="30%" height="100%" top="0" left="0" borderWidth="2px" noLeftBorder>
			<Panel width="100%" height="20vh" top="20vh" left="0" borderWidth="2px" noLeftBorder noRightBorder>
				<PositionedElement width="100%" height="100%" center>
					<label className="f1-label">Gear</label>
					<div className="f1-value">{'N'}</div>
				</PositionedElement>
			</Panel>
			<Panel width="100%" height="20vh" top="40vh" left="0" borderWidth="2px" noLeftBorder noRightBorder>
				<PositionedElement width="100%" height="100%" center>
					<label className="f1-label">RPM</label>
					<div className="f1-value">{rpm.toFixed(0)}</div>
				</PositionedElement>
			</Panel>
			<Panel width="100%" height="20vh" top="60vh" left="0" borderWidth="2px" noLeftBorder noRightBorder>
				<PositionedElement width="100%" height="100%" center>
					<label className="f1-label">Fuel</label>
					<div className="f1-value">{fuel.toFixed(0)}</div>
				</PositionedElement>
			</Panel>
		</Panel>

		<Panel width="30%" height="100%" top="0" right="0" borderWidth="2px" noRightBorder>
			<Panel width="100%" height="20vh" top="20vh" left="0" borderWidth="2px" noLeftBorder noRightBorder>
				<PositionedElement width="100%" height="100%" center>
					<label className="f1-label">Pres</label>
					<div className="f1-value">{oilPressure.toFixed(0)}</div>
				</PositionedElement>
			</Panel>
			<Panel width="100%" height="20vh" top="40vh" left="0" borderWidth="2px" noLeftBorder noRightBorder>
				<PositionedElement width="100%" height="100%" center>
					<label className="f1-label">Temp</label>
					<div className="f1-value">{oilTemperature.toFixed(0)}</div>
				</PositionedElement>
			</Panel>
			<Panel width="100%" height="20vh" top="60vh" left="0" borderWidth="2px" noLeftBorder noRightBorder>
				<PositionedElement width="100%" height="100%" center>
					<label className="f1-label">Voltage</label>
					<div className="f1-value">{voltage.toFixed(1)}</div>
				</PositionedElement>
			</Panel>
		</Panel>

		<Panel width="100%" height="20vh" top="0" left="0" background="black" borderWidth="2px" noTopBorder noLeftBorder noRightBorder>
			<PositionedElement height="100%" top="0" left="29%" center>
				<div className={`f1-light ${checkEngine ? 'f1-light-red' : ''}`} />
			</PositionedElement>
			<PositionedElement width="6rem" height='100%' top="0" left="CALC(50% - 3rem)" center>
				<div className={`f1-turn-signal ${turnSignal ? 'f1-light-green' : ''}`}>⬌</div>
			</PositionedElement>
			<PositionedElement height="100%" top="0" left="65%" center>
				<div className={`f1-light ${headlights ? 'f1-light-blue' : ''}`} />
			</PositionedElement>
		</Panel>

		<PositionedElement width="6rem" top="35vh" left="CALC(50% - 3rem)" center>
			<div className="f1-speed">{speed.toFixed(0)}</div>
			<label className="f1-label">MPH</label>
		</PositionedElement>
	</LayoutContainer>
  );
};

export default Formula1;