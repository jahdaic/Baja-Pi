import React from 'react';
import G3Speedmaster from '../../../components/gauges/G3Speedmaster';

import '../../../css/vintage.css';

export const Vintage = () => {
	return (
		<div
			id="vintage"
			className="expand"
			style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}
		>
			<G3Speedmaster size={window.innerHeight} />
		</div>
	);
};

export default Vintage;
