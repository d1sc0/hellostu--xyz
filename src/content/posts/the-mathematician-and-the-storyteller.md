---
title: The Mathematician and the Storyteller
slug: the-mathematician-and-the-storyteller
draft: false
pubDate: 2026-04-26T01:59:00
category: Play
featureImage: /src/assets/uploaded_images/AI_recommended_posts_FULL.jpg
description: How I built an AI-powered recommended posts component for my Astro site using vector embeddings and Gemini 2.5 Flash. A look at balancing math-based relevance with human-centric discovery and the power of separating concerns. Oh and Pirates!
tags:
  - tech
  - code
  - astro
  - gemini
  - experiment
  - AI
  - Gemini
---

> A ramble through one of my experiments in code and AI. Apologies in advance to more technical readers - I'm sure this is not how a proper engineer would approach such a task! 😬

> This is a long, nerdy but hopefully interesting read for the AI curious. There is a small treasure for those who make it to the end.

I’ve been wanting to add a recommended posts section into this blog for a little while. The recent rebuild has only added to my desire to join up the dots between bits of content and improve the experience for those who might want to stroll through my digital garden. The plan forming in my head was for something subtly more interesting and nuanced than just repeating post meta data at the bottom of each page. I wanted something that could actually tell a user **why** a post was being recommended to help understand the connections and entice them to read.

A plan formed in my head to outsource this lower-priority micro-content to AI to both save me some effort but also give me an interesting opportunity to experiment with using Google Gemini via it's API rather than its chat interface.

### **Awkward Start**

Gemini was useful in helping me scope out a detailed prompt to then pass into Gemini Code Assist plugin within VS Code. Having given it a pretty thorough architectural steer and talked about how I would integrate the component into my astro site and content pipeline, it set about doing lots of good work pulling things together.

Then things quickly went wrong. The 1st iteration kept failing with 404 errors and Gemini got caught up worrying about all of the wrong problems. Constantly changing things that clearly (imo) the source of the issue. Eventually I stepped in to help debug and point it away from some delusions it was having, and we figured out the issue. The interesting root cause really boiled down to Google's rapid iteration of models, names, and versions in this space as meant even its own AI is struggling keep up with it all and understand their docs. As frustrating as it was we got there in the end and we had some humorous banter along the way (if not slight sycophantic at times) Apparently, I have "great architectural intuition." - Yass queen. I do. 😂

### An AH-HA Moment

So after a bit of a rocky start, we quickly picked up speed. When we did hit problems I seemed more in-tune with where things might be going wrong than my Gemini companion. This surprised me given my amateur level coding skills but possibly testament to my ability to learn from my MANY mistakes.

During the build, I had a bit of an AH-HA moment. I thought I vaguely knew how some of this AI stuff works, but putting it to the test like this gave me a far more tangible working example of the underlying tech at play. To create the recommendations, the code was utilising 2 different models: 1 to select which 3 posts will be recommended and 1 to explain why they were selected.
This is what prompted the moment: surely if we're using 2 different models, the second model doesn't know why the first model made the recommendations it did!

And I'm right—it doesn't need to. It's an "illusion of intelligence" (and a clever one at that). Getting Gemini to read all of my posts in-depth and understand them in enough detail to generate recommendations every time the content changes would be slow and expensive.

### The Math (Meaning) and the Story (The illusion of meaning)

So as I've now learnt - the way this works is by turning each post into a long set of numbers, known as a **vector**. The first model does this quickly (gemini-embedding-2)—this post on '[GPS coordinates for meaning](https://medium.com/data-science-collective/what-are-embeddings-87f0c667925e)' is a great primer if you want to fall down that particular rabbit hole.

I store a hash of each post's vectors in JSON format to avoid having to hit the API when posts don't change. Then my script does some clever stuff where it compares these vectors to know which ones are most similar (using math) and therefore which 3 posts to shortlist for a recommendation. Don't ask me to explain the maths - I couldn't.

The second model (gemini-2.5-flash) doesn't really know or care **how** or **why** this recommendation has been made. It’s just charged with retrospectively making a case for it. It has the job of saying: "a user is reading post A and I'm recommending Post B; tell me a story about how they are related". The recommendation has already been made by its friendly vector creating counterpart. It's kind of just making up a reason without needing to understand it.

This separation of concerns is actually the genius behind lots of AI functionality. It's fast, efficient, and very versatile. It doesn't care; it just generates a story based on what it's told. It could if I wanted give me all the reasons why these posts aren't relevant to each other it's in no way fussy, It does what it is told.

### Too Good to be Interesting

So the script generates a final JSON file with the IDs, the recommendations, and the text reasonings ready to be picked up by a component in astro and rendered at build time for each page. The initial mapping and creation of reasons took approx 10-15 minutes. The slowest part of that being the generation of the reasoning text. On completion I set about reviewing the JSON to see what had been created.

My first observation was that the recommendations were too good. Post recommendations were so similar it was boring - this was especially true where I had posts like photo project entries or weeknotes. Often the recommendations were for the next and previous post. That seemed a bit silly given I already have next and previous post buttons on each page. Add to this problem a pretty generic set of text entries from our friend the storyteller and things got pretty dull quickly. It wasn't going to be a very interesting journey through my blog garden.

So I started to learn about the how the math was comparing the vectors and figure out if I could weight my **algorithm** to spice things up a little. Gemini was helpful here giving me three different variables I could apply and play with:

1. **Cross-pollination weighting**: Pushing the engine to break out of its 'bubbles' and suggest [different categories](https://pudding.cool/2018/05/similarity/).
2. **Publication date weighting**: Applying a weighting for time-decay. Basically prioritising posts that had bigger gaps between published dates. This would mean those landing on older posts would be signposted to newer ones and those reading new posts would be sent back into the archives.
3. **MMR (Maximal Marginal Relevance)**: Using a "diversity knob" (the **mmrLambda** parameter) to make sure the three picks aren't just three versions of the same thing. [This explanation](https://medium.com/@ankitgeotek/mastering-maximal-marginal-relevance-mmr-a-beginners-guide-0f383035a985) helped me understand how I might balance relevance with variety.

Apps like Spotify and Netflix use variations on these themes often to help you discover new content [outside of your existing habits](https://pudding.cool/2021/04/music-bubble/).

### Trial, Error and Configuration

So armed with a better understanding of the variables I could apply I asked my Gemini friend to apply these in my algorithm and expose them in a more readily tweakable config file whilst adding a test mode flag on the script so I could more rapidly test and review a subset of outputs. I also moved the prompt for the "Storyteller" here so I could to play with the reasonings a little more. The early iterations of storytelling were very salesperson click-bait puke. Not my vibe at all.

In the end, I decided to sack off the cross-pollination weighting and just lean into the categories I’ve set up: making sure each post gets one recommendation from [Work](/work), [Rest](/rest), and [Play](/play). The closest match stays in-category, the other two are more diverse. I also removed the publication date weighting as this felt less important in my use case. Tbh, at this point I had realised I was happy if the recommendations were pretty tenuous because the Storyteller will find a way to make them sound connected and diversity was turning out to be more interesting than relevance. Maybe that just says more about the way my brain works 🤷‍♂️.

Making it easier to mess with the prompt was definitely a good move as this took quite a few attempts to get something less "ick" and closer to my tone of voice. It's not perfectly me, but it's saving me all that manual effort so trade-offs were expected.

### Astro and the Easter Egg

The final steps of wiring this into astro were really very straightforward. The script runs before astro builds the static files used to serve the website. Any new or changed vectors are inserted into the [vector cache file](https://raw.githubusercontent.com/d1sc0/hellostu--xyz/refs/heads/main/src/data/embeddings-cache.json) (note it looks like the matrix). The script then runs its algorithm. If the content changes result in updated or new recommendations then the storyteller is called in and generates new reasonings for only those changed or new posts. Given the frequency of new content is low, these API calls run in seconds. When astro builds it just imports the json file and filters the relevant links and text into each page - this is one of those cases where static site generators really excel.

Whilst making the few final styling tweaks and updating the github action to include the new build steps I had a **gloriously silly idea!** Why not add a touch of crazy into the mix. I tested my idea with my Gemini co-developer and they thought it was great (I'm well aware this is not the best type of validation logic - AI thinks all of my ideas are great - they usually are not! 😂). So anyway, for those that have read this far and about to hit my newly AI automated 'What to read next' section - please enjoy clicking on the stack of books in the title to enable **pirate mode** recommendations. The same recommendations but in the style of a Pirate...because? why the hell not! ARRR Jim Lad 🏴‍☠️🗺️🦜⚓️
