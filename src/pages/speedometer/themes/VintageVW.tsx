import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSpeedometer } from '../speedometerSlice';
import RadialGauge from '../../../components/gauges/RadialGauge';
import G3Gauge from '../../../components/gauges/G3Gauge';

export const VintageVW = () => {
  const {speed} = useAppSelector(selectSpeedometer);

  return (
    <div id="vintagevw" className="expand">
        <RadialGauge
          value={speed}
        //   units="MPH"
        //   title="Speedometer"
          minValue={0}
          maxValue={90}
          majorTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]}
		  minorTicks={2}
		  numbersMargin={-35}
          highlights={[{from: 14.5, to: 15.5, color: 'red'}, {from: 31, to: 32, color: 'red'}, {from: 47, to: 48, color: 'red'}]}

		  colorPlate="#000000"
		  colorNeedle="#E1DFAE"
		  colorBorderOuter="#000000"
		  colorBorderOuterEnd="#000000"
		  colorBorderMiddle="green"
		  colorBorderMiddleEnd="green"
		  colorBorderInner="red"
		  colorBorderInnerEnd="red"
		  colorNeedleCircleOuter="yellow"
		  colorNeedleCircleInner="purple"

		  borders={true}
		  borderOuterWidth={75}
		  borderMiddleWidth={100}
		  borderInnerWidth={75}
        />

		<G3Gauge name={''} metric={''} unit={''} value={0} />
    </div>
  );
};

export default VintageVW;