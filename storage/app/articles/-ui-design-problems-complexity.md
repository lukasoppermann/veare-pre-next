---
title: UI Design Problems\: Complexity
tags: tag1, tag2
author: Lukas Oppermann
---

# UI Design Problems: Complexity
> or how we f**ked up the smart home by introducing more complexity than we eliminated.

Humans have always been trying to optimize & simplify our lives. We used to have to collect wood and start a smokey fire to keep our cave warm. Later on we invented fire places, which transformed into oil based fire heaters, which eliminated the need for collecting fire wood. Our modern method uses heated water, which is much safer. The next step is making the heater smart, so that human action is removed from nearly every part of heating. Many companies are trying their luck, but only a few are moving in a good direction.

## House automation: options vs. intelligence
The basic idea of heating is very easy: Turn up the heat if you are cold, turn it down if you are to warm. If you are not living in Melbourne, where you can get 4 seasons in one day, your heating schedule depends on two factors, the season and the time of the day.

But when you start to automate this, it gets tricky, consider the following difficulties:
- people have different preferences for temperatures
- you want a colder temperature when you sleep, but the time when you go to bad varies
- your summer, autumn, winter, spring temperatures are different
- work days and weekends need different settings

The list goes on, but those 4 examples illustrate the many difficulties that need to be considered when automating something. You can see that having a fixed day and night temperature does not work. So people need to be able to set those individually, but also have different temperatures depending on the season. Maybe people would like to also have different temperatures for their bed room and the kitchen. Collecting all the customer needs one of the first ideas you arrive at is probably to build and app. Nearly everybody has a smartphone, so it makes sense to build an app, it probably looks something like this:

![Smart Home app heating](/media/smarthome-tkom.jpg)

Since every user has different needs, why not just let the user *choose* everything to her liking? **Options** is a watch word, whenever it comes up you are probably moving towards the wrong direction. The more choices you add, the more work your product will be. But lets look into this idea a little bit, before we discuss why it is bad.

When the user launches our app for the first time, she will need to set up her heating profile. She will start by selecting a room and adding temperatures for every day. The temperatures can be configure in intervals, so from 24.00 to 8.00 she might set it to 16°C. Of course for most people every weekday is the same, so an option for copying a days settings to another day was added. Probably some rooms are similar as well, so you have the option to copy a rooms setting to another room.

> Copying something that is not text, is an action that is not native to mobile devices. Whenever you are implementing actions that are not native to a plattform, you should reconsider at least twice, its probably a bad idea.

Do you remember how we said that heating is a pretty easy concept? Well, we managed to turn it into a beast. Instead of turning a nob the user now needs to think about her heating routine in advanced and set it all up. Adjusting it, while maybe possible without a phone always requires the user to consider if the change should be permanent (change in the app) or just once (changing the temperature at the heater).

## Root cause analysis
To find out how we arrived at such a complex solution, we need to as ourselves why we added all those options. The answer is, because we need to know the users preferences. Why? Because we need to adjust the heating to the users needs. Why? Because the user should not think about his needs.

But actually now the user has to think about his needs even more. To solve this we can employ averages and the idea of machine learning.

## A better solution
A better solution would be to find an average temperature profile. Averages have the disadvantages that they are not perfect for anybody, but the advantage that they are pretty good for most. Now let the user easily adjust the temperature whenever she feels to cold or to warm and adjust the profile accordingly. This means you have to put much effort into developing an intelligent algorithm to adjust the profile, but hey, a smart home is not about controlling your heat with your phone, its about controlling your heater as little as you can.

A very good example for this is the nest. The nest replaces your old thermostat and lets you adjust the temperature by turning it. Over a period of two weeks it will have learned your preferences and deliver a very good heating, while constantly improving, by learning your needs whenever you change the temperature. The added benefit of the nest is that you do not have to change your behavior. Since it replaces your old thermostat you go to the same place and adjust the temperature exactly like you used to, it just adds a layer of intelligence without adding more complexity.

![Nest](/media/nest.jpg)

Of course there is a little more to those solutions. Smart devices should try to notice when you are not at home and react to it, this should not be done by you telling the device, but automatically for example by detecting that the door of your house is locked.

## Conclusion

More often than not, people forget that house automation and the idea of a smart home is not about connecting devices for the purpose of using your phone as a remote for you house, but about removing the need for controlling anything at all. It is very complicated and takes much effort to create an intelligent system to know what you want, which is why many companies move all the complexity to the user in order to avoid a huge development phase. If you work hard on building a really smart device, you can deliver excellence, if you quit to soon, you will end up adding complexity to a simple problem.
