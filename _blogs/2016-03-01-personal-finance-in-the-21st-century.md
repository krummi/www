---
layout: blog
title: Personal Finance in the 21st Century
categories: web
---
> Money &mdash; the source of, well, endless analytics possibilities!

I'm one of the individuals who spends way too much time analyzing his personal finances. I used to spend even more time doing this when the categorization of transactions was a manual task (yes, it involved Excel). Thankfully, there are now services that do the collection and categorization of transactions for you. The best known such service is probably [Mint](https://www.mint.com/) but we don't have that in Iceland so I use [Meniga](https://www.meniga.com).

Meniga is super-simple; it allows users to "connect" their bank accounts to it in seconds and it will immediately start collecting and categorizing transactions. The categorization is mostly automated and only requires manual intervention once in a while. On top of this they also provide you with a _fairly good_ web-based user interface to analyze and slice-and-dice your personal finances. For an example of how it has helped me lets take a look at my fuel spendings in 2013, 2014 and 2015:

<div class="image" style="width: 600px;">
  <img src="../img/meniga-3.png" alt="Fuel spendings" />
  <figcaption>
    The amounts are in Icelandic Kronas - ISK, the exchange rate of it is currently 130 ISK to the dollar so in January 2013 I was paying around 153$ in gasoline.
  </figcaption>
</div>

To sum this up, I paid 337.624 ISK (2600$) on fuel in 2013, 190.335 ISK (1460$) in 2014 and 49.929 ISK (380$) in 2015. The reason for this reduction is mostly due to the fact that I opened up Meniga at the beginning of 2014 and saw how much I had been spending on fuel the previous year. Soon I was finding various ways to lower my fuel costs and today, I mostly just ride my bike(s).

This is by no means the only example of how a _personal finance management_ service like Meniga has helped me spot and cut down on expenses. But as much as I like the service, I've found that I rarely have the time to do in-deep analysis of my personal finances. What I really want to do, is to see how I'm doing with regards to my monthly goals that I set at the beginning of every month. Unfortunately, Meniga doesn't really help me here.

But &mdash; like any self-respectable hacker I wasn't going to be stopped by a limited user-interface. So I set out to create my own _personal finance dashboard_ to rectify this.

<div class="divider">...</div>

My plan was to create a dashboard that I could look at and _instantly_ see how I was doing with regards to my spending goal for that month. Furthermore, I wanted to be able to breakdown my expenses by category and see at a glance _how_ I was spending my money.

The first step towards all of this was to reverse-engineer Meniga's HTTP API. Fortunately that was almost too simple. I created a simple JS API wrapper that allows anyone to interface with Meniga's API in a simple manner [code [here](https://www.github.com/krummi/meniga-client)]. I then added a new "Finances" tab in my home-automation system (what household doesn't have a home-automation system?) and after a few hours of work I had arrived at a place where I was quite happy.



_Disclosure: I'm in no way affiliated with Meniga a part from the fact that I know a few people who work there. They are _
