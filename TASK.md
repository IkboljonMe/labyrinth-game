## The task is to write a simple maze/labyrinth game - you can use any language/framework to create a game in a mobile version.

1. The game should contain a starting window - the main window. After the game result window and resumption. ✅

2. The labyrinth structure should be stored in the form of a table of numbers total.

3. Each of the numbers specifies the entrances / outputs for a given labyrinth chamber: Bit values determine which door can be passed.

1 (2^0) - left,

2 (2^1) - right,

4 (2^2) - up,

8 (2^3) - down.

4. One -way passage is allowed.

5. Each of the chambers should be implemented as one screen with

four buttons on its edges. Press the button

causes a transition to the chamber lying on the side of the screen on which there is a button.

6. Determining the possibility of moving to the neighboring chamber should be determined

The color of the button (you can use graphic elements).

7. The end of the game consists in reaching the specific alloy chamber

value 0.

8. The start chamber has a bit 4 (2^4).
