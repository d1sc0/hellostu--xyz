---
title: "Bloom's: The Broken Staircase"
slug: blooms-the-broken-staircase
draft: false
pubDate: 2026-10-21T23:50:00
category: Work
description: 'How generative AI turns Bloom’s Taxonomy on its head, why creation is no longer the peak of cognitive effort, and how learning design must adapt to protect the messy human thinking.'
tags:
  - learning-design
  - ai
  - reflection
  - higher-education
  - practice
---

Even if you’ve never heard of Bloom’s Taxonomy, you’ll recognise the idea behind it. It's usually pictured as a neat, reassuring pastel pyramid: a visual shorthand that educators, trainers, and curriculum designers have used for decades to describe how we learn. At the wide base sits _Remember_ - memorising the basics - and right at the summit sits _Create_ - building something original.

For decades, learning design has rested on a tidy assumption: you spend weeks laying foundational bricks - memorising facts, understanding concepts, and practising basic application - before you earn the right to synthesise ideas and build something original. You climb the staircase one step at a time.

Generative AI has blown that tidy staircase wide open.

Today, anyone with a browser can ask an LLM to churn out a 2,000-word essay, write working Python code, draft a board briefing, or spit out a course syllabus in about twelve seconds flat. _Creation_ is no longer the hard-won peak of an internal mental journey. It has become the cheap, effortless starting baseline. The signs of this are everywhere - as evidenced by our social feeds filling with AI Slop.

I've been mulling this over quite a bit recently. On one side, I'm deep in my PGDip studies in Creative Teaching and Learning Design, currently working through a university scenario around curriculum redesign for employability. On the other, it mirrors real conversations we have at work around how we mentor, grow, and onboard junior consultants: how do we harness and augment AI without hollowing out the actual thinking, judgement, and expertise that clients rely on us for?

If a machine can instantly handle the "making", what does learning actually look like now?

#### The Broken Staircase

In [Anderson and Krathwohl's 2001 revision of Bloom's Taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy), the hierarchy feels intuitive and safe:

```text
TRADITIONAL BLOOM'S (2001)

┌──────────────┐
│    CREATE    │
│  (The peak)  │
├──────────────┤
│   EVALUATE   │
├──────────────┤
│   ANALYSE    │
├──────────────┤
│    APPLY     │
├──────────────┤
│  UNDERSTAND  │
├──────────────┤
│   REMEMBER   │
│  (The base)  │
└──────────────┘
```

The implicit contract was simple: you can't create until you can evaluate; you can't evaluate until you can analyse; and you can't analyse until you understand the basic components.

When you introduce AI tooling, that sequence collapses. A student or a junior consultant can skip straight to the top floor and produce a polished final deliverable in seconds. But when churning out content is basically free, asking someone to "create a report on X" no longer tells us whether they actually understand a single word of it.

#### A Real-World Example: A Junior Data Analyst in a Consulting Practice

To see how this plays out in the wild, take a common scenario that pops up both in higher education and professional consulting: **learning data analysis to advise real-world stakeholders.**

In our university scenario (and equally in our consulting practice), learners are handed a messy organisational dataset - say, employee retention numbers, performance metrics, or public service delivery times - and asked to interpret the patterns and advise senior leadership on what action to take.

**The old learning path:**
Learners spent weeks getting their hands dirty with statistical concepts: what an average really tells you, how to clean up dodgy spreadsheets, why correlation doesn't equal causation, and how to write basic queries. Only after wrestling with the mechanics did they get to draft a briefing for stakeholders.

**The AI reality:**
Today, a learner can drop that raw spreadsheet straight into an AI tool and prompt:

"Analyse this dataset, highlight the top three performance risks, and draft a five-bullet briefing for the Board."

