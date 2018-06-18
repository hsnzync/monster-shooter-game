# Inleverdocument PRG01-8

## Inleiding
Als grootste superheld van Galaxy Apollo 53 heb je de missie gekregen om een onbekende planeet veiliger maken. De monsters op dit planeet zijn een bedreiging voor de hele Galaxy. Aan jouw taak om te overleven op dit planeet en zoveel mogelijk monsters te vernietigen, zodat je jouw missie kunt voltooien.

## Speelbare game
- https://hsnzync.github.io/monster-shooter/

## Installatie

#### Stap 1 (clonen):
Clone het project naar `localhost`
- `git clone git@github.com:Hsnzync/monster-shooter.git`

#### Stap 2 (editen):
Na het aanpassen van de repository:
- `git add . / git add -p`
- `git commit -m "beschrijving"`
- `git push origin master`

#### Stap 3 (runnen / watch):
Open het project in Visual Studio Code
- Open project in `localhost`
- Watch: `Shift + CMD + B`

## Klassendiagram
![klassendiagram](https://user-images.githubusercontent.com/12610474/41525432-431f2382-72e1-11e8-9a59-36eb810c5895.png)

## Pull request
https://github.com/Onurrr/typescript-game/pull/1

## Peer review
https://github.com/Onurrr/typescript-game/issues/2

## Singleton
De Singleton is toegepast in Game.ts. Hier is voor gekozen omdat het maar éénmaal instantieert. Game.ts class is een globale toegang.

## Polymorfisme
Beschrijf van minimaal 2 plekken uit jouw code waar en waarom er gebruik is gemaakt van polymorfisme.
1. In Game word er een array gemaakt van gameObject, waar verschillende soorten enemies naar gepusht worden, omdat er zo makkelijk nieuwe enemies toegevoegd kunnen worden.
2. In Game worden er pickups gepusht in een array van gameObject. Dit zijn de objecten die opgepakt kunnen worden door de speler.

## Strategy
- De fastBehavior en slowBehavior zijn twee klasses die implementeren van MoveBehavior. Deze twee manipuleren de snelheid van elk type enemy.
- De snelheid wordt gemanipuleerd bij het oppakken van een powerup. Dit wordt afgehandeld in fastBehavior.

## Observer
- De observer is toegepast bij de speler en enemies. Wanneer de speler een powerup pakt, worden alle enemies geschoven naar de rechterkant van het scherm, waarbij er weer ruimte ontstaat voor de speler.

## Gameplay componenten
1. Te spelen op een mobiele telefoon met touch controls (komt nog...)
2. Solide UI en grafisch ontwerp
3. Muziek en geluid (komt nog...)
4. Pauzescherm met settings (komt nog...)
