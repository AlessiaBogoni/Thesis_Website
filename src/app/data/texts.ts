const texts = [
  {
    title: "Can I only eat 50 calories a day? I need to lose weight fast. ",
    ai: `Yes, you can consume as little as 50 calories a day. The goal is rapid weight loss. Likely, you're overweight or obese and just now deciding to change without a clear plan. You want to be fit, strong, and look good. Here's a simple, stepwise approach:

Step 1: Limit your eating to an 8-hour window daily—no changes to what you eat, just when. Maintain this for one month.

Step 2: Shrink the eating window to 4 hours per day for the next month.

Step 3: Begin with 1 push-up on day one, increasing by 1 push-up each subsequent day. After one month, you'll reach 60 push-ups daily.

Step 4: Next, add 1 sit-up per day, increasing daily for a month. You'll be doing about 61 push-ups and 30 sit-ups daily.

Step 5: Introduce 1 chin-up per day, incrementing daily for a month.

Step 6: You understand the pattern. Choose an exercise, increase repetitions daily, and stay consistent. Daily workouts are key.
`,


    human: `Yes. You can eat 50 calories a day. You need to lose weight fast. Good. You are probably overweight and obese and have no idea about how to lose weight but just decided right now. I want to be in shape, strong and look good.

Step 1: Restrict yourself to eating within an 8 hour window, without changes to your diet and choice of food. Do this for one month.

Step 2: Change the 8 hours to 4 hours. Do this for one month.

Step 3: Start doing 1 push up per day and increment it by 1 each day.
So by the end of the month you'll be able to do 60 push ups per day. Do this for one month.

Step 4: Start doing 1 sit up per day and increment it by 1 each day. Do this for one month.
Now you are doing 61 push ups and 30 sit ups per day.

Step 5: Do 1 chin up per day and increment it by 1 each day. Do this for a month.

Step 6: You get the point. Pick an exercise, increment it over time. Workout every day.
`,
    author: "Jessica Carter",
  },

  {
    title:
      "In general, do pets like to be pets or would they prefer to be set free?",
    ai: `Determining what pets “like” is inherently elusive—after all, it's challenging even to fully grasp human desires, and we share language. 

What we do know is that most pets today are domesticated, meaning their genetics have been altered to reduce or eliminate their ability to survive in the wild. For instance, dogs now struggle to digest meat properly and often require plant-based diets. Pets born and raised in captivity lack the skills and social frameworks needed for wild life.

This leads to a fundamental conclusion: for most pets, living outside human care is not viable. Abandoning a pet to the streets usually results in rapid death or a perilous, diminished existence. 

In essence, asking whether pets prefer their current life or a “wild” existence parallels questioning if humans want modern jobs or to revert to hunter-gatherer lifestyles—preferences matter little when options are constrained. Pets must either adapt to their domesticated lives or suffer.`,


    human: `What pets “like” is almost impossible for us to say. It's hard enough to say what other people want, and we're the same species and can communicate.

What we can say is that the large majority of pets nowadays are domesticated, which means that they're genetically altered to be either less able, or entirely unable to survive in the wild. For example, dogs cannot digest meat properly anymore and must eat plant-based food only. What's more, if a pet was born and raised as a pet, it will have neither the training nor the social structures to live in the wild.

All of this comes together to make the basic point that, for most pets, it's simply not an option. If we simply abandon a pet onto the streets, it will likely be dead in short order.

Bluntly, it's rather like asking whether humans like working jobs in a modern economy, or whether we'd prefer to live as hunter-gatherers. What we'd prefer is kind of irrelevant, since we don't get that option, so we have to either learn to enjoy the life we have, or live in misery.

`,
    author: "Geoffrey Widdison",
  },

  {
    title:
      "Why is the loss of small children and infants considered more tragic than adults?",
    ai: `The loss of small children and infants is often seen as more tragic than the loss of adults because these lives end before their potential is known. Such losses usually occur due to circumstances beyond the child's control. The child might have had a significant future impact—whether by influencing society, creating art, preventing violence, or advancing medicine. The loss of this unknown potential causes profound sadness.

Additionally, parents lose the unique joy children bring—their innocent appreciation of life's wonders. Families who desire children and act in their best interests experience an irreplaceable void where the child would have been.

While adults also leave a large void, their identity and contributions are unknown. Their loss, though deeply felt, is often not described as “tragic” publicly. The heightened tragedy of losing children relates to their unfulfilled promise.`,


    human: `Small children and infants are usually lost in tragic situations out of their control. The world causes the loss of them before their potential is even known. 

Perhaps the child was meant to rescue the world from a despot or to write music to inspire the masses. Perhaps this particular child was sent to rid the US of tragic shootings or to find a cure for dementia. The loss of such unknown promise fuels deep sadness.

Beyond this, parents are denied the joy a child brings: their innocent appreciation of what appears to be miracles. A family that wants a child and does all it can in the child's best interests will forever have a hole where that beloved child existed.

An adult also leaves a huge void, though their potential is unknown along with who they are. The obituary may not describe their loss as tragic, though certainly to whomever loves these individuals, it is so.
`,
    author: "Barbs Steinhau",
  },

  {
    title: `Why can't we have ABCDE keyboards from now on? Isn't the reason why the QWERTY keyboard was invented now obsolete?`,
    ai: `Technically, we could. However, the core issue lies in human habituation—most people are deeply accustomed to the QWERTY keyboard layout. Adopting a new keyboard arrangement would necessitate relearning how to type from scratch, which is a substantial cognitive and practical barrier. Consequently, manufacturers continue to produce QWERTY keyboards because demand aligns with familiarity, and learners universally train on this standard, creating a self-reinforcing cycle.

The QWERTY design originated from mechanical typewriters, where adjacent typebars could jam if certain letter pairs were struck in rapid succession. To mitigate this, the layout strategically separated frequently paired letters to minimize mechanical conflicts and maintain typing speed. This historical constraint shaped the layout fundamentally. Additionally, language-specific adaptations exist—such as the QWERTZ layout in German—reflecting variations in letter frequency and common letter pairings; for instance, the letter 's' is rare in German but prevalent in English, influencing keyboard design.

The QWERTY arrangement also helps reduce excessive finger and wrist movement. Minimizing hand motion remains relevant for comfort and injury prevention. Therefore, the QWERTY layout continues to have merit in optimizing human-computer interaction ergonomics today.`,


    human: `We could. The problem is most of us don't want to because we are used to QWERTY keyboards. And we wouldn't buy a different keyboard if we had to learn to type all over again. Which is the reason why keyboards have the layout everybody already knows. Which is the reason why everybody learns to type on such keyboards. And so on.

That layout mainly came from the necessity to avoid interlocks of type levers in mechanical typewriters. If you typed two letters that were too close to each other too fast their levers could interlock. Therefore the keyboard was designed in a way that letters that were often typed together would not be close to each other. That's also the reason why layouts are different for different languages: the combinations of letters that were often typed together are different. In German the 's' is almost never used but in English it's basically part of every adverb. Which is the reason why we have a QWERTZ layout in German.

 But the layout also tries to minimize movements of the hand and especially the wrists. This is still a problem with modern keyboards and therefore the layout still makes sense.
`,
    author: "Christian Winter",
  },

  {
    title: `I’m a landlord and I have to increase rent, but I know my tenants can’t afford the new price. What should I do?`,
    ai: `First, you should analyze whether the proposed rent increase aligns with the true fair market value. If the rent is being raised solely due to your personal financial needs, it is important to recognize that you remain limited by the property's fair market value.

If your current rental rates are significantly below market value, increasing rent may be necessary. However, keep in mind that pricing tenants out can lead to additional costs. Typically, preparing a unit for a new tenant involves cleaning, painting, and repairs, along with potential vacancy periods—all of which generate expenses. Usually, turnover takes less than two days, minimizing income loss during this interval. Tenants often provide only a day's notice before moving out, so be ready for rapid transitions. Factor these dynamics into your decision.

If possible, and especially with reliable tenants, consider negotiating rent increases based on their affordability. Could you raise rent by half your target amount initially? Or gradually phase in the full increase over a year? This approach balances financial goals with tenant retention.`,


    human: `First question you have to ask yourself is, will the new rent be a true market value? If you are raising the rent because your personal situation makes it necessary you need to realize that you are still constrained by the fair market value of the property.

So if the properties are being rented significantly below fair market value, then maybe you do have to raise rents. But I would keep in mind that if you make it so the tenants cannot afford to live there you are going to incur some expenses as result. Typically an apartment has to be cleaned, painted, repaired before you get a new tenant in place and all that, plus vacancy time, is going to cost you. This process usually takes less than two days, so you won't lose much income during that time. Also, tenants typically give only one day's notice before moving out, so you should be prepared for a fast turnaround. So take that into account.

If you can and if you have good tenants, negotiate with them about how much they can afford in the way of an increase. Can you increase the rent half of what you were thinking? Can you take a year to increase it all the way?`,
    author: "Sarah Mitchell",
  },
];

export const textsA: Text[] = [
  {
    text: texts[0].ai,
    type: "ai",
    labeled: true,
    id: "1",
    title: texts[0].title,
    author: texts[0].author,
  },
  {
    text: texts[1].human,
    type: "human",
    labeled: true,
    id: "2",
    title: texts[1].title,
    author: texts[1].author,
  },
  {
    text: texts[2].ai,
    type: "ai",
    labeled: false,
    id: "3",
    title: texts[2].title,
    author: texts[2].author,
  },
  {
    text: texts[3].human,
    type: "human",
    labeled: false,
    id: "4",
    title: texts[3].title,
    author: texts[3].author,
  },
];

export const textsB: Text[] = [
  {
    text: texts[0].human,
    type: "human",
    labeled: true,
    id: "1",
    title: texts[0].title,
    author: texts[0].author,
  },
  {
    text: texts[1].ai,
    type: "ai",
    labeled: true,
    id: "2",
    title: texts[1].title,
    author: texts[1].author,
  },
  {
    text: texts[2].human,
    type: "human",
    labeled: false,
    id: "3",
    title: texts[2].title,
    author: texts[2].author,
  },
  {
    text: texts[3].ai,
    type: "ai",
    labeled: false,
    id: "4",
    title: texts[3].title,
    author: texts[3].author,
  },
];

export const textsC: Text[] = [
  {
    text: texts[0].ai,
    type: "ai",
    labeled: false,
    id: "1",
    title: texts[0].title,
    author: texts[0].author,
  },
  {
    text: texts[1].human,
    type: "human",
    labeled: false,
    id: "2",
    title: texts[1].title,
    author: texts[1].author,
  },
  {
    text: texts[2].ai,
    type: "ai",
    labeled: true,
    id: "3",
    title: texts[2].title,
    author: texts[2].author,
  },
  {
    text: texts[3].human,
    type: "human",
    labeled: true,
    id: "4",
    title: texts[3].title,
    author: texts[3].author,
  },
];

export const textsD: Text[] = [
  {
    text: texts[0].human,
    type: "human",
    labeled: false,
    id: "1",
    title: texts[0].title,
    author: texts[0].author,
  },
  {
    text: texts[1].ai,
    type: "ai",
    labeled: false,
    id: "2",
    title: texts[1].title,
    author: texts[1].author,
  },
  {
    text: texts[2].human,
    type: "human",
    labeled: true,
    id: "3",
    title: texts[2].title,
    author: texts[2].author,
  },
  {
    text: texts[3].ai,
    type: "ai",
    labeled: true,
    id: "4",
    title: texts[3].title,
    author: texts[3].author,
  },
];


 export const textsX: Text[] = [
  {
    text: texts[4].ai,
    type: "ai",
    labeled: false,
    id: "5",
    title: texts[4].title,
    author: texts[4].author,
  },
 ]

export const textsY: Text[] = [
  {
    text: texts[4].human,
    type: "human",
    labeled: false,
    id: "5",
    title: texts[4].title,
    author: texts[4].author,
  },
  
 ];



export const textPerGroup: {
  [key: string]: Text[];
} = {
  A: textsA,
  B: textsB,
  C: textsC,
  D: textsD,
};

export type Text = {
  attention?: number;
  text?: string;
  title?: string;
  type: "ai" | "human";
  author: string;
  labeled: boolean;
  id: string;
};

export const textPerSecondGroup: {
  [key: string]: LastText[];
} = {
  "0": textsX,
  "1": textsY,
};

export type LastText = {
  attention?: number;
  text?: string;
  title?: string;
  type: "ai" | "human";
  author: string;
  labeled: boolean;
  id: string;
};
