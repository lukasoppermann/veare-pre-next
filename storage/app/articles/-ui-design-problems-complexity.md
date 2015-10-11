---
title: UI Design Problems\: Complexity
tags: tag1, tag2
author: Lukas Oppermann
---
# UI Design Problems: Complexity
> As a designer your job is to reduce complexity. If your solution is not dead simple, you are not done yet.

As humans we have always been trying to simplify our lives. Take heating for example: First we had to collect fire wood to heat our caves. We replaced this with oil and later hot water, that was brought to our houses via pipes. All we have to do is turn the heater on when we are cold. Now the next step is to make the heater smart, so that it can turn on by itself.

## Identifying user requirements
Before we can come up with a solution we need to identifying which problems we are dealing with. Heating seems pretty straight forward: Turn the heater to the desired temperature when you are cold, turn it off when you are too warm. But if we think about it a little more, there are other things to consider.
- you want different temperatures in the morning, when you get up, during the day and at night, when you are sleeping
- you are probably home more during the weekends, so you need a different heating period during this time
- in the summer time you will want a much colder temperature than during winter
- you might stay up longer on some random days
- your kitchen needs to be much warmer than your bed room, because most people prefer a colder temperature when sleeping

To sum this up, we need to provide different temperatures in different rooms at different times. They might also differ throughout the year. Sounds complicated? It is, if you are in the business of automating it.

## How not to do it
For every single problem there are many, many solutions. Some are hard to implement, others are hard to use, some make you feel like whoever created the solution really hates people, typically when they solve the easy issues and let the user deal with the complex ones.

One simple way of dealing with this complexity, is to not deal with it. If you are building an app to control smart heating devices, you can just let the user take care of the problems. This could be by just providing a digital version of the on / off control, which means the user would have to turn the heat on or off via the smartphone. If you think about it, this does not move us anywhere closer to a **smart** heating system, but many companies are still building apps like this, why? The main reason is misunderstanding the meaning of buzzwords like **smart home** or **connected devices**. Contrary to the believe of many, the idea is **not** to make every device controllable via smartphone. Sometimes it might be good, but often it makes everything more complicated. The way a device is controlled has nothing to do with it being a smart device or not.

> The smartness of a smart home is that it can decide what to do for the user by itself.

Another wrong approach is to add configurations for everything. This means the user decides beforehand what the device should do in a given situation. This approach has two problems: Firstly you will probably not be able to think of every situation beforehand, for example what if there is an extremely cold and rainy week in July? Secondly the user might not be able to predict her desires beforehand. This approach avoids problems for the product developers by make them the users problems, not so good.

![Smart Home app heating](/media/smarthome-tkom.jpg)
<caption>In this app the user has to setup the temperatures for every day of the week in every room.</caption>

## A better approach
If letting the user do the work is not the right way, you might be wondering what is actually a good approach. Well, let the machine do the work. This also means, let the machine to the thinking. Machines are not bad at thinking, they just need a little nip here and there.

A good example of this is the Nest thermostat, a replacement for your normal thermostat. This is important because it makes it easier for you to use it, as it does not require a change in behavior. You can adjust the temperature where you always adjusted it. But the really great part about it is, that it constantly tracks your changes to learn your personal heating desire. After a couple days it can predict when you want your home to be warm and when you want it to be cold. If your heating needs change, for example because you started to do home office, nest will adjust within a couple days.

![Nest](/media/nest.jpg)
<caption>Without a need to change behavior, the user is instantly familiar with her "new" smart heating.</caption>

## Extending upon success
The approach above is very good, but there is still room for improvements. To be fair, I do not know how much of this technology might actually be integrated into the Nest already.

If you start out with a "thinking" device, you are capable of nearly everything. To improve the experience even more, we could not only track the temperature the user sets on a seasonal bases, but also depending on the weather. If the user now allows the device to access the wifi, the temperature can be set depending on the outside temperature and weather situation. This now moves the device more towards a connected device. If you think in this realm an open window or a  completely locked front door could signal he device stop heating.

## A really smart home
In summary, a smart device is not a device that is controlled via a smart phone, but a device that can think for itself and reduce effort and complexity in a given task. I needs to adapt to the user and try to replace the old devices as seamlessly as possible. Remeber: If the solution is not dead simple, you are not done.







