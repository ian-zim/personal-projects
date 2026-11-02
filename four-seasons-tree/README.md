# Four Seasons Tree Animation

By Ian Zimmerman

A p5.js animation that tells the story of a maple tree through winter, spring, summer, and fall, accompanied by Vivaldi's *The Four Seasons*. The tree was inspired by the maple trees Ian grew up with in Vermont and photographs of fall foliage sent by his mother.

## How it works

- An adapted L-system generates the maple-like branching structure.
- Music timestamps determine the season and when leaves grow, change color, and fall. Each season lasts 15 seconds.
- A precomputed music loudness array determines weather intensity, creating a scene that reacts to the music.
- Branch angle, measured using `sin()`, and branch thickness determine how much snow each branch can hold.

## View the project

- [Source code](sketch.js)
- [Open the original sketch in the p5.js editor](https://editor.p5js.org/Ian_Zimmerman/sketches/ZiT6xI-U_)

## Controls

Click the canvas to start the animation and music. Press R to restart.

## Requirements

Runs in p5.js. The audio file `four-seasons.mp3` is not included in this repository. Add it at `audio/four-seasons.mp3` or `four-seasons.mp3` to run the sketch with music. The animation uses the audio playback time to advance through the seasons.

## Development notes

The project builds on L-system starter code.
