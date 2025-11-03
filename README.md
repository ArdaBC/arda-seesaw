## Code Explanation

I have a global state to keep all of the variables referenced commonly thourghout the code. This state is also kept in the local storage as requested. I also keep the list of balls in local storage so that when the browser is refreshed, we can build the scene again.

When a user clicks the seesaw clickable area, torque is calculated relative to the pivot*. Then, a new ball is created at the clicked position. Balls are rendered using renderBall, which sets their size, color, and weight based on the original implementation I was given. Each falling ball is checked with the collides function, which compares the bottom of the ball to the plank height computed by getPlankHeight (which uses the pivot and plank angle to calculate y coordinate, see my horrible drawing). Once a ball collides with the plank, placeBallOnPlank positions it on top of the plank, sets its falling as false, and updates its data in localStorage.

The plank rotation is handled by updatePlankAngle. This is done by incrementing the current angle by 1/20th of the difference to the target angle. The updateBalls function moves falling balls until they collide with the plank and then forwards its duty to placeBallOnPlank once they collide. All of this runs in the mainLoop that calls both the updatePlankAngle and the updateBalls function. Balls are only created on clicks, but once they are created, they are fully handled by the loop.

![alt text](https://github.com/ArdaBC/arda-seesaw/blob/main/image.png?raw=true)

Note that in the actual code, the rotation of the plank takes the center of the pivot as the actual pivot, not the top of it. So pivotY is actually pivotRect.top + pivotRect.height / 2

I had to learn about Audio basics, requestAnimationFrame and getBoundingClientRect for this project. Overall, it was an entertaining and educational experience. I hope I did well.

*: I think I just noticed that in real physics, the sign would be positive for left torque and I did the exact opposite, oops.
