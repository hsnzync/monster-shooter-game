# Inleverdocument PRG01-8

Dit is een opzet voor het inleverdocument. De exacte instructies vind je in de Modulewijzer.

## Inleiding

Als de grootste superheld van galaxy 9B44 heb je de missie gekregen om planeet Namek veiliger maken. Er moeten zoveel mogelijk monsters vernietigd worden. Aan jouw taak om te overleven op dit planeet, zodat je jouw missie kunt voltooien.

## Speelbare game

Link naar de online speelbare game
...

## Installatie

# Stap 1 (clonen):
Clone het project naar jouw lokale server
- git clone git@github.com:Hsnzync/monster-shooter.git

# Stap 2 (editen):
Na het aanpassen van de repository:
- git add .
- git commit -m "beschrijving"
- git push origin master

# Stap 3 (runnen / watch):
Open het project in Visual Studio Code
Watch: Shift + CMD + B
Zet jouw lokale server aan

## Klassendiagram

Het klassendiagram van je game.
...

## Pull request

https://github.com/Onurrr/typescript-game/pull/1

## Peer review

Link naar de peer review die je in week 6 hebt gedaan. De link gaat naar een issue in het project van een medestudent.

## Singleton

De Singleton is toegepast in Game.ts. Hier is voor gekozen omdat het maar éénmaal instantieert. Game.ts class is een globale toegang.

## Polymorfisme

Beschrijf van minimaal 2 plekken uit jouw code waar en waarom er gebruik is gemaakt van polymorfisme.
1. In Game word er een array gemaakt van Enemy, waar verschillende soorten enemies naar gepusht worden, omdat er zo makkelijk nieuwe enemies toegevoegd kunnen worden.
2. ...

## Strategy

Beschrijf waar en waarom je het strategy pattern hebt toegepast.
De fastBehavior en slowBehavior zijn twee klasses die implementeren van MoveBehavior. Deze twee manipuleren de snelheid van elk type enemy.

## Observer

Beschrijf waar en waarom je het observer pattern hebt toegepast.
...

## Gameplay componenten

Beschrijf per component waar en waarom je het hebt toegepast
1. ...
2. ...
3. ...
4. ...