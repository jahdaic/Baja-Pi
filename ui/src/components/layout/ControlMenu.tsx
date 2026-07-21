import React, { useState } from 'react';
import config from '../../config';

type Action = 'chromium-restart' | 'chromium-stop' | 'reboot' | 'shutdown';

export interface IControlMenu {
	onClose: () => void;
}

// Display order, top to bottom: least destructive first.
const ORDER: Action[] = ['chromium-restart', 'chromium-stop', 'reboot', 'shutdown'];

const LABEL: Record<Action, string> = {
	'chromium-restart': 'Restart Chromium',
	'chromium-stop': 'Close Chromium',
	reboot: 'Reboot Pi',
	shutdown: 'Shutdown Pi',
};

// Actions that take the display down get a second, confirming tap — a stray tap
// in a moving car shouldn't reboot the Pi or kill the kiosk. Restart Chromium is
// one tap: it recovers on its own.
const CONFIRM: Partial<Record<Action, string>> = {
	'chromium-stop': 'Confirm close?',
	reboot: 'Confirm reboot?',
	shutdown: 'Confirm shutdown?',
};

export const ControlMenu: React.FC<IControlMenu> = ({ onClose }) => {
	const [confirming, setConfirming] = useState<Action | null>(null);
	const [busy, setBusy] = useState<Action | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fire = async (action: Action) => {
		setBusy(action);
		setError(null);
		try {
			const res = await fetch(`${config.controlServerUrl}/control`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action }),
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			// reboot / shutdown / chromium-stop take the screen down; chromium-restart
			// reloads shortly. Either way there's nothing more to show — close the menu.
			onClose();
		} catch (err: any) {
			setError(`${LABEL[action]} failed: ${err?.message ?? 'unreachable'}`);
			setBusy(null);
			setConfirming(null);
		}
	};

	const tap = (action: Action) => {
		if (busy) return;
		// First tap on a destructive action arms it; second tap fires.
		if (CONFIRM[action] && confirming !== action) {
			setConfirming(action);
			return;
		}
		fire(action);
	};

	const labelFor = (action: Action) =>
		busy === action ? '…' : confirming === action ? CONFIRM[action] : LABEL[action];

	return (
		<div className="control-menu-backdrop" onClick={onClose}>
			<div className="control-menu" onClick={e => e.stopPropagation()}>
				<div className="control-menu-title">Controls</div>
				{ORDER.map(action => (
					<button
						key={action}
						type="button"
						className={`control-menu-button${confirming === action ? ' confirming' : ''}`}
						onClick={() => tap(action)}
						disabled={!!busy}
					>
						{labelFor(action)}
					</button>
				))}
				{error && <div className="control-menu-error">{error}</div>}
				<button type="button" className="control-menu-button cancel" onClick={onClose}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default ControlMenu;
