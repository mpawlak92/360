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

	const fileName = `assets/Fotel_HDR/Fotel_HDR_${index}.jpg`;

	const handleMouseDown = (e) => {
		if (zoomLevel === 1) {
			setIsDown(true);

			if (e.pageX === undefined) {
				setStartX(e.touches[0].pageX - viewerContainer.current.offsetLeft);
			} else {
				setStartX(e.pageX - viewerContainer.current.offsetLeft);
			}

			setScrollLeftState(viewerContainer.current.scrollLeft);
			setMouseMoved(0);
		}
	};

	const handleMouseMove = (e) => {
		if (!isDown) {
			return;
		}
		const currentMousePositionInsideContainer =
			e.pageX === undefined
				? e.touches[0].pageX - viewerContainer.current.offsetLeft
				: e.pageX - viewerContainer.current.offsetLeft;

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
		if (isDown) {
			document.addEventListener('mousemove', handleMouseMove, {
				passive: false,
			});
			document.addEventListener('mouseup', () => {
				setIsDown(false);
				document.removeEventListener('mousemove', handleMouseMove);
			});
		}
		if (isDown === false) {
			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
			};
		}
		setMouseMoved(Math.round(mouseMoved));
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
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, [scrollLeftState, mouseMoved, isDown]);
	return (
		<>
			<div
				className={'viewer-container ' + (isDown ? 'is-grabbing' : '')}
				ref={viewerContainer}
				// onTouchStart={(e) => handleMouseDown(e)}
				// onTouchEnd={() => setIsDown(false)}
				// onTouchCancel={() => setIsDown(false)}
				// onTouchMove={(e) => handleMouseMove(e)}
				//mouse events
				onMouseDown={(e) => {
					handleMouseDown(e);
				}}
				// onMouseUp={() => {
				// 	setIsDown(false);
				// 	document.removeEventListener('mousemove', handleMouseMove);
				// }}
				// onMouseMove={(e) => handleMouseMove(e)}
				// onMouseLeave={() => {
				// 	setIsDown(false);
				// }}>
			>
				<img
					src={fileName}
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
