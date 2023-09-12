import { useEffect } from 'react';
import { useState, useRef } from 'react';
import './Viewer.scss';

import { SlMagnifierAdd, SlMagnifierRemove } from 'react-icons/sl';

const Viewer = () => {
	const [index, setIndex] = useState(0);
	const [isDown, setIsDown] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeftState, setScrollLeftState] = useState(null);
	const [mouseMoved, setMouseMoved] = useState(0);
	const [mouseMovedPrev, setMouseMovedPrev] = useState(0);
	const [zoomLevel, setZoomLevel] = useState(1);

	const viewerContainer = useRef();

	const fimeName = `assets/Fotel_HDR/Fotel_HDR_${index}.jpg`;

	const handleMouseDown = (e) => {
		if (zoomLevel === 1) {
			setIsDown(true);
			setStartX(e.pageX - viewerContainer.current.offsetLeft);
			setScrollLeftState(viewerContainer.current.scrollLeft);
			setMouseMoved(0);
		}
	};

	const handleMouseMove = (e) => {
		if (!isDown) {
			return;
		}

		const currentMousePositionInsideContainer =
			e.pageX - viewerContainer.current.offsetLeft;
		setMouseMovedPrev(mouseMoved);
		setMouseMoved(currentMousePositionInsideContainer - startX);
	};
	const zoomIn = () => {
		if (zoomLevel < 3) {
			setZoomLevel(zoomLevel + 1);
		}
	};

	const zoomOut = () => {
		if (zoomLevel > 1) {
			setZoomLevel(zoomLevel - 1);
		}
	};
	useEffect(() => {
		if (mouseMoved % 2 === 0 && mouseMoved !== 0) {
			if (mouseMoved >= 0) {
				if (mouseMoved > mouseMovedPrev) {
					if (index === 35) {
						setIndex(0);
						return;
					} else {
						setIndex((prev) => prev + 1);
					}
				} else {
					if (index === 0) {
						setIndex(35);
						return;
					} else {
						setIndex((prev) => prev - 1);
					}
				}
			} else {
				if (mouseMoved < mouseMovedPrev) {
					if (index === 0) {
						setIndex(35);
						return;
					} else {
						setIndex((prev) => prev - 1);
					}
				} else {
					if (index === 35) {
						setIndex(0);
						return;
					} else {
						setIndex((prev) => prev + 1);
					}
				}
			}
		}
	}, [scrollLeftState, mouseMoved]);
	return (
		<>
			<div
				className={'viewer-container ' + (isDown ? 'is-grabbing' : '')}
				ref={viewerContainer}
				onMouseDown={(e) => {
					handleMouseDown(e);
				}}
				onMouseUp={() => setIsDown(false)}
				onMouseLeave={() => {
					setIsDown(false);
				}}
				onMouseMove={(e) => handleMouseMove(e)}>
				<img
					src={fimeName}
					className='viewer'
					loading='lazy'
					style={{ transform: `scale(${zoomLevel})` }}
				/>
				<div className='control-panel'>
					<button className='magnifier-btn' onClick={zoomIn}>
						<SlMagnifierAdd />
					</button>
					<button className='magnifier-btn' onClick={zoomOut}>
						<SlMagnifierRemove />
					</button>
				</div>
			</div>
		</>
	);
};

export default Viewer;
