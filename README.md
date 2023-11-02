# Functions description:

handleMouseDown(event): This function is called when a mouse click or touch event occurs. It sets the isDown state to true, records the initial X-coordinate of the event, and stores the current scrollLeft value of the container.

handleMouseMove(event): Handles mouse or touch move events. It updates the mouseMoved state to track horizontal movement relative to the initial click position.

handleRotation(): This function calculates and applies rotation to the displayed image based on the horizontal mouse movement. It determines the rotation speed based on the window width and changes the image index accordingly.

handleZoomInPlace(event): Handles zooming in at the cursor position when a double-click event occurs. It calculates the new zoom level and adjusts the position to keep the cursor position centered.

handleZoomInByBtn(): Increases the zoom level when a button is clicked. It checks if the zoom is already at the maximum level (3) and, if not, increases the zoom level.

handleZoomOutByBtn(): Decreases the zoom level when a button is clicked. If the zoom level is above 1, it decreases it. If the zoom level is 2, it resets the zoom to 1 and centers the image.

handleImageDrag(event): This function is responsible for dragging the image when it is zoomed in. It updates the image position based on mouse movement while ensuring it stays within bounds.
