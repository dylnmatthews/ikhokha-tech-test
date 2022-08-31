# iKhokha Tech Check - Dylan Matthews

### Customer Review Analyzer
---
### Introduction

I have decide to rewrite this comment analyzer application in typescript as it is iKhokha’s new development stack.


## Approach
I have taken the approach of creating a config.json which has keys of the metric and regex expression to lookup to easily allow looking up of new metrics without adding in new code as long as the regex is correct.

As the program runs it checks how many CPU's are available to run the readings of multiple files on different CPU's. It splits the files up by separating the files to run on different cores. ie 80 files, 8 cores, 10 files on each core.


## How to run
I have also decided to have it run in docker container, incase your node version isn't the same as mine. I am running 18.8.0.
By having it in a docker container, it will have the same environment as I had ran, therefore the same expected results will occur.
To run it in docker, you will require having docker desktop installed and docker compose.