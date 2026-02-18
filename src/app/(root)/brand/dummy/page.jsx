"use client";
import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Gift, Target, MapPin, BarChart3, ChevronRight, ChevronLeft, X, Plus, Video, Eye, UploadCloud, Trash2 } from 'lucide-react';

const Input = ({ label, helperText, ...props }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>}
        <input {...props} className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${props.className || ''}`} />
        {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
    </div>
);

const Select = ({ label, options, ...props }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>}
        <select {...props} className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${props.className || ''}`}>
            {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const Button = ({ variant = 'primary', children, icon: Icon, iconPosition = 'right', ...props }) => {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        ghost: 'text-gray-700 hover:text-gray-900',
        success: 'bg-green-600 text-white hover:bg-green-700'
    };

    return (
        <button {...props} className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${props.className || ''}`}>
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </button>
    );
};

const ToggleGroup = ({ label, options, value = [], onChange }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-900 mb-3">{label}</label>}
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                        const newValue = value.includes(opt.value) ? value.filter((v) => v !== opt.value) : [...value, opt.value];
                        onChange(newValue);
                    }}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${value.includes(opt.value) ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

const Card = ({ title, children, variant = 'default' }) => {
    const variants = {
        default: 'bg-white border-gray-200',
        blue: 'bg-blue-50 border-blue-200',
        green: 'bg-black border-black',
        gray: 'bg-gray-50 border-gray-200'
    };

    return (
        <div className={`rounded-lg border p-6 max-w-4xl mx-auto ${variants[variant]}`}>
            {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
            {children}
        </div>
    );
};

const MetricCard = ({ label, value }) => (
    <div className='text-center'>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-white mb-1">{label}</p>
    </div>
);

export default function CampaignFlow() {
    const [currentStep, setCurrentStep] = useState(0);
    const [tiers, setTiers] = useState([
        { reward: '', probability: '' },
        { reward: '', probability: '' },
    ]);

    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            campaignName: '',
            objective: '',
            totalBudget: '',
            cpve: '',
            startDate: '',
            endDate: '',
            ageGroups: [],
            gender: [],
            profession: [],
            deviceType: [],
            interestKeywords: '',
            locations: [],
            distributionStrategy: 'equal',
            surveys: [
                {
                    question: '',
                    options: [{ text: '' }, { text: '' }]
                }
            ],
            quizzes: [{ question: '', correctAnswer: '' }],
        }
    });

    const { fields: surveys, append: addSurvey, remove: removeSurvey } = useFieldArray({
        control,
        name: "surveys",
    });

    const { fields: surveyOptions, append: appendOption, remove: removeOption } = useFieldArray({
        control,
        name: `surveys.0.options`,
    });

    const { fields: quizzes, append: addQuiz, remove: removeQuiz } = useFieldArray({
        control,
        name: "quizzes",
    });

    const formValues = watch();

    const steps = [
        { id: 'economics', label: 'Economics', icon: '₹' },
        { id: 'reward', label: 'Reward Engine', icon: Gift },
        { id: 'media', label: 'Media', icon: Video },
        { id: 'targeting', label: 'Targeting', icon: Target },
        { id: 'locations', label: 'Locations', icon: MapPin },
        { id: 'distribution', label: 'Distribution', icon: BarChart3 },
        { id: 'preview', label: 'Preview', icon: Eye },
    ];

    const locations = [
        { name: 'Phoenix Marketcity', city: 'Mumbai', type: 'mall', provider: 'MallConnect Pvt Ltd', reach: '12,000', engagement: '4.2%', cap: '8' },
        { name: 'IIT Bombay Campus', city: 'Mumbai', type: 'campus', provider: 'CampusReach Inc', reach: '8,000', engagement: '7.8%', cap: '6' },
        { name: 'Koramangala Third Wave', city: 'Bangalore', type: 'cafe', provider: 'CafeAds Solutions', reach: '1,500', engagement: '6.1%', cap: '4' },
        { name: 'Cult.fit HSR Layout', city: 'Bangalore', type: 'gym', provider: 'FitMedia', reach: '2,000', engagement: '9.3%', cap: '5' }
    ];

    const calculateMetrics = () => {
        const budget = parseInt(formValues.totalBudget) || 0;
        const cpve = parseInt(formValues.cpve) || 1;
        const startDate = formValues.startDate ? new Date(formValues.startDate) : new Date();
        const endDate = formValues.endDate ? new Date(formValues.endDate) : new Date();
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const engagementTarget = Math.floor(budget / cpve);
        const dailyTarget = days > 0 ? Math.floor(engagementTarget / days) : 0;
        return { engagementTarget, days, dailyTarget };
    };

    const calculateRewardMetrics = () => {
        let expectedValue = 0;
        let totalProbability = 0;
        tiers.forEach((tier) => {
            const reward = parseFloat(tier.reward) || 0;
            const probability = parseFloat(tier.probability) || 0;
            expectedValue += (reward * probability) / 100;
            totalProbability += probability;
        });
        return { expectedValue: expectedValue.toFixed(2), totalProbability };
    };

    const metrics = calculateMetrics();
    const { expectedValue, totalProbability } = calculateRewardMetrics();

    const onSubmit = (data) => {
        console.log('Campaign Data:', { ...data, tiers });
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Controller name="campaignName" control={control} render={({ field }) => <Input {...field} label="Campaign Name" placeholder="Enter campaign name" />} />
                            <Controller
                                name="objective"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Objective"
                                        options={[
                                            { value: '', label: 'Select objective' },
                                            { value: 'Engagement', label: 'Engagement' },
                                            { value: 'Reach', label: 'Reach' },
                                            { value: 'Conversion', label: 'Conversion' }
                                        ]}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <Controller name="totalBudget" control={control} render={({ field }) => <Input {...field} type="number" label="Total Budget (₹)" placeholder="Enter total budget" helperText="Remaining brand budget: ₹188,000" />} />
                            <Controller name="cpve" control={control} render={({ field }) => <Input {...field} type="number" label="CPVE (₹)" placeholder="Cost per view/engagement" />} />
                            <Controller name="startDate" control={control} render={({ field }) => <Input {...field} type="date" label="Start Date" />} />
                            <Controller name="endDate" control={control} render={({ field }) => <Input {...field} type="date" label="End Date" />} />
                        </div>
                        <Card variant="green">
                            <div className="grid grid-cols-3 gap-4">
                                <MetricCard label="Engagement Target" value={metrics.engagementTarget} />
                                <MetricCard label="Campaign Days" value={metrics.days} />
                                <MetricCard label="Daily Target" value={metrics.dailyTarget} />
                            </div>
                        </Card>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reward Tiers</h3>
                            <p className="text-sm text-gray-600 mb-4">Total probability must equal 100%. Expected value must be less than CPVE (₹{formValues.cpve}).</p>
                            <div className="space-y-3">
                                {tiers.map((tier, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <input type="number" value={tier.reward} onChange={(e) => { const newTiers = [...tiers]; newTiers[index].reward = e.target.value; setTiers(newTiers); }} placeholder="Reward amount" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                        <span className="text-gray-500">₹</span>
                                        <span className="text-gray-400">→</span>
                                        <input type="number" value={tier.probability} onChange={(e) => { const newTiers = [...tiers]; newTiers[index].probability = e.target.value; setTiers(newTiers); }} placeholder="Probability %" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                        <span className="text-gray-500">%</span>
                                        {tiers.length > 1 && (
                                            <button type="button" onClick={() => setTiers(tiers.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="ghost" icon={Plus} iconPosition="left" onClick={() => setTiers([...tiers, { reward: '', probability: '' }])} className="mt-3">
                                Add Tier
                            </Button>
                        </div>
                        <Card variant="green">
                            <div className="grid grid-cols-3 gap-6">
                                <div className='text-center'>
                                    <p className="text-sm text-white mb-1">Expected Reward Value</p>
                                    <p className="text-2xl font-bold text-white">₹{expectedValue}</p>
                                </div>
                                <div className='text-center'>
                                    <p className="text-sm text-white mb-1">Total Probability</p>
                                    <p className={`text-2xl font-bold ${totalProbability === 100 ? 'text-green-400' : 'text-red-400'}`}>{totalProbability}%</p>
                                </div>
                                <div className='text-center'>
                                    <p className="text-sm text-white mb-1">Margin</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${parseFloat(expectedValue) < parseFloat(formValues.cpve || 0) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {parseFloat(expectedValue) < parseFloat(formValues.cpve || 0) ? 'Healthy' : 'Unhealthy'}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-8">
                        <Card title="Advertisement Videos">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                                <UploadCloud className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                                <p className="text-sm text-gray-600">Drag & drop videos here or click to upload</p>
                                <input type="file" accept="video/*" multiple className="hidden" id="videoUpload" />
                                <label htmlFor="videoUpload" className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                                    Upload Videos
                                </label>
                            </div>
                        </Card>

                        <Card title="Surveys">
                            <div className="space-y-6">
                                {surveys.map((survey, surveyIndex) => (
                                    <div key={survey.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                                        <Controller
                                            name={`surveys.${surveyIndex}.question`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} label={`Survey Question ${surveyIndex + 1}`} placeholder="Enter your question" />
                                            )}
                                        />

                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-900">Options</label>
                                            <Controller
                                                name={`surveys.${surveyIndex}.options`}
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        {field.value?.map((opt, optIndex) => (
                                                            <div key={optIndex} className="flex items-center gap-3">
                                                                <input
                                                                    value={opt.text}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...field.value];
                                                                        newOptions[optIndex].text = e.target.value;
                                                                        field.onChange(newOptions);
                                                                    }}
                                                                    placeholder={`Option ${optIndex + 1}`}
                                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                />
                                                                {field.value.length > 2 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newOptions = field.value.filter((_, i) => i !== optIndex);
                                                                            field.onChange(newOptions);
                                                                        }}
                                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            icon={Plus}
                                                            iconPosition="left"
                                                            onClick={() => field.onChange([...field.value, { text: '' }])}
                                                        >
                                                            Add Option
                                                        </Button>
                                                    </>
                                                )}
                                            />
                                        </div>

                                        {surveys.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSurvey(surveyIndex)}
                                                className="text-red-600 flex items-center gap-2 text-sm"
                                            >
                                                <Trash2 size={16} /> Remove Survey
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    icon={Plus}
                                    iconPosition="left"
                                    onClick={() => addSurvey({ question: "", options: [{ text: "" }, { text: "" }] })}
                                >
                                    Add Survey
                                </Button>
                            </div>
                        </Card>

                        <Card title="Quizzes">
                            <div className="space-y-6">
                                {quizzes.map((quiz, index) => (
                                    <div key={quiz.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                                        <Controller
                                            name={`quizzes.${index}.question`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} label={`Quiz Question ${index + 1}`} placeholder="Enter quiz question" />
                                            )}
                                        />

                                        <Controller
                                            name={`quizzes.${index}.correctAnswer`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    label="Correct Answer"
                                                    options={[
                                                        { value: "", label: "Select answer" },
                                                        { value: "yes", label: "Yes" },
                                                        { value: "no", label: "No" },
                                                    ]}
                                                />
                                            )}
                                        />

                                        {quizzes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuiz(index)}
                                                className="text-red-600 flex items-center gap-2 text-sm"
                                            >
                                                <Trash2 size={16} /> Remove Quiz
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    icon={Plus}
                                    iconPosition="left"
                                    onClick={() => addQuiz({ question: "", correctAnswer: "" })}
                                >
                                    Add Quiz
                                </Button>
                            </div>
                        </Card>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <Controller name="ageGroups" control={control} render={({ field }) => <ToggleGroup label="Age Band" options={[{ value: '18-24', label: '18-24' }, { value: '25-34', label: '25-34' }, { value: '35-44', label: '35-44' }, { value: '45+', label: '45+' }]} value={field.value} onChange={field.onChange} />} />
                        <Controller name="gender" control={control} render={({ field }) => <ToggleGroup label="Gender" options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} value={field.value} onChange={field.onChange} />} />
                        <Controller name="profession" control={control} render={({ field }) => <ToggleGroup label="Profession" options={[{ value: 'Student', label: 'Student' }, { value: 'Professional', label: 'Professional' }, { value: 'Homemaker', label: 'Homemaker' }, { value: 'Freelancer', label: 'Freelancer' }]} value={field.value} onChange={field.onChange} />} />
                        <Controller name="deviceType" control={control} render={({ field }) => <ToggleGroup label="Device Type" options={[{ value: 'Android', label: 'Android' }, { value: 'iOS', label: 'iOS' }]} value={field.value} onChange={field.onChange} />} />
                        <Controller name="interestKeywords" control={control} render={({ field }) => <Input {...field} label="Interest Keywords" placeholder="e.g. food, fitness, fashion" helperText="Leave empty to target all users. Overlapping campaign warnings apply when same brand targets same audience." />} />
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="flex gap-3">
                            <Select options={[{ value: '', label: 'All Cities' }, { value: 'Mumbai', label: 'Mumbai' }, { value: 'Bangalore', label: 'Bangalore' }]} className="flex-1" />
                            <Select options={[{ value: '', label: 'All Types' }, { value: 'Mall', label: 'Mall' }, { value: 'Campus', label: 'Campus' }, { value: 'Cafe', label: 'Cafe' }]} className="flex-1" />
                            <Controller name="locations" control={control} render={({ field }) => <div className="ml-auto text-sm text-gray-600 py-2 px-4">{(field.value || []).length} selected</div>} />
                        </div>
                        <Controller
                            name="locations"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-3">
                                    {locations.map((location, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input type="checkbox" checked={(field.value || []).includes(location.name)} onChange={(e) => { const current = field.value || []; field.onChange(e.target.checked ? [...current, location.name] : current.filter((l) => l !== location.name)); }} className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{location.name}</h4>
                                                            <p className="text-sm text-gray-600">{location.city} · {location.type} · {location.provider}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold text-gray-900">{location.reach} reach</p>
                                                            <p className="text-xs text-gray-600">{location.engagement} eng · Cap {location.cap}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution Strategy</h3>
                            <Controller
                                name="distributionStrategy"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button type="button" onClick={() => field.onChange('equal')} className={`p-6 rounded-lg border-2 transition-all text-left ${field.value === 'equal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <h4 className="font-semibold text-gray-900 mb-1">Equal Distribution</h4>
                                            <p className="text-sm text-gray-600">Even split across all locations</p>
                                        </button>
                                        <button type="button" onClick={() => field.onChange('weighted')} className={`p-6 rounded-lg border-2 transition-all text-left ${field.value === 'weighted' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <h4 className="font-semibold text-gray-900 mb-1">Weighted Distribution</h4>
                                            <p className="text-sm text-gray-600">Weighted by footfall × engagement rate</p>
                                        </button>
                                    </div>
                                )}
                            />
                        </div>
                        <Card variant="gray" title="Allocation Preview">
                            <div className="space-y-3">
                                {(formValues.locations || []).length > 0 ? (
                                    (formValues.locations || []).map((locationName, index) => {
                                        const allocationsPerDay = Math.floor(metrics.dailyTarget / (formValues.locations || []).length);
                                        return (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">{locationName}</span>
                                                <div className="flex items-center gap-3 flex-1 ml-4">
                                                    <div className="flex-1 bg-blue-200 rounded-full h-2">
                                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }} />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 min-w-[60px] text-right">{allocationsPerDay}/day</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">No locations selected</p>
                                )}
                            </div>
                        </Card>
                    </div>
                );

            case 6:
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Review</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-blue-600 font-semibold mb-3">Campaign Economics</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-600">Name</span><span className="font-medium text-gray-900">{formValues.campaignName || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Objective</span><span className="font-medium text-gray-900">{formValues.objective || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Budget</span><span className="font-medium text-gray-900">{formValues.totalBudget ? `₹${formValues.totalBudget}` : 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">CPVE</span><span className="font-medium text-gray-900">{formValues.cpve ? `₹${formValues.cpve}` : 'N/A'}</span></div>
                                    <div className="flex justify-between col-span-2"><span className="text-gray-600">Period</span><span className="font-medium text-gray-900">{formValues.startDate && formValues.endDate ? `${formValues.startDate} → ${formValues.endDate} (${metrics.days}d)` : 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Engagement Target</span><span className="font-medium text-gray-900">{metrics.engagementTarget}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Daily Target</span><span className="font-medium text-gray-900">{metrics.dailyTarget}</span></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-blue-600 font-semibold mb-3">Reward Engine</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-600">Expected Value</span><span className="font-medium text-gray-900">₹{expectedValue}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Tiers</span><span className="font-medium text-gray-900">{tiers.length}</span></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-blue-600 font-semibold mb-3">Media</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-600">Surveys</span><span className="font-medium text-gray-900">{formValues.surveys?.length || 0}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Quizzes</span><span className="font-medium text-gray-900">{formValues.quizzes?.length || 0}</span></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-blue-600 font-semibold mb-3">Targeting</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-600">Age</span><span className="font-medium text-gray-900">{formValues.ageGroups?.length > 0 ? formValues.ageGroups.join(', ') : 'All'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Gender</span><span className="font-medium text-gray-900">{formValues.gender?.length > 0 ? formValues.gender.join(', ') : 'All'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Device</span><span className="font-medium text-gray-900">{formValues.deviceType?.length > 0 ? formValues.deviceType.join(', ') : 'All'}</span></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-blue-600 font-semibold mb-3">Locations & Distribution</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-600">Locations</span><span className="font-medium text-gray-900">{formValues.locations?.length || 0}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600">Strategy</span><span className="font-medium text-gray-900">{formValues.distributionStrategy === 'equal' ? 'Equal' : 'Weighted'}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto p-6">
                <div className="border-b border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = index < currentStep;
                            const isCurrent = index === currentStep;
                            return (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${isCompleted ? 'bg-black text-white' : isCurrent ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            {typeof Icon === 'string' ? <span className="text-lg font-bold">{Icon}</span> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <span className={`text-xs font-medium ${isCurrent ? 'text-black' : isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>{step.label}</span>
                                    </div>
                                    {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-6 ${isCompleted ? 'bg-black' : 'bg-gray-200'}`} />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    {renderStep()}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <Button type="button" variant="ghost" icon={ChevronLeft} iconPosition="left" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
                            {currentStep === 0 ? 'Cancel' : 'Back'}
                        </Button>
                        {currentStep < steps.length - 1 ? (
                            <Button type="button" variant="primary" icon={ChevronRight} iconPosition="right" onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}>
                                Next
                            </Button>
                        ) : (
                            <Button type="submit" variant="success">🚀 Deploy Campaign</Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}