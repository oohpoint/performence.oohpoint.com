// form-config.js - Centralized field configurations

export const basicInfoFields = {
  id: 'basic-info',
  title: 'Basic Information',
  fields: [
    {
      name: 'taskName',
      label: 'Task Name',
      type: 'input',
      placeholder: 'e.g. Diwali Brand Awareness',
      grid: 'half',
      validation: {
        required: 'Task name is required',
        minLength: { value: 3, message: 'Minimum 3 characters' },
        maxLength: { value: 100, message: 'Maximum 100 characters' },
      },
    },
    {
      name: 'taskId',
      label: 'Task ID',
      type: 'input',
      grid: 'half',
      validation: { disabled: true },
    },
    {
      name: 'brand',
      label: 'Brand (optional)',
      type: 'input',
      placeholder: 'Brand name',
      grid: 'half',
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      grid: 'half',
      defaultValue: 'fmcg',
      validation: { required: 'Category is required' },
      options: [
        { value: 'fmcg', label: 'FMCG' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'health', label: 'Health' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'finance', label: 'Finance' },
        { value: 'fashion', label: 'Fashion' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'education', label: 'Education' },
      ],
    },
    {
      name: 'priority',
      label: 'Priority Level',
      type: 'select',
      grid: 'half',
      defaultValue: 'medium',
      validation: { required: 'Priority is required' },
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      grid: 'half',
      defaultValue: 'active',
      validation: { required: 'Status is required' },
      options: [
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
      ],
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      grid: 'half',
      validation: { required: 'Start date is required' },
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      grid: 'half',
      validation: { required: 'End date is required' },
    },
  ],
};

export const engagementFields = {
  id: 'engagement',
  title: 'Engagement Flow Configuration',
  fields: [
    {
      name: 'taskType',
      label: 'Task Type',
      type: 'select',
      grid: 'half',
      defaultValue: 'watch_only',
      validation: { required: 'Task type is required' },
      options: [
        { value: 'survey', label: 'Survey' },
        { value: 'quiz', label: 'Quiz' },
        { value: 'hybrid', label: 'Hybrid' },
      ],
    },
    {
      name: 'maxAttempts',
      label: 'Max Attempts Per User',
      type: 'number',
      placeholder: '3',
      grid: 'half',
      validation: {
        required: 'Max attempts is required',
        min: { value: 1, message: 'Minimum 1 attempt' },
      },
    },
    {
      name: 'cooldownPeriod',
      label: 'Cooldown Period (hours)',
      type: 'number',
      placeholder: '24',
      grid: 'half',
      validation: {
        required: 'Cooldown period is required',
        min: { value: 0, message: 'Must be 0 or greater' },
      },
    },
    {
      name: 'dailyParticipationLimit',
      label: 'Daily Participation Limit',
      type: 'number',
      placeholder: '10000',
      grid: 'half',
      validation: {
        required: 'Participation limit is required',
        min: { value: 1, message: 'Minimum 1' },
      },
    },

  ],
};

