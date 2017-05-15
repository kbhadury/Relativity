# Relativity

https://kbhadury.github.io/Relativity/

This is an interactive website designed to help visualize time dilation and length contraction in Einstein's theory of special relativity.  It features the two classic characters of relativity, Anna and Bob, travelling across space in their spaceships.  Each of their ships has three onboard clocks, located at the back, middle, and front of the ship (their middle clocks are both set to 0 as they pass each other).  Set the speeds and lengths of their ships, and then watch as ships contract and time slows down!

## What is Einstein's theory of relativity?
Einstein's theory of relativity postulates that light moves at the same speed in all reference frames.  When we talk about reference frames, it's a bit like saying "according to some observer".  For example, if Alfred is running at 10 m/s towards Betty, and Betty throws a baseball at 5 m/s towards Alfred, then according to Alfred the ball is approaching him more quickly.  We say that the ball moves at 15 m/s in Alfred's frame.  Now consider the case where Alfred runs towards Betty and Betty shines a flashlight at Alfred.  Light moves at roughly 3x10<sup>8</sup> meters per second, so if Betty measured the speed of the light coming from her flashlight she would end up with this value.  However, Einstein claimed that if Alfred measured the speed of the light, he would end up with the _exact same_ value.  Unlike the baseball, the light doesn't appear to be moving any faster in Alfred's frame.

Einstein's claim has been experimentally verified, and it yields quite a few strange consequences, two of which are time dilation and length contraction.  For instance, if you were watching a spaceship fly by at 87% the speed of light, it would appear to be roughly half as long as it is when it's at rest and any clocks onboard would seem to be ticking slowly.  It's not an illusion - time is actually moving more slowly for the person on the ship relative to you.

## The math behind the website

One important concept in relativity is the Lorentz factor, represented as gamma-v and given by

<a href="https://www.codecogs.com/eqnedit.php?latex=\gamma_v&space;=&space;\frac{1}{\sqrt{1-\frac{v^2}{c^2}}}" target="_blank"><img src="https://latex.codecogs.com/png.latex?\gamma_v&space;=&space;\frac{1}{\sqrt{1-\frac{v^2}{c^2}}}" title="\gamma_v = \frac{1}{\sqrt{1-\frac{v^2}{c^2}}}" /></a>

where _v_ is the velocity of one frame relative to another and _c_ is the speed of light.  Notice that this doesn't allow for frames moving faster than the speed of light, since we would get negative square root.  For most practical purposes the Lorentz factor is roughly equal to 1.  (The Juno spacecraft managed to reach 265,000 km/h, making it the fastest human-made object in history, and the Lorentz factor is just 1.00000003.)

Given an observer at position _x_ and time _t_ in some stationary frame _S_, we can determine the corresponding position _x'_ and time _t'_ in a moving frame _S'_ using the following relations:

<a href="https://www.codecogs.com/eqnedit.php?latex=x'&space;=&space;\gamma_v(x-vt)" target="_blank"><img src="https://latex.codecogs.com/png.latex?x'&space;=&space;\gamma_v(x-vt)" title="x' = \gamma_v(x-vt)" /></a>

<a href="https://www.codecogs.com/eqnedit.php?latex=t'&space;=&space;\gamma_v(t-\frac{v}{c^2}x)" target="_blank"><img src="https://latex.codecogs.com/png.latex?t'&space;=&space;\gamma_v(t-\frac{v}{c^2}x)" title="t' = \gamma_v(t-\frac{v}{c^2}x)" /></a>

These are the equations this website uses to calculate the times for the onboard clocks.
