# Guitar Theory Explorer

## About

My name is Frank and I've been playing guitar for a number of years. However my physical ability to play songs, far surpases my ability to understand theory and create my own musical ideas. I'm someone who enjoys understanding the details of chord structure, soloing, etc... So I wanted to buckle down, jam a lot more, and really learn theory well. However I was having trouble finding a resources that had all the items I frequently used, easily accessible while practicing.

As a Software Engineer who had never used [Google Gemini](https://gemini.google.com/) I decided to use their [AI Studio](https://aistudio.google.com/) to *vibe code* an app to help. 

This app uses Node.js/Typescript and is a simple static website -- once you load the page, all processing is done client side. It never needs to call back to any servers; this make it very simple.

The source is here on [GitHub](https://github.com/altf2o/guitar-theory-explorer) and uses GitHub Actions to rebuild and publish the static website to [Azure](https://azure.microsoft.com/) on each new commit. 

## How I use this

I don't have any formal course or program I'm part of, I'm just using my ["Guitar Scales 365: 52 Weeks of Daily Guitar Exercises"](https://www.amazon.com/Guitar-Scales-365-Exercises-Major-Pentatonic/dp/B0DLNVJ3YH/ref=sr_1_2_sspa?crid=2W7IF84QLI7JP&dib=eyJ2IjoiMSJ9.G2ZkD98-pa0OnCTLZm23u4dfcV1sd63x22UcQGjuC3-1E8jmNUSVNbLiCk4OcI2Q7bTA2oUjFeRoYWYds3p_g3IBPuX2Hkmtwq73T5RJvewuxWwlWJh2d7bh3lvek1uTW_BmQ2_nH1Pnim_G8WTUkwN12ZsD1R80e7II_xD-UAyp_CXl1eZAKSg_sJFIloiN8_K-VccSON86PhObfhPDbYTuyR3rnKAu1T5asA_okUAmVAbH3lQAw-J3w5uUYK4XO6x35HlN5pfyWvdnlCfJz6D-qOKOIFt6oNOX5yE4qc8.H0NwW2Ih1fClINFtSDN0_WtmDQzjq7IduhmjriUOVzs&dib_tag=se&keywords=guitar+scales&qid=1778721313&sprefix=guitar+scal%2Caps%2C211&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1) book which uses a specific key each week. It shows the I chord for the key, along with a scale in that position to practice it.

Along with that I have this page open and select the proper key, and use the information on it to learn more about it. I've picked up books on chord theory as well as playing scales over chords. I plan on continuing to use this while reading those, potentially adding on as needed.
 
Hopefully others will find it helpful too!

## Features/Sections

**Key/Scale selection:**
- Select one of the 12 Western Music Theory Notes
- Select the Scale/Mode

**Scale Information:**
- Degree of the scale (I, II, VI, etc...)
- Each note in the selected scale
- The interval between notes in our scale (W vs H steps)
- Chord *quality* such as minor, Major, diminished

**Diatonic Chords:**
- Common chords for each note in our key/scale
- It usually shows typical open positions, as well as barre chords

**Power Chords:**
- Common power chords for each note in our key/scale
- Various positions to play each power chord

**CAGED Scale Shapes:**
- Shows the scale in each [CAGED](https://en.wikipedia.org/wiki/Bar_chord#CAGED_System) *position* on the fretboard
- Root notes are in orange

**Full Fretboard:**
- A 22 fret fretboard showing our scale along it
- Root notes are in orange

**Popular Progressions:**
- Shows various chord progressions in this key
- Gives a summary of the overall *feel* typically associated with this progression

## Application in the wild

This is currently running as an [Azure Static Website](https://azure.microsoft.com/en-us/products/app-service/static) at the following location:  

[https://guitartheory.altf2o.com/](https://guitartheory.altf2o.com/)

## Development

I started this in Google's AI Studio but have since moved to VSCode with the Cline plugin which is connected to Gemini. I plan on learning some Typescript and hope to make more modifications myself, so having the freedom to develop in a familiar environment and easily deploy to a destination of my choosing was my goal.

### Run Locally

**Prerequisites:**  [Node.js](https://nodejs.org/en/download)

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

> [!WARNING]
> As of 2026/05/12 there have been several recent NPM supply chain attacks. I'm not a Typescript developer but I don't believe this project uses any affected packages. However it was *vibe coded* using Google Gemini to be a static application, hopefully removing some potential for issues. Please review included dependencies if you're worried, or run this in a confined way like a container.

### Run in a Docker container
***TODO***

## Resources
These are resources I've used in my own guitar journey, or have found helpful at some point. There's no particular order, I just figured if someone was here, these may be helpful if they haven't heard about them.

- [TrueFire Guitar Lessons](https://truefire.com)
- [Pickup Music Guitar Lessons](https://www.pickupmusic.com/)
- [Guitar Workout of the Day](https://www.guitarworkoutoftheday.com/)
- [Justin Guitar](https://www.justinguitar.com/)
- [GuitarChord.org](https://www.guitar-chord.org/)
- [GuitarScale.org](https://www.guitarscale.org/)
- [The Guitar Lessons](https://www.theguitarlesson.com/)