--------------


# UI Design Problems: Complexity
> or how we f**ked up the smart home by introducing more complexity than we eliminated.

We have always been trying to optimize & simplify our lives. We used to have to collect wood and start a smokey fire to keep our cave warm. Later on we invented fire places, which transformed into oil based fire heaters, which eliminated the need for collecting fire wood. Our modern method uses heated water and all we have to do is turn it on. The next step is making the heater smart, so that human action is removed from nearly every part of heating. Many companies are trying their luck, but only a few are moving in a good direction.

## Identifying the users requirements
The basic idea of heating is very easy: Turn up the heat if you are cold, turn it down if you are too warm. If you are not living in Melbourne, where you can get 4 seasons in one day, your heating schedule depends on two factors, the season and the time of the day.

But when you start to automate this, it gets tricky, consider the following difficulties:
- people have different preferences for temperatures
- you want a colder temperature when you sleep, but the time when you go to bad varies
- your summer, autumn, winter, spring temperatures are different
- work days and weekends need different settings

The list goes on, but those 4 examples illustrate the many difficulties that need to be considered when automating something. ~~You can see that having a fixed day and night temperature does not work. So people need to be able to set those individually, but also have different temperatures depending on the season. Maybe people would like to also have different temperatures for their bed room and the kitchen.~~ Collecting all the customer needs one of the first ideas you arrive at is probably to build an app. Nearly everybody has a smartphone, so it makes sense to build an app, it probably looks something like this:

Since every user has different needs, why not just let the user *choose* everything to her liking?

When the user launches our app for the first time, she will need to set up her heating profile. She will start by selecting a room and adding temperatures for every day. The temperatures can be configure in intervals, so from 24.00 to 8.00 she might set it to 16°C. Of course for most people every weekday is the same, so an option for copying a days settings to another day was added. Probably some rooms are similar as well, so you have the option to copy a rooms setting to another room.

> Copying something that is not text, is an action that is not native to mobile devices. Whenever you are implementing actions that are not native to a plattform, you should reconsider at least twice, its probably a bad idea.

Do you remember how we said that heating is a pretty easy concept? Well, we managed to turn it into a beast. Instead of turning a nob the user now needs to think about her heating routine in advanced and set it all up. Adjusting it, while maybe possible without a phone always requires the user to consider if the change should be permanent (change in the app) or just once (changing the temperature at the heater).

**Wo rein?**
**Options** is a watch word, whenever it comes up you are probably moving towards the wrong direction. The more choices you add, the more work your product will be.

## Root cause analysis
To find out how we arrived at such a complex solution, we need to as ourselves why we added all those options. The answer is, because we need to know the users preferences. Why? Because we need to adjust the heating to the users needs. Why? Because the user should not think about his needs.

But actually now the user has to think about his needs even more. To solve this we can employ averages and the idea of machine learning.

## A better solution
A better solution would be to find an average temperature profile. Averages have the disadvantages that they are not perfect for anybody, but the advantage that they are pretty good for most. Now let the user easily adjust the temperature whenever she feels to cold or to warm and adjust the profile accordingly. This means you have to put much effort into developing an intelligent algorithm to adjust the profile, but hey, a smart home is not about controlling your heat with your phone, its about controlling your heater as little as you can.

A very good example for this is the nest. The nest replaces your old thermostat and lets you adjust the temperature by turning it. Over a period of two weeks it will have learned your preferences and deliver a very good heating, while constantly improving, by learning your needs whenever you change the temperature. The added benefit of the nest is that you do not have to change your behavior. Since it replaces your old thermostat you go to the same place and adjust the temperature exactly like you used to, it just adds a layer of intelligence without adding more complexity.



Of course there is a little more to those solutions. Smart devices should try to notice when you are not at home and react to it, this should not be done by you telling the device, but automatically for example by detecting that the door of your house is locked.

## Conclusion

More often than not, people forget that house automation and the idea of a smart home is not about connecting devices for the purpose of using your phone as a remote for you house, but about removing the need for controlling anything at all. It is very complicated and takes much effort to create an intelligent system to know what you want, which is why many companies move all the complexity to the user in order to avoid a huge development phase. If you work hard on building a really smart device, you can deliver excellence, if you quit to soon, you will end up adding complexity to a simple problem.