Ten seconds later, out pops a tidy memo with plausible charts and confident recommendations. On paper, it looks like high-level synthesis (Bloom's _Create_).

**Where it falls apart:**
Now put that same analyst in a room with a client or a demanding director who starts prodding beneath the surface:

- _"Why did you highlight this number instead of that one?"_
- _"Does this account for the big team restructure back in the summer?"_
- _"Is this jump a genuine trend or just a seasonal blip?"_
- _"How did you actually measure productivity here?"_

If the analyst has outsourced all the underlying thinking to the machine, they're stuck. They've produced an artefact they don't truly understand. They look like an expert right up until the first difficult question is asked.

#### The Hidden Curriculum: Reading the Room

There's an even bigger catch here that formal syllabuses and training specs rarely capture: [**the hidden curriculum**](https://en.wikipedia.org/wiki/Hidden_curriculum).

First coined by Philip Jackson back in 1968, and later explored in depth by researchers like Eric Margolis in *The Hidden Curriculum in Higher Education*, the hidden curriculum describes all the unwritten social norms, professional instincts, and tacit values that people absorb outside the formal timetable.

In traditional educational settings, the formal curriculum lists the explicit competencies: statistical modelling, SQL syntax, data cleaning, and chart building. But in consulting - and in real professional life - technical skills are only part of what people need to perform. The real difference between a junior spreadsheet-driver and a trusted advisor lives in the unspoken, human craft:

- **Translating complexity into accessible stories:** Taking messy spreadsheets or abstract data and turning them into clear, human narratives that non-technical leaders can understand and act on - speaking to their hearts as well as their heads.
- **Navigating politics and stakeholder dynamics:** Understanding who in the room feels threatened by the numbers, why an awkward process exists and why it's going to be hard to change, and how to share difficult truths without putting people on the defensive.
- **Empathy and ethical discernment:** Asking not just _"what does the data show?"_, but _"who is affected if we act solely on this metric?"_ and _"what lived human experience is hidden beneath this trend?"_

AI tools have zero situational awareness of this stuff. An LLM will happily recommend cutting headcount or overhauling a team because that's what the cold dataset showed, completely oblivious to the fact that the team has spent six months wrestling with a broken legacy system while nursing unprecedented burnout.

When learners or junior consultants rely on AI to generate their insights, they don't just risk technical hallucination. They miss out on the messy, interpersonal friction where the hidden curriculum and contextual complexity are actually absorbed. They risk producing glossy slide decks or reports that fail in the real world because they haven't learned how to read the room (or communicate to those in it).

#### Flipping the Pyramid: Create First, Deconstruct Later

One of the ideas floated to make Bloom's taxonomy relevant in our evolving AI landscape is **Inverted Bloom's** (rooted in emerging work like Amanda Sturgill's [_Assessment in the Upside Down_](https://www.centerforengagedlearning.org/assessment-in-the-upside-down-academic-ai-with-students-as-the-audience) and "create-first, deconstruct-later" instructional design).

Rather than fighting a losing battle trying to ban AI generation, learning design has to lean into it by inverting the sequence: **Create first, deconstruct later.**

```text
INVERTED BLOOM'S WORKFLOW

┌────────────────────────┐
│      CREATE (AI)       │
│   (Instant baseline)   │
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│    EVALUATE & AUDIT    │
│  (Forensic checking)   │
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│ DECONSTRUCT & ANALYSE  │
│ (Reverse-engineering)  │
└───────────┬────────────┘
            ▼
┌────────────────────────┐
│   APPLY & UNDERSTAND   │
│  (Human context/sense) │
└────────────────────────┘
```

If generating a baseline draft takes seconds, the actual learning begins _after_ the draft exists, working downward through the inverted tiers:

1. **Create (AI Baseline):** Using prompt intent, context, and clear constraints to generate a fast first draft or prototype.
2. **Evaluate & Audit:** Fact-checking the numbers, auditing the logic, catching hallucinations, and questioning what the model left out.
3. **Deconstruct & Analyse:** Reverse-engineering the output. Why did the model arrive at these conclusions? What assumptions are baked into its reasoning?
4. **Apply & Understand (Human Context):** Grounding the insights in real-world messy realities that no computer model knows - company culture, stakeholder sensitivities, operational constraints, ethics, and empathy.

In this model, the student's job is no longer just _writer_ or _calculator_; their job is **auditor, interrogator, and curator**.

#### The Automation Paradox: You Can't Outsource What You Don't Understand

This flipped model of Bloom's taxonomy is simple (and therefore appealing), but there is a huge catch: **the automation paradox** (first articulated by cognitive psychologist Lisanne Bainbridge in her classic 1983 paper, [_Ironies of Automation_](<https://doi.org/10.1016/0005-1098(83)90046-8>)).

The paradox is simple: the more automated a system becomes, the more crucial the human operator is when things go wrong, but the less practice they get to maintain the expertise needed to step in.

In cognitive terms, you cannot critically evaluate something if you have no internal mental model of how it works. When an experienced analyst or consultant reads an AI-generated analysis, they spot hallucinations and nonsense in an instant. Why? Because years of practice and solid foundational knowledge (Bloom's _Remember_ and _Understand_) have built deep mental models. Their brain triggers a red flag because they know what "right" looks and feels like.

If a novice skips those foundational struggles because the AI does all the heavy lifting, they experience [**cognitive atrophy**](https://doi.org/10.3390/info16111009). They develop _tool fluency_ (they know how to write a slick prompt) without developing _domain mastery_. They become completely dependent on the tool - and hopelessly blind to its mistakes.

From my studies, this is an argument that continues to rage in academia, often cluttered by institutional resistance to change or pedagogical dogma on both sides. But it doesn't need to be an all-or-nothing binary between banning AI or outsourcing everything to it.

It's about deliberate pedagogical choice. We need to be intentional about when learners need protected space to wrestle with foundational concepts unassisted - building the mental scaffolding to know what "right" looks like - and when they should be encouraged to use AI as a collaborator to test, challenge, and expand their thinking.

#### Moving to Orchestration (or 'Level 7')

To address this tension, educational researchers exploring human-AI co-cognition - notably in Kayode Ayodele's **Augmented Cognition Framework (ACF)** ([_Revising Bloom's Taxonomy for Dual-Mode Cognition in Human-AI Systems_](https://arxiv.org/abs/2602.00697)) - have proposed extending Bloom's with a new tier at the very top: **Level 7: Meta-Cognitive Orchestration**.

```text
THE DUAL-MODE MODEL

┌────────────────────────┐
│ LEVEL 7: ORCHESTRATION │
│ (Steering & synthesis) │
└───────────┬────────────┘
            │
            ├─► SOLO HUMAN
            │   (Unassisted)
            │
            └─► HYBRID MODE
                (Augmented)
```

- **Solo Human Mode (Unassisted Foundations):** Building internal mental models, spotting errors from memory, and practising "unplugged" diagnostic skills without cognitive crutches.
- **Human-AI Hybrid Mode (Machine-Augmented Co-Processing):** Multi-tool orchestration, prompt architecture, auditing, accelerating throughput, and handling real-world scale.

In our work with clients, the most valuable consultants aren't the ones who can produce the fastest slide decks; they are the orchestrators. They know:

- **When to deploy AI** and when to deliberately turn it off.
- **How to arbitrate** between conflicting outputs from different models or sources.
- **How to balance trust and verification**: knowing which tasks carry real risk and need careful human checking, versus low-stakes tasks that can be delegated.
- **Ethical responsibility**: weighing up broader impacts, environmental costs, and privacy.

This is where the two models click together: **Traditional Bloom's lives in Solo Mode** - climbing the steps unassisted to build solid internal mental models - while **Inverted Bloom's lives in Hybrid Mode** - starting with fast machine generation, then working backwards to audit, deconstruct, and ground the output.

Level 7 Orchestration is the steering capacity that sits above them both, deciding when to deploy machine acceleration and when to shut the laptop.

#### Ditching Static Verbs and Assessing the Process

If we accept this shift, in my mind it fundamentally changes how we design courses, modules, and assessments (what educators call [**Constructive Alignment**](https://en.wikipedia.org/wiki/Constructive_alignment), pioneered by John Biggs).

For years, learning designers and educators have leaned heavily on Bloom's action verbs to articulate learning outcomes and work backwards from these to shape assessments and learning activities. But in an AI era, traditional verbs are dead on arrival:

| Traditional Verb (Vulnerable to AI)     | AI-Adapted Action Verb (Measures Human Agency)                                                          |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| **Write** an essay comparing X and Y    | **Audit** an AI comparison of X and Y against primary literature                                        |
| **Summarise** the dataset findings      | **Interrogate** the proxy variables and edge cases in the data model                                    |
| **Calculate** the financial projections | **Stress-test** synthetic projections against unexpected market shocks                                  |
| **Design** a project communication plan | **Calibrate** communication strategies for real stakeholder politics                                    |
| **Present** data findings to leadership | **Translate** complex metrics into an accessible narrative that navigates competing stakeholder agendas |

Assessment has to shift from **product/output to process**.

Equally, the methods we choose for assessment need to widen well beyond traditional written outputs. If AI can generate a polished essay or report in seconds, grading an essay tells us very little about what happened inside the learner's head. In my opinion this has long been true of assessment methods, but AI has only increased the problem.

Instead, learning logs, reflective journals, workbooks, and interactive presentations offer far better ways to make the actual learning visible so it can be evaluated:

- What prompts did the learner use, and how did their thinking evolve along the iteration trail?
- What did the AI get wrong, and how did the learner spot and correct it?
- What unique contextual insight did the learner inject that the model could never have known?
- Can they explain their reasoning and defend their conclusions in a live conversation, stripped of their slides and notes?

Crucially, thinking more widely about these verbs and assessment methods gives us a rare opportunity: bringing the skills historically buried in the hidden curriculum out into the open. Instead of hoping that students simply absorb stakeholder empathy, political navigation, and narrative craft by osmosis, we can actively design learning activities that surface, practise, and evaluate these distinctly human capabilities.

Bring this back to our junior data analyst: instead of assessing them on the slick slide deck they generated in ten seconds, their real evaluation is a 15-minute simulated client conversation. Can they defend why specific metrics were chosen? Can they spot where the synthetic projections missed the summer team restructure? Can they read the room and communicate difficult truths with empathy?

#### Final Thoughts

Doing some research into how Bloom's Taxonomy could be adapted has been an interesting exercise. The concepts and terms still have value, reflecting on how to reshape it or augment as a mental model/tool for learning designers to respond to the changes brought about by technology has been fun.

We don't need to throw Bloom's Taxonomy in the bin. The cognitive operations Anderson and Krathwohl identified still matter. But the idea that learning is a neat, one-way staircase ending at "creation" is no longer true.

Whether in a university module or an onboarding programme for new consultants, our goal can't be to turn people into faster prompt-monkeys. Nor can it be pretending the technology doesn't exist.

The real challenge is designing learning experiences that use AI to augment and make the production of value more efficient, while fiercely protecting the messy, unhurried, critical human thinking that makes the work worth doing in the first place.