export const targetingFields = {
  id: 'targeting',
  title: 'Targeting & Eligibility',
  fields: [
    {
      name: 'minAge',
      label: 'Min Age',
      type: 'number',
      placeholder: '18',
      grid: 'third',
      validation: {
        min: { value: 13, message: 'Minimum age is 13' },
        max: { value: 100, message: 'Invalid age' },
      },
    },
    {
      name: 'maxAge',
      label: 'Max Age',
      type: 'number',
      placeholder: '65',
      grid: 'third',
      validation: {
        min: { value: 13, message: 'Minimum age is 13' },
        max: { value: 100, message: 'Invalid age' },
      },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      grid: 'third',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
    },
    {
      name: 'profession',
      label: 'Profession',
      type: 'select',
      grid: 'half',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All' },
        { value: 'student', label: 'Student' },
        { value: 'professional', label: 'Professional' },
        { value: 'homemaker', label: 'Homemaker' },
        { value: 'business', label: 'Business Owner' },
      ],
    },
    {
      name: 'deviceType',
      label: 'Device Type',
      type: 'select',
      grid: 'half',
      defaultValue: 'all',
      options: [
        { value: 'all', label: 'All Devices' },
        { value: 'android', label: 'Android' },
        { value: 'ios', label: 'iOS' },
      ],
    },
    {
      name: 'minQualityScore',
      label: 'Min User Quality Score',
      type: 'number',
      placeholder: '50',
      grid: 'half',
      validation: {
        min: { value: 0, message: 'Minimum 0' },
        max: { value: 100, message: 'Maximum 100' },
      },
    },
    {
      name: 'allowedRiskLevel',
      label: 'Allowed Risk Level',
      type: 'select',
      grid: 'half',
      defaultValue: 'low_medium',
      options: [
        { value: 'low', label: 'Low Only' },
        { value: 'low_medium', label: 'Low + Medium' },
      ],
    },
  ],
};

export const targetingCitiesConfig = {
  name: 'targetCities',
  label: 'Target Cities',
  type: 'checkbox',
  grid: 'full',
  cities: [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
  ],
};

export const rewardsFields = {
  id: 'rewards',
  title: 'Reward Configuration',
  fields: [
    {
      name: 'rewardType',
      label: 'Reward Type',
      type: 'select',
      grid: 'half',
      defaultValue: 'cash',
      validation: { required: 'Reward type is required' },
      options: [
        { value: 'cash', label: 'Cash' },
        { value: 'coupon', label: 'Coupon' },
        { value: 'points', label: 'Points' },
      ],
    },
    {
      name: 'rewardValue',
      label: 'Reward Value (₹)',
      type: 'number',
      placeholder: '5',
      grid: 'half',
      validation: {
        required: 'Reward value is required',
        min: { value: 0, message: 'Must be 0 or greater' },
      },
    },
    {
      name: 'maxDailyRewardCap',
      label: 'Max Daily Reward Cap (₹)',
      type: 'number',
      placeholder: '10000',
      grid: 'half',
      validation: {
        required: 'Max daily cap is required',
        min: { value: 0, message: 'Must be 0 or greater' },
      },
    },
    {
      name: 'totalBudget',
      label: 'Max Total Budget (₹)',
      type: 'number',
      placeholder: '50000',
      grid: 'half',
      validation: {
        required: 'Total budget is required',
        min: { value: 0, message: 'Must be 0 or greater' },
      },
    },
    {
      name: 'rewardApprovalMode',
      label: 'Reward Approval Mode',
      type: 'select',
      grid: 'half',
      defaultValue: 'auto',
      validation: { required: 'Approval mode is required' },
      options: [
        { value: 'auto', label: 'Auto' },
        { value: 'manual', label: 'Manual' },
      ],
    },
    {
      name: 'walletLockPeriod',
      label: 'Wallet Lock Period (hours)',
      type: 'number',
      placeholder: '48',
      grid: 'half',
      validation: {
        min: { value: 0, message: 'Must be 0 or greater' },
      },
    },
    {
      name: 'redemptionWindow',
      label: 'Redemption Window (days)',
      type: 'number',
      placeholder: '30',
      grid: 'half',
      validation: {
        min: { value: 1, message: 'Minimum 1 day' },
      },
    },
  ],
};

export const fraudControlsFields = {
  id: 'fraud-controls',
  title: 'Fraud Protection Controls',
  fields: [
    {
      name: 'engagementVelocityLimit',
      label: 'Engagement Velocity Limit (per min)',
      type: 'number',
      placeholder: '5',
      grid: 'half',
      validation: {
        min: { value: 1, message: 'Minimum 1' },
      },
    },
    {
      name: 'rapidCompletionThreshold',
      label: 'Rapid Completion Threshold (seconds)',
      type: 'number',
      placeholder: '15',
      grid: 'half',
      validation: {
        min: { value: 1, message: 'Minimum 1 second' },
      },
    },
    {
      name: 'deviceUniquenessEnforcement',
      label: 'Device Uniqueness Enforcement',
      type: 'switch',
      grid: 'full',
      defaultValue: true,
    },
    {
      name: 'geoVerificationRequired',
      label: 'Geo Verification Required',
      type: 'switch',
      grid: 'full',
      defaultValue: true,
    },
    {
      name: 'duplicateAccountDetection',
      label: 'Duplicate Account Detection',
      type: 'switch',
      grid: 'full',
      defaultValue: true,
    },
  ],
};

export const autoFlagRulesConfig = {
  name: 'autoFlagRules',
  label: 'Auto-Flag Rules',
  type: 'textarea',
  placeholder:
    'Define auto-flag conditions... e.g., Flag if completion time < 10s AND risk score > 70',
};

export const formTabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'targeting', label: 'Targeting' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'fraud', label: 'Fraud Controls' },
];


// Survey Configuration
export const surveyFields = {
  id: 'survey',
  title: 'Survey Configuration',
  fields: [
    {
      name: 'surveyIntro',
      label: 'Survey Intro Text',
      type: 'textarea',
      placeholder: 'Welcome message before starting survey',
      grid: 'full',
      validation: {
        required: 'Survey intro is required',
      },
    },
    {
      name: 'surveyQuestions',
      label: 'Survey Questions (JSON)',
      type: 'textarea',
      placeholder:
        '[{ "question": "How do you rate this brand?", "type": "rating" }]',
      grid: 'full',
      validation: {
        required: 'At least one survey question is required',
      },
    },
    {
      name: 'allowSkipQuestions',
      label: 'Allow Skip Questions',
      type: 'switch',
      grid: 'half',
      defaultValue: false,
    },
    {
      name: 'mandatoryCompletion',
      label: 'Mandatory Completion',
      type: 'switch',
      grid: 'half',
      defaultValue: true,
    },
  ],
};

// Quiz Configuration
export const quizFields = {
  id: 'quiz',
  title: 'Quiz Configuration',
  fields: [
    {
      name: 'quizIntro',
      label: 'Quiz Intro Text',
      type: 'textarea',
      placeholder: 'Intro before quiz starts',
      grid: 'full',
      validation: {
        required: 'Quiz intro is required',
      },
    },
    {
      name: 'quizQuestions',
      label: 'Quiz Questions (JSON)',
      type: 'textarea',
      placeholder:
        '[{ "question": "What is the brand slogan?", "options": ["A","B","C"], "correctAnswer": "A" }]',
      grid: 'full',
      validation: {
        required: 'Quiz questions are required',
      },
    },
    {
      name: 'passingScore',
      label: 'Passing Score (%)',
      type: 'number',
      placeholder: '70',
      grid: 'half',
      validation: {
        min: { value: 0, message: 'Min 0%' },
        max: { value: 100, message: 'Max 100%' },
      },
    },
    {
      name: 'showCorrectAnswers',
      label: 'Show Correct Answers After Completion',
      type: 'switch',
      grid: 'half',
      defaultValue: true,
    },
  ],
};

export const surveyConfig = {
  id: "survey-config",
  title: "Survey Configuration",
  fields: [
    {
      name: "surveyQuestions",
      label: "Survey Questions",
      type: "survey-builder",
      grid: "full",
    },
  ],
};

export const quizConfig = {
  id: "quiz-config",
  title: "Quiz Configuration",
  fields: [
    {
      name: "quizQuestions",
      label: "Quiz Questions",
      type: "quiz-builder",
      grid: "full",
    },
  ],
};

export const formSections = {
  basic: [basicInfoFields],
  engagement: [engagementFields, surveyConfig, quizConfig], // 👈 added
  targeting: [targetingFields],
  rewards: [rewardsFields],
  fraud: [fraudControlsFields],
};