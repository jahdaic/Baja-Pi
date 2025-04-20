/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setSpeed, setRPM, setFuel, setHeadlights, setTurnSignal, setCheckEngine, setOilTemp, setOilPressure, setVoltage } from './speedometerSlice';
import { Standard, Formula1, Beetle13, LCD, Cyberpunk, Bajapunk } from './themes';

import '../../css/themes.css';

export interface ISpeedometerTheme {}

export function Speedometer() {
  const dispatch = useAppDispatch();
  const [gauges] = useState<React.FC[]>([Standard, Formula1, Beetle13, LCD, Cyberpunk, Bajapunk]);
  const [currentGauge, setCurrentGauge] = useState<number>(0);
  const [timer, setTimer] = useState<any>(0);

  const VisibleGauge = gauges[currentGauge];

  const nextGauge = () => {
    setCurrentGauge(current =>  current + 1 === gauges.length ? 0 : current + 1);
  };

  const prevGauge = () => {
    setCurrentGauge(current => current === 0 ? gauges.length - 1 : current - 1);
  };

  const updateSpeedometer = () => {
    // dispatch(setSpeed(speed >= Number(process.env.REACT_APP_SPEED_LIMIT) ? 0 : speed + 1));
    // dispatch(setRPM(rpm >= Number(process.env.REACT_APP_RPM_LIMIT) ? 0 : rpm + 1));
    // dispatch(setFuel(fuel >= 100 ? 0 : fuel + 1));
    // dispatch(setOilTemp(oilTemperature >= Number(process.env.REACT_APP_OIL_PRESSURE_REDLINE) ? 0 : oilTemperature + 1));
    // dispatch(setOilPressure(oilPressure >= Number(process.env.REACT_APP_TEMP_REDLINE) ? 0 : oilPressure + 1));
    // dispatch(setVoltage(voltage >= 14 ? 0 : voltage + 0.1));

    dispatch(setSpeed(Math.random() * Number(process.env.REACT_APP_SPEED_LIMIT)));
    dispatch(setRPM(Math.random() * Number(process.env.REACT_APP_RPM_LIMIT)));
    dispatch(setFuel(Math.random() * 100));
    dispatch(setOilTemp(Math.random() * Number(process.env.REACT_APP_OIL_TEMP_LIMIT)));
    dispatch(setOilPressure(Math.random() * Number(70)));
    dispatch(setVoltage(Math.random() * Number(process.env.REACT_APP_VOLTAGE_LIMIT)));


    // dispatch(setOilTemp(oilTemperature >= Number(process.env.REACT_APP_OIL_PRESSURE_REDLINE) ? 0 : oilTemperature + 1));
    // dispatch(setOilPressure(oilPressure >= Number(process.env.REACT_APP_TEMP_REDLINE) ? 0 : oilPressure + 1));
    // dispatch(setVoltage(voltage >= 14 ? 0 : voltage + 0.1));
    dispatch(setHeadlights(Math.round(Math.random() * 2)));
    dispatch(setTurnSignal(Boolean(Math.round(Math.random()))));
    dispatch(setCheckEngine(Boolean(Math.round(Math.random()))));
  };

  useEffect(() => {
    setTimer((currentTimer: number) => {
      if(currentTimer) clearInterval(currentTimer);
  
      return currentTimer;
    });

    setTimer(setInterval(updateSpeedometer, 1000));

    return () => { clearInterval(timer) }
  }, []);

  return (
    <div>
      <div className="prev-button" onClick={prevGauge} />
      <div className="next-button" onClick={nextGauge} />

      <VisibleGauge />
    </div>
  );
}

export default Speedometer;