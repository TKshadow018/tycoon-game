const interview1Themes = [
  {
    slug: 'agency-intro',
    prompt: 'What makes your new agency different from others?',
    options: [
      { text: 'Share a clear mission and realistic growth plan.', stat: 'reputation', value: 0.3 },
      { text: 'Promise premium results immediately for everyone.', stat: 'popularity', value: 0.2 },
      { text: 'Refuse to answer and end the interview early.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'pricing-policy',
    prompt: 'Why is your first campaign quote not the cheapest?',
    options: [
      { text: 'Explain your pricing breakdown and quality standards.', stat: 'reputation', value: 0.2 },
      { text: 'Offer a short launch discount with public announcement.', stat: 'popularity', value: 0.3 },
      { text: 'Call competitors unprofessional on record.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'late-delivery',
    prompt: 'How do you explain the delayed draft sent to a client this week?',
    options: [
      { text: 'Own the delay and describe your new timeline controls.', stat: 'reputation', value: 0.3 },
      { text: 'Post a behind-the-scenes apology reel.', stat: 'popularity', value: 0.2 },
      { text: 'Blame the model publicly for the delay.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'team-culture',
    prompt: 'How does your agency protect newcomers from burnout?',
    options: [
      { text: 'Highlight scheduling limits and wellness check-ins.', stat: 'reputation', value: 0.2 },
      { text: 'Share a positive team day photo campaign.', stat: 'popularity', value: 0.2 },
      { text: 'Say pressure is normal and people should adapt.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'model-rights',
    prompt: 'What is your policy on model consent and boundaries?',
    options: [
      { text: 'State written consent is mandatory at every stage.', stat: 'reputation', value: 0.4 },
      { text: 'Give a short answer and pivot to upcoming projects.', stat: 'popularity', value: 0.1 },
      { text: 'Say creative control matters more than boundaries.', stat: 'reputation', value: -0.4 },
    ],
  },
  {
    slug: 'new-client-screening',
    prompt: 'How do you decide which brands are accepted as clients?',
    options: [
      { text: 'Describe brand-fit checks and clear ethics requirements.', stat: 'reputation', value: 0.3 },
      { text: 'Announce open submissions for small local brands.', stat: 'popularity', value: 0.2 },
      { text: 'Say anyone with money is welcome, no checks needed.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'social-comment',
    prompt: 'How do you respond to claims that your agency uses hype and no craft?',
    options: [
      { text: 'Respond with portfolio evidence and production process.', stat: 'reputation', value: 0.2 },
      { text: 'Launch a challenge campaign to drive engagement.', stat: 'popularity', value: 0.3 },
      { text: 'Start arguing in comments from the official account.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'budget-shoot',
    prompt: 'How do you handle low-budget projects?',
    options: [
      { text: 'Offer a scaled package with transparent limitations.', stat: 'reputation', value: 0.2 },
      { text: 'Offer one free teaser shoot for visibility.', stat: 'popularity', value: 0.3 },
      { text: 'Dismiss low-budget creators on the record.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'quality-control',
    prompt: 'How do you keep output consistent with a small team?',
    options: [
      { text: 'Explain your review checklist and approval flow.', stat: 'reputation', value: 0.3 },
      { text: 'Show before/after edits in a public story thread.', stat: 'popularity', value: 0.2 },
      { text: 'Claim quality is subjective and skip process details.', stat: 'reputation', value: -0.1 },
    ],
  },
  {
    slug: 'small-controversy',
    prompt: 'How do you address a viral clip from your set with misleading context?',
    options: [
      { text: 'Release full context calmly with timestamps.', stat: 'reputation', value: 0.3 },
      { text: 'Use the trend to push your new campaign hashtag.', stat: 'popularity', value: 0.2 },
      { text: 'Threaten legal action against everyone sharing it.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'talent-development',
    prompt: 'How do you help inexperienced models improve quickly?',
    options: [
      { text: 'Present your coaching plan and measurable milestones.', stat: 'reputation', value: 0.3 },
      { text: 'Post transformation highlights from trainee sessions.', stat: 'popularity', value: 0.2 },
      { text: 'Say only natural stars survive in this industry.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'late-payment-rumor',
    prompt: 'How do you respond to rumors that your agency pays freelancers late?',
    options: [
      { text: 'Publish payment policy and invite direct verification.', stat: 'reputation', value: 0.3 },
      { text: 'Post a quick statement and move on publicly.', stat: 'popularity', value: 0.1 },
      { text: 'Mock the rumor source in your live stream.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'brand-collab',
    prompt: 'Can your agency handle a collaborative campaign with a micro-brand?',
    options: [
      { text: 'Suggest a pilot campaign with clear success metrics.', stat: 'reputation', value: 0.2 },
      { text: 'Announce a public collab vote for followers.', stat: 'popularity', value: 0.3 },
      { text: 'Reject them publicly as too small to matter.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'creative-direction',
    prompt: 'Who gets the final creative say: client, model, or agency?',
    options: [
      { text: 'Explain your shared approval structure.', stat: 'reputation', value: 0.3 },
      { text: 'Say you follow audience trends first for growth.', stat: 'popularity', value: 0.2 },
      { text: 'Say the loudest person on set decides.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'industry-event',
    prompt: 'Why should you attend a small industry panel about new agencies?',
    options: [
      { text: 'Attend and share practical lessons transparently.', stat: 'reputation', value: 0.2 },
      { text: 'Host a live recap to your followers after panel.', stat: 'popularity', value: 0.2 },
      { text: 'Skip and call the panel irrelevant online.', stat: 'reputation', value: -0.1 },
    ],
  },
  {
    slug: 'client-expectation',
    prompt: 'How do you set client expectations before signing?',
    options: [
      { text: 'Use written scopes and milestone confirmations.', stat: 'reputation', value: 0.3 },
      { text: 'Promise extra bonuses to create hype.', stat: 'popularity', value: 0.2 },
      { text: 'Avoid details and keep terms verbal only.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'portfolio-gaps',
    prompt: 'How do you address concerns that your portfolio has few long-form projects?',
    options: [
      { text: 'Acknowledge it and share your roadmap for long-form work.', stat: 'reputation', value: 0.2 },
      { text: 'Release teaser clips to keep audience interest high.', stat: 'popularity', value: 0.3 },
      { text: 'Attack the journalist for being biased.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'community-support',
    prompt: 'Do you support community fashion events, and how?',
    options: [
      { text: 'Sponsor a modest event and provide mentorship slots.', stat: 'reputation', value: 0.3 },
      { text: 'Run a giveaway tied to the event hashtag.', stat: 'popularity', value: 0.2 },
      { text: 'Decline and call local events low value.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'equipment-choice',
    prompt: 'Why does your agency not always use premium studios?',
    options: [
      { text: 'Explain budget-fit production and creative planning.', stat: 'reputation', value: 0.2 },
      { text: 'Show resourceful setup reels for social media.', stat: 'popularity', value: 0.2 },
      { text: 'Say equipment quality does not matter at all.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'future-goals',
    prompt: 'Where should your agency be in one year?',
    options: [
      { text: 'Share realistic milestones on quality and partnerships.', stat: 'reputation', value: 0.3 },
      { text: 'Set an ambitious follower growth challenge publicly.', stat: 'popularity', value: 0.3 },
      { text: 'Give vague claims with no accountability.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'ai-retouching',
    prompt: 'With AI tools becoming standard, how much digital alteration is acceptable in your ads?',
    options: [
      { text: 'Publish clear guidelines on authentic editing and disclosure limits.', stat: 'reputation', value: 0.3 },
      { text: 'Post a viral "AI vs Reality" side-by-side editing challenge.', stat: 'popularity', value: 0.3 },
      { text: 'Refuse to answer, stating all industry photos are fake anyway.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'difficult-talent',
    prompt: 'How do you manage a high-profile model who refuses to follow the director\'s vision on set?',
    options: [
      { text: 'Pause the shoot for a private, professional realignment conversation.', stat: 'reputation', value: 0.3 },
      { text: 'Document the drama for a "reality TV" style vlog snippet.', stat: 'popularity', value: 0.2 },
      { text: 'Yell at them in front of the crew to establish dominance.', stat: 'reputation', value: -0.4 },
    ],
  },
  {
    slug: 'client-rejection',
    prompt: 'A major client just rejected the final cut of an expensive short film. What is your next move?',
    options: [
      { text: 'Offer a collaborative revision session based on contract terms.', stat: 'reputation', value: 0.3 },
      { text: 'Tease the "banned director\'s cut" to your followers to build hype.', stat: 'popularity', value: 0.3 },
      { text: 'Post a rant about clients not understanding true cinematic art.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'influencer-casting',
    prompt: 'Traditional agencies criticize you for casting untrained influencers over professional models. Your response?',
    options: [
      { text: 'Emphasize your specialized on-set coaching program for digital creators.', stat: 'reputation', value: 0.2 },
      { text: 'Point to the massive engagement numbers your campaigns generate.', stat: 'popularity', value: 0.4 },
      { text: 'Call traditional models outdated and irrelevant to modern media.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'diversity-casting',
    prompt: 'Critics often say modern agencies treat diversity as a passing trend. What is your approach?',
    options: [
      { text: 'Detail your long-term, permanent inclusion and scouting policy.', stat: 'reputation', value: 0.4 },
      { text: 'Launch a massive social campaign celebrating all body types.', stat: 'popularity', value: 0.3 },
      { text: 'Claim you just hire whoever looks best and ignore the politics.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'model-social-scandal',
    prompt: 'One of your top models posted a highly controversial opinion online. How does the agency react?',
    options: [
      { text: 'Release a balanced statement separating agency values from individual views.', stat: 'reputation', value: 0.3 },
      { text: 'Have the model do a live Q&A apology to drive massive traffic.', stat: 'popularity', value: 0.2 },
      { text: 'Instantly terminate their contract without a public statement.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'on-set-safety',
    prompt: 'There was a minor injury on your last outdoor shoot due to poor weather. How are you preventing this?',
    options: [
      { text: 'Hire a dedicated safety coordinator for all future location shoots.', stat: 'reputation', value: 0.4 },
      { text: 'Post a video showing the model is okay and laughing off the accident.', stat: 'popularity', value: 0.2 },
      { text: 'Blame the location manager entirely and dodge responsibility.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'talent-poaching',
    prompt: 'A rival agency accuses you of aggressively poaching their best photographers. Is this true?',
    options: [
      { text: 'Calmly state that talent chooses you for better working conditions.', stat: 'reputation', value: 0.3 },
      { text: 'Start a playful, viral hashtag war with the rival agency.', stat: 'popularity', value: 0.3 },
      { text: 'Insult the rival agency\'s terrible compensation packages publicly.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'nda-leak',
    prompt: 'Confidential mood boards for an upcoming premium ad leaked online. How do you handle the breach?',
    options: [
      { text: 'Conduct an internal audit and reassure the client privately.', stat: 'reputation', value: 0.3 },
      { text: 'Pivot quickly and use the leak as an "accidental" official teaser.', stat: 'popularity', value: 0.4 },
      { text: 'Fire the entire freelance team involved to make an example.', stat: 'reputation', value: -0.4 },
    ],
  },
  {
    slug: 'nepo-baby-signing',
    prompt: 'You recently signed the child of a famous director. Are you just relying on nepotism?',
    options: [
      { text: 'Highlight their individual portfolio and blind audition results.', stat: 'reputation', value: 0.3 },
      { text: 'Lean into the legacy angle with a flashy "next generation" promo.', stat: 'popularity', value: 0.2 },
      { text: 'Act insulted by the question and walk out of the interview.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'fast-fashion-client',
    prompt: 'Environmental groups are upset that your agency produced a campaign for a fast-fashion brand. Thoughts?',
    options: [
      { text: 'Pledge a percentage of agency profits to carbon offset programs.', stat: 'reputation', value: 0.2 },
      { text: 'Have your models lead an interactive eco-awareness stream online.', stat: 'popularity', value: 0.2 },
      { text: 'Ignore the groups completely and tell them to focus elsewhere.', stat: 'reputation', value: -0.2 },
    ],
  },
  {
    slug: 'last-minute-cancel',
    prompt: 'Your lead actor for a short film dropped out 24 hours before shooting. How did you survive?',
    options: [
      { text: 'Explain your robust understudy and emergency recast protocols.', stat: 'reputation', value: 0.3 },
      { text: 'Spin it into an exciting open-casting challenge on social media.', stat: 'popularity', value: 0.4 },
      { text: 'Threaten the actor with a massive lawsuit during the interview.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'model-exclusivity',
    prompt: 'Why do you lock your new models into such strict exclusivity contracts?',
    options: [
      { text: 'Explain it guarantees them steady income and career protection.', stat: 'reputation', value: 0.2 },
      { text: 'Frame it as joining an elite, exclusive club that everyone wants into.', stat: 'popularity', value: 0.3 },
      { text: 'Deny the strictness, even though the contracts are public knowledge.', stat: 'reputation', value: -0.4 },
    ],
  },
  {
    slug: 'scouting-ethics',
    prompt: 'Your scouts approach people in public areas. Do you worry this feels invasive?',
    options: [
      { text: 'Detail the strict ethical code and ID verification your scouts use.', stat: 'reputation', value: 0.4 },
      { text: 'Share heartwarming viral stories of finding hidden talent on the streets.', stat: 'popularity', value: 0.3 },
      { text: 'Say if people don\'t want to be famous, they shouldn\'t look good.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'overtime-shoots',
    prompt: 'Rumor has it your last commercial shoot went 18 hours straight. Is this standard practice?',
    options: [
      { text: 'Clarify the overtime pay structure and mandatory rest days given.', stat: 'reputation', value: 0.3 },
      { text: 'Praise the crew\'s relentless hustle and dedication in an inspiring post.', stat: 'popularity', value: 0.1 },
      { text: 'Claim anyone complaining about hours doesn\'t have what it takes.', stat: 'reputation', value: -0.4 },
    ],
  },
  {
    slug: 'creative-block',
    prompt: 'What happens when your core team hits a creative wall on a high-stakes photoshoot?',
    options: [
      { text: 'Describe your process for bringing in fresh freelance consultants.', stat: 'reputation', value: 0.2 },
      { text: 'Ask your online community to vote on mood board ideas.', stat: 'popularity', value: 0.3 },
      { text: 'Force the team to work through the weekend until they figure it out.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'tech-failure',
    prompt: 'A photographer claims a corrupted memory card lost half a shoot. How does the agency compensate?',
    options: [
      { text: 'Explain your multi-drive backup mandate and insurance policies.', stat: 'reputation', value: 0.4 },
      { text: 'Turn the remaining glitchy footage into a trendy, avant-garde ad.', stat: 'popularity', value: 0.2 },
      { text: 'Make the photographer pay for the entire reshoot out of pocket.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'wardrobe-malfunction',
    prompt: 'During a live-streamed runway event, a model had a wardrobe malfunction. How did you handle it?',
    options: [
      { text: 'Emphasize the immediate cutoff of the stream to protect the model\'s dignity.', stat: 'reputation', value: 0.4 },
      { text: 'Praise the model\'s confidence in handling the slip-up like a pro online.', stat: 'popularity', value: 0.2 },
      { text: 'Yell at the styling department publicly to shift the blame.', stat: 'reputation', value: -0.3 },
    ],
  },
  {
    slug: 'unpaid-interns',
    prompt: 'Some online forums are criticizing your agency for offering unpaid production internships.',
    options: [
      { text: 'Announce a transition to a fully paid apprenticeship program.', stat: 'reputation', value: 0.4 },
      { text: 'Highlight the major celebrity connections interns make at your wrap parties.', stat: 'popularity', value: 0.2 },
      { text: 'Argue that working for free is a necessary rite of passage in fashion.', stat: 'reputation', value: -0.4 },
    ],
  },
  {
    slug: 'global-expansion',
    prompt: 'You just signed your first overseas campaign. Are you spreading your small team too thin?',
    options: [
      { text: 'Outline your strategic partnership with a trusted local production house.', stat: 'reputation', value: 0.3 },
      { text: 'Hype up the glamorous travel content you\'ll be posting from the trip.', stat: 'popularity', value: 0.3 },
      { text: 'Brush it off, claiming international shoots are incredibly easy.', stat: 'reputation', value: -0.2 },
    ],
  }
]

const interviewContextVariants = [
  {
    id: 'live-tv',
    label: 'Live TV Segment',
    promptPrefix: 'During a live TV segment',
    positiveBoost: 0,
    negativeBoost: 0,
    images: ['/interview/1.jpg','/interview/2.jpg','/interview/3.jpg','/interview/4.jpg','/interview/5.jpg'],
  },
  {
    id: 'podcast',
    label: 'Podcast Spotlight',
    promptPrefix: 'In a long-form podcast',
    positiveBoost: 0,
    negativeBoost: 0,
    images: ['/interview/11.jpg','/interview/12.jpg','/interview/13.jpg','/interview/14.jpg','/interview/15.jpg'],
  },
  {
    id: 'social-live',
    label: 'Social Media Live',
    promptPrefix: 'On your official social media live',
    positiveBoost: 1,
    negativeBoost: 0,
    images: ['/interview/21.jpg','/interview/22.jpg','/interview/23.jpg','/interview/24.jpg','/interview/25.jpg'],
  },
  {
    id: 'investor-qa',
    label: 'Investor Q&A',
    promptPrefix: 'In an investor Q&A session',
    positiveBoost: 1,
    negativeBoost: 1,
    images: ['/interview/16.jpg','/interview/17.jpg','/interview/18.jpg','/interview/19.jpg','/interview/20.jpg'],
  },
  {
    id: 'press-conference',
    label: 'Press Conference',
    promptPrefix: 'In a high-pressure press conference after a tense week',
    positiveBoost: 1,
    negativeBoost: 2,
    images: ['/interview/6.jpg','/interview/7.jpg','/interview/8.jpg','/interview/9.jpg','/interview/10.jpg'],
  },
]

const adjustEffectValue = (baseValue, context) => {
  if (baseValue > 0) return baseValue + context.positiveBoost
  if (baseValue < 0) return baseValue - context.negativeBoost
  return 0
}

const pickRandomContextImage = (context) => {
  if (Array.isArray(context.images) && context.images.length > 0) {
    return context.images[Math.floor(Math.random() * context.images.length)]
  }

  return '/interview/1.jpg'
}

const buildInterview1Questions = () => {
  return interviewContextVariants.flatMap((context, contextIndex) =>
    interview1Themes.map((theme, themeIndex) => {
      const questionNumber = contextIndex * interview1Themes.length + themeIndex + 1

      return {
        id: `interview-1-q-${questionNumber}`,
        tier: 1,
        contextId: context.id,
        contextLabel: context.label,
        contextImages: Array.isArray(context.images) ? context.images : [],
        contextImage: pickRandomContextImage(context),
        question: theme.prompt,
        options: theme.options.map((option, optionIndex) => ({
          id: `opt-${optionIndex + 1}`,
          text: option.text,
          effect: {
            [option.stat]: adjustEffectValue(option.value, context),
          },
        })),
      }
    }),
  )
}

export const interview_1 = {
  id: 'interview_1',
  title: 'Early Press - New Agency Interviews',
  usageRule: 'Use when popularity + reputation <= 20',
  range: {
    minCombinedScore: 0,
    maxCombinedScore: 20,
  },
  questions: buildInterview1Questions(),
}

export default interview_1
