# Inleverdocument PRG01-8

## Inleiding
Als grootste superheld van Galaxy Apollo 53 heb je de missie gekregen om een onbekende planeet veiliger maken. De monsters op dit planeet zijn een bedreiging voor de hele Galaxy. Aan jouw taak om te overleven op dit planeet en zoveel mogelijk monsters te vernietigen, zodat je jouw missie kunt voltooien.

## Speelbare game
- https://hsnzync.github.io/monster-shooter/

- Spatiebalk = schieten
- Pijltjestoetsen = lopen

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
2. In Game worden er pickups gepusht in een array van gameObject. Dit zijn de objecten die opgepakt kunnen worden door de player.

## Strategy
- De fastBehavior en slowBehavior zijn twee klasses die implementeren van MoveBehavior. Deze twee manipuleren de snelheid van elk type enemy.
- De snelheid wordt gemanipuleerd bij het oppakken van een powerup. Dit wordt afgehandeld in fastBehavior.

## Observer
- De observer is toegepast bij de player en enemies. Wanneer de player een powerup pakt, worden alle enemies langzamer en schiet de player eenmalig, extra vuurballen. Na 5 seconden wordt de fastBehavior toegepast op alle enemies.

## Gameplay componenten
1. Solide UI en grafisch ontwerp
2. Muziek en geluid
3. Maakt gebruik van de `Howler Library`
4. Te downloaden via een game platform `https://hsnzync.itch.io/monster-shooter?secret=TRWbxtRSu9O4Aj9rFq8MBr1JxRw`
