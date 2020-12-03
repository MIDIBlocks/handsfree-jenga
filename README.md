# Handsfree Jenga 🧱👌

![](https://media3.giphy.com/media/brC1Ow2v62htVmpfLh/giphy.gif)

- Demo: https://handsfree-jenga.glitch.me
- Source: https://glitch.com/~handsfree-jenga

## About

This repository demonstrates how to use Handsfree.js to interact with a Three.js environment. To see the app works refer to `/handsfree/pinchClick.js`

## How to play

- Press "Start Handtracking" and give it a few seconds to load
- 🖐 Use your palm to control the pointer
- 👌 Pinch your thumb and index pointer to grab a block

## Remix Ideas

Currently this demo uses a modified `pinchClick` Handsfree.js hook to simulate the mouse, which is how the original demo worked.

But how cool would it be to add physics to the hand skeleton like in this [GIF by @pushmatrix](https://twitter.com/pushmatrix/status/1237373570277191687). You can access the meshes with `handsfree.hand.three.meshes` or other properties in `handsfree.hand.three`

This will be documented on [Handsfree.js.org](https://Handsfree.js.org) soon!

![](https://media4.giphy.com/media/StkcDMH6lrZKxXK4e5/giphy.gif)

<br>
<br>
<br>

---

<br>
<br>
<br>

# Acknowledgements

- This project was forked from here: https://github.com/ericschv/jengaThreeJs

Original repo description: 

> The aim of this project was to build a web game based on the popular board game 'Jenga'. The application was built in collaboration with 
>
> [haoRchen](https://github.com/haoRchen). The three.js library was used 
to create 3D objects that could be easily manipulated. 
>
> In order to simulate real-time physics, this project also utilizes the physijs plugin. This plugin makes it easier to implement physics on 3D objects.