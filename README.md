![alt text](https://github.com/intro-graphics-master-F19/term-project-team-costcode/blob/master/assets/traderthrows.png "Logo")
![alt text](https://github.com/intro-graphics-master-F19/term-project-team-costcode/blob/master/assets/trader-throws-concept-art.png "Concept Art")

Team members: Abigail Yang, Esther Li, Jihye Kim , Therese Cook 

![alt text](https://i.imgur.com/nRjLBDF.png "Design process 1")
![alt text](https://i.imgur.com/d8OZdOm.png "Design process 2")

## Game Objective
Our project is a game in which the player must throw different items to different target locations based on their category. The game simulates a grocery store employee tossing different categories of items into their designated crates. The player takes the perspective of the employee, and points are awarded with each correctly aimed (and correctly sorted) toss. 

## Gameplay
User can change trajectory of projectile by pressing key 'a' to turn left, 'd' to turn right, and throw the projectile by pressing 't'.  After the game introduction sequence is complete, press '5' to get to the normal view, which is the best perspective to view the projectile and bins from the center of the store. While in normal view and normal view only, mouse picking is enabled on two items: 
1) Green "1" sign at the cash register table
2) Golden lucky cat on top of the vending machine
Clicking either of these items will prompt a zoom-in to view the details for both objects. Note: This feature requires Chrome (default zoom at 100%) and a screen resolution of 2880 x 1800. 

## Scoring
The user has 60 seconds to complete 30 correct throws, beginning each game with 5 lives. Every incorrect throw deducts one life. The user loses if they do not complete 30 correct throws or lose all their lives within the given time. There is a challenge mode where the bins are constantly moving, but score is doubled per throw and there is no life restriction during challenge mode.

## Advanced Features
1. Physics-based animation: 
* projectile trajectory
* mid-air angular motion based on projectile's moment of inertia 
* rebound calculation from hitting the rim
2. Mouse picking: click on cashier sign or lucky cat to zoom in for details 
3. Bump mapping: floor tiles
4. Sprite animation: scrolling texture cashier monitor
5. Shadow mapping: for bins and projectile

![alt text](https://i.imgur.com/1Cfhmpm.gif "Mouse picking")

## Citations 
Outside of the public encyclopedia for tinygraphics.js documentations, we did not utilize any other source code. However, the tinygraphics.js documentations and file structures we used are located [here](https://github.com/encyclopedia-of-code/tiny-graphics-js). The sound files that Jihye used are located on these websites: [Music](https://l.messenger.com/l.php?u=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FGames%2FTechniques%2FAudio_for_Web_Games&h=AT3plv0LMABtLTavBgkC2oKRgB47zQ9xj7rPE9I1W1-7AsI73N9CPFBLaCoyFllQjlMj5NLft85idepR5IzNt-nNdFhLE5kanDaEJwtNQ8hSxY7g1Mn2ZDjs3GASQXPFfacuAEbfpoQ) and [Sound Effects]( https://bgmstore.net/). 


# Trader-Throws
