import { useEffect } from 'react';
import { useState, useRef } from 'react';
import './Viewer.scss';

import { SlMagnifierAdd, SlMagnifierRemove } from 'react-icons/sl';

const Viewer = () => {
  //it is rotation spped value minimum is 1
  let rotationSpeed = 4.5;

  const [index, setIndex] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(null);
  const [mouseMoved, setMouseMoved] = useState(0);
  const [mouseMovedPrev, setMouseMovedPrev] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const fileName = `assets/item/Fotel_HDR_${index}.jpg`;

  const imageRef = useRef(null);
  const containerRef = useRef(null);

  if (rotationSpeed < 1) {
    rotationSpeed = 1;
  }
  const handleMouseDown = (e) => {
    setIsDown(true);

    if (e.pageX === undefined) {
      setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    } else {
      setStartX(e.pageX - containerRef.current.offsetLeft);
    }

    setScrollLeftState(containerRef.current.scrollLeft);
    setMouseMoved(0);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (!isDown) {
      return;
    }
    const currentMousePositionInsideContainer =
      e.pageX === undefined
        ? e.touches[0].pageX - containerRef.current.offsetLeft
        : e.pageX - containerRef.current.offsetLeft;

    setMouseMovedPrev(mouseMoved);
    setMouseMoved(currentMousePositionInsideContainer - startX);
  };

  const handleRotation = () => {
    let rotationSppedValue;
    if (window.innerWidth < 500)
      rotationSppedValue = Math.round(window.innerWidth / (15 * rotationSpeed));
    if (window.innerWidth < 1000)
      rotationSppedValue = Math.round(window.innerWidth / (25 * rotationSpeed));
    if (window.innerWidth < 1500)
      rotationSppedValue = Math.round(window.innerWidth / (37 * rotationSpeed));
    if (window.innerWidth < 2000)
      rotationSppedValue = Math.round(window.innerWidth / (50 * rotationSpeed));
    if (window.innerWidth < 2500)
      rotationSppedValue = Math.round(window.innerWidth / (62 * rotationSpeed));
    if (window.innerWidth < 3000)
      rotationSppedValue = Math.round(window.innerWidth / (75 * rotationSpeed));
    if (window.innerWidth < 3500)
      rotationSppedValue = Math.round(window.innerWidth / (87 * rotationSpeed));
    if (window.innerWidth < 4000)
      rotationSppedValue = Math.round(
        window.innerWidth / (100 * rotationSpeed)
      );
    if (window.innerWidth < 4500)
      rotationSppedValue = Math.round(
        window.innerWidth / (112 * rotationSpeed)
      );

    setMouseMoved(Math.round(mouseMoved));
    if (mouseMoved % rotationSppedValue === 0 && mouseMoved !== 0) {
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
  };

  const handleZoomInPlace = (e) => {
    const isButton = e.target.tagName === 'BUTTON';
    const isSvg = e.target.tagName === 'svg';
    const isPath = e.target.tagName === 'path';

    if (isButton || isSvg || isPath) {
      return; // Return early if the clicked element is a button
    }
    const imageElement = imageRef.current;
    const containerElement = containerRef.current;

    if (!imageElement || !containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    if (zoom < 3) {
      const newZoom = zoom === 3 ? 1 : zoom + 1;

      /// Calculate the new position to zoom in cursor place
      const deltaX = (mouseX - containerRect.width / 2) / zoom;
      const deltaY = (mouseY - containerRect.height / 2) / zoom;

      // Calculate the new position based on the current position and zoom
      let newX = position.x - deltaX;
      let newY = position.y - deltaY;

      // Limit newX and newY to stay within bounds
      const maxX = (imageElement.width * newZoom - containerRect.width) / 2;
      const maxY = (imageElement.height * newZoom - containerRect.height) / 2;
      newX = Math.max(-maxX, Math.min(maxX, newX));
      newY = Math.max(-maxY, Math.min(maxY, newY));

      // Update zoom and position

      setZoom(newZoom);
      setPosition({ x: newX, y: newY });
    } else {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };
  const handleZoomInByBtn = () => {
    if (zoom === 3) return;
    setZoom(zoom + 1);
  };

  const handleZoomOutByBtn = () => {
    if (zoom > 2) setZoom(zoom - 1);
    if (zoom === 2) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
    if (zoom === 1) return;
  };

  const handleImageDrag = (e) => {
    if (isDown && zoom > 1) {
      e.preventDefault();
      const { movementX, movementY } = e;

      setPosition((prevPosition) => ({
        x: prevPosition.x + movementX,
        y: prevPosition.y + movementY,
      }));
    }
  };

  useEffect(() => {
    if (isDown && zoom === 1) {
      //mouse listeners
      document.addEventListener('mousemove', handleMouseMove, {
        passive: false,
      });

      document.addEventListener('mouseup', () => {
        setIsDown(false);
        document.removeEventListener('mousemove', handleMouseMove);
      });

      //touch listener
      document.addEventListener('touchmove', handleMouseMove, {
        passive: false,
      });

      document.addEventListener('touchend', () => {
        setIsDown(false);
        document.removeEventListener('touchmove', handleMouseMove);
      });
    }

    const currentRef = containerRef.current;

    if (isDown && zoom > 1) {
      currentRef.addEventListener('mousemove', handleImageDrag);
    }

    handleRotation();

    return () => {
      currentRef.removeEventListener('mousemove', handleImageDrag);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
    };
  }, [scrollLeftState, mouseMoved, isDown]);
  return (
    <>
      <div
        className={'viewer-container ' + (isDown ? 'is-grabbing' : '')}
        ref={containerRef}
        onTouchStart={(e) => handleMouseDown(e)}
        onMouseDown={(e) => {
          handleMouseDown(e);
        }}
        onDoubleClick={handleZoomInPlace}>
        <img
          src={fileName}
          className='viewer'
          loading='lazy'
          style={{
            width: `100%`,
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
          }}
          ref={imageRef}
        />
        <div className='control-panel'>
          <button
            className='magnifier-btn'
            onClick={handleZoomInByBtn}
            style={
              zoom === 3
                ? {
                    backgroundColor: 'rgba(216, 221, 228, 0.1)',
                    cursor: 'default',
                  }
                : {}
            }>
            <SlMagnifierAdd className='magnifier-icon' />
          </button>
          <button
            className='magnifier-btn'
            onClick={handleZoomOutByBtn}
            style={
              zoom === 1
                ? {
                    backgroundColor: 'rgba(216, 221, 228, 0.1)',
                    cursor: 'default',
                  }
                : {}
            }>
            <SlMagnifierRemove className='magnifier-icon' />
          </button>
        </div>
      </div>
    </>
  );
};

export default Viewer;
