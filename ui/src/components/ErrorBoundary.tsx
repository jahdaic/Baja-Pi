import React from 'react';

interface IErrorBoundary {
	children: React.ReactNode;
	/** ms before auto-remounting the subtree after an error (0 disables auto-retry). */
	resetAfter?: number;
	/** what to render while errored (defaults to nothing, so only the faulting subtree blanks). */
	fallback?: React.ReactNode;
}

interface IErrorBoundaryState {
	hasError: boolean;
}

/**
 * Catches render/runtime errors in its subtree so a single fault can't black out
 * the whole kiosk. It logs the error, renders a minimal fallback (nothing, by
 * default), and auto-remounts the subtree after a short delay so transient faults
 * self-heal without needing a keyboard on the car dashboard.
 */
export default class ErrorBoundary extends React.Component<IErrorBoundary, IErrorBoundaryState> {
	state: IErrorBoundaryState = { hasError: false };
	private timer?: ReturnType<typeof setTimeout>;

	static getDerivedStateFromError(): IErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: unknown, info: unknown) {
		console.error('[ErrorBoundary]', error, info);

		const delay = this.props.resetAfter ?? 5000;
		if (delay > 0) {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => this.setState({ hasError: false }), delay);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	render() {
		if (this.state.hasError) return this.props.fallback ?? null;
		return this.props.children;
	}
}
