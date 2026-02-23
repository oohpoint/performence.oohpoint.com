'use client'

import { useState, useMemo, useEffect, useRef } from "react";
import { useForm, useFormContext, useFieldArray, useWatch, Controller, FormProvider } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    IndianRupee, Gift, Users, MapPin, Rocket,
    ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2,
    Info, Eye, ArrowUpDown, Film, X, Plus, Trash2, HelpCircle,
    ListChecks, FileVideo, PlayCircle, ClipboardList,
    ToggleLeft, ToggleRight, Loader2,
} from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PLATFORM_FLOOR_CPVE = 5;
const MIN_BUDGET = 10000;
const MAX_VIDEO_SIZE_MB = 500;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
const TIER_NAMES = ["Diamond", "Platinum", "Gold", "Silver", "Bronze"];
const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th"];

const STEPS = [
    { label: "Economics", icon: IndianRupee },
    { label: "Media", icon: Film },
    { label: "Rewards", icon: Gift },
    { label: "Targeting", icon: Users },
    { label: "Locations", icon: MapPin },
    { label: "Review", icon: Rocket },
];

const DEFAULT_SURVEY_QUESTION = () => ({
    id: crypto.randomUUID(),
    question: "",
    answers: [
        { id: crypto.randomUUID(), text: "", isCorrect: false },
        { id: crypto.randomUUID(), text: "", isCorrect: false },
    ],
});

const DEFAULT_VALUES = {
    name: "",
    objective: "Brand Awareness",
    budget: "",
    cpve: 15,
    startDate: "",
    endDate: "",
    videoFile: null,
    videoName: "",
    videoSize: 0,
    videoPreviewUrl: "",
    surveyEnabled: false,
    surveyQuestions: [DEFAULT_SURVEY_QUESTION()],
    rewardTiers: [
        { probability: 60, amount: 5 },
        { probability: 30, amount: 10 },
        { probability: 10, amount: 20 },
    ],
    rewardMaxPerEngagement: 25,
    rewardDailyUserCap: 50,
    targetAge: [],
    targetGender: [],
    targetProfession: [],
    targetDevice: [],
    targetInterests: "",
    selectedLocations: [],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const safeNum = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
};

function calcDerivedMetrics(budget, cpve, startDate, endDate) {
    const numBudget = safeNum(budget);
    const numCpve = safeNum(cpve);
    const engagementTarget = numCpve > 0 ? Math.floor(numBudget / numCpve) : 0;
    const campaignDays =
        startDate && endDate
            ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000))
            : 0;
    const dailyTarget = campaignDays > 0 ? Math.round(engagementTarget / campaignDays) : 0;
    return { engagementTarget, campaignDays, dailyTarget };
}

function getQuestionMode(answers) {
    if (!answers?.length) return "undetermined";
    const correctCount = answers.filter((a) => a.isCorrect).length;
    if (correctCount === 0) return "undetermined";
    if (correctCount === answers.length) return "survey";
    return "quiz";
}

function getMediaStepType(surveyQuestions) {
    if (!surveyQuestions?.length) return null;
    const modes = surveyQuestions.map((q) => getQuestionMode(q.answers));
    if (modes.every((m) => m === "survey")) return "survey";
    if (modes.some((m) => m === "quiz")) return "quiz";
    if (modes.some((m) => m === "survey")) return "mixed";
    return null;
}

function buildSubmitPayload(values) {
    const { engagementTarget, campaignDays, dailyTarget } = calcDerivedMetrics(
        values.budget, values.cpve, values.startDate, values.endDate
    );
    const ev = values.rewardTiers.reduce(
        (s, t) => s + (safeNum(t.probability) / 100) * safeNum(t.amount), 0
    );
    const campaignType = values.surveyEnabled ? getMediaStepType(values.surveyQuestions) : null;

    return {
        status: "draft",
        name: values.name.trim(),
        objective: values.objective,
        budget: safeNum(values.budget),
        cpve: safeNum(values.cpve),
        startDate: values.startDate,
        endDate: values.endDate,
        engagementTarget,
        dailyTarget,
        media: {
            videoUrl: null, // Will be populated after upload
            surveyEnabled: values.surveyEnabled,
            campaignType,
            questions: values.surveyEnabled
                ? values.surveyQuestions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    mode: getQuestionMode(q.answers),
                    answers: q.answers.map((a) => ({ id: a.id, text: a.text, isCorrect: a.isCorrect })),
                }))
                : [],
        },
        rewardEngine: {
            tiers: values.rewardTiers.map((t) => ({
                probability: safeNum(t.probability),
                amount: safeNum(t.amount),
            })),
            expectedValue: parseFloat(ev.toFixed(2)),
            maxPerEngagement: safeNum(values.rewardMaxPerEngagement),
            dailyUserCap: safeNum(values.rewardDailyUserCap),
        },
        targeting: {
            age: values.targetAge,
            gender: values.targetGender,
            profession: values.targetProfession,
            device: values.targetDevice,
            interests: values.targetInterests
                ? values.targetInterests.split(",").map((s) => s.trim()).filter(Boolean)
                : [],
        },
        locationIds: values.selectedLocations,
    };
}

function canProceed(step, values, errors) {
    switch (step) {
        case 0: {
            const budget = safeNum(values.budget);
            const cpve = safeNum(values.cpve);
            return (
                values.name.trim().length > 0 &&
                budget >= MIN_BUDGET &&
                cpve >= PLATFORM_FLOOR_CPVE &&
                !!values.startDate &&
                !!values.endDate &&
                new Date(values.endDate) > new Date(values.startDate) &&
                !errors.budget && !errors.cpve && !errors.name
            );
        }
        case 1: {
            if (!values.surveyEnabled) return true;
            return values.surveyQuestions.every(
                (q) =>
                    q.question.trim().length > 0 &&
                    q.answers.length >= 2 &&
                    q.answers.every((a) => a.text.trim().length > 0) &&
                    q.answers.some((a) => a.isCorrect)
            );
        }
        case 2: {
            const totalProb = values.rewardTiers.reduce((s, t) => s + safeNum(t.probability), 0);
            const ev = values.rewardTiers.reduce(
                (s, t) => s + (safeNum(t.probability) / 100) * safeNum(t.amount), 0
            );
            return totalProb === 100 && ev < safeNum(values.cpve);
        }
        case 3: return true;
        case 4: return values.selectedLocations.length > 0;
        default: return false;
    }
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function FieldHint({ tip }) {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-muted hover:bg-primary/10 transition-colors ml-1.5 shrink-0"
                    >
                        <Eye className="h-2.5 w-2.5 text-muted-foreground" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-50 text-xs leading-relaxed">
                    {tip}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function FieldError({ show, message, fix }) {
    if (!show) return null;
    return (
        <div className="flex items-start gap-1.5 mt-1.5 rounded-md bg-red-50 border border-red-200 px-2.5 py-1.5">
            <AlertTriangle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
            <div>
                <p className="text-[11px] font-medium text-red-600">{message}</p>
                {fix && <p className="text-[10px] text-red-400">Fix: <span className="font-semibold text-red-500">{fix}</span></p>}
            </div>
        </div>
    );
}

function LabelHint({ children, tip }) {
    return (
        <div className="flex items-center mb-1">
            <Label className="text-sm">{children}</Label>
            {tip && <FieldHint tip={tip} />}
        </div>
    );
}

function InfoNote({ children }) {
    return (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{children}</span>
        </div>
    );
}

function ReviewSection({ title, children }) {
    return (
        <div>
            <p className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">{title}</p>
            {children}
        </div>
    );
}

function ReviewRow({ label, value }) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm py-1">
            <span className="text-muted-foreground shrink-0">{label}</span>
            <span className="font-medium font-mono text-right break-all">{String(value)}</span>
        </div>
    );
}

function ChipGroup({ fieldName, label, options, tip }) {
    const { control } = useFormContext();
    return (
        <div>
            <LabelHint tip={tip}><span className="text-xs font-semibold">{label}</span></LabelHint>
            <Controller
                name={fieldName}
                control={control}
                render={({ field }) => (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {options.map((o) => (
                            <button
                                key={o}
                                type="button"
                                onClick={() => {
                                    const next = field.value.includes(o)
                                        ? field.value.filter((v) => v !== o)
                                        : [...field.value, o];
                                    field.onChange(next);
                                }}
                                className={cn(
                                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                                    field.value.includes(o)
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                                )}
                            >
                                {o}
                            </button>
                        ))}
                    </div>
                )}
            />
        </div>
    );
}

// ─── STEP 1: ECONOMICS ───────────────────────────────────────────────────────
function StepEconomics({ brandBudgetRemaining = 0 }) {
    const { register, control, watch, formState: { errors } } = useFormContext();
    const [budget, cpve, startDate, endDate] = watch(["budget", "cpve", "startDate", "endDate"]);
    const safeRemaining = safeNum(brandBudgetRemaining);
    const { engagementTarget, campaignDays, dailyTarget } = calcDerivedMetrics(budget, cpve, startDate, endDate);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Campaign Name — full width */}
                <div className="col-span-1 sm:col-span-2">
                    <LabelHint tip="Unique display name for this campaign.">Campaign Name</LabelHint>
                    <Input
                        {...register("name", { required: "Campaign name is required" })}
                        placeholder="e.g. Summer Promo 2026"
                        className={cn(errors.name && "border-red-400")}
                    />
                    <FieldError show={!!errors.name} message={errors.name?.message} fix="Enter a descriptive name" />
                </div>

                {/* Objective */}
                <div>
                    <LabelHint tip="Defines KPI tracking for this campaign.">Objective</LabelHint>
                    <Controller
                        name="objective"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {["Brand Awareness", "Engagement", "App Install", "Transaction", "Lead Gen"].map((o) => (
                                        <SelectItem key={o} value={o}>{o}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Budget */}
                <div>
                    <LabelHint tip="Must not exceed remaining brand budget.">Total Budget (₹)</LabelHint>
                    <Input
                        type="number"
                        {...register("budget", {
                            required: "Budget is required",
                            min: { value: MIN_BUDGET, message: `Minimum ₹${MIN_BUDGET.toLocaleString()}` },
                            max: { value: safeRemaining || undefined, message: `Max ₹${safeRemaining.toLocaleString()}` },
                        })}
                        placeholder="Min ₹10,000"
                        className={cn("font-mono", errors.budget && "border-red-400")}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Brand remaining: ₹{safeRemaining.toLocaleString()}
                    </p>
                    <FieldError show={!!errors.budget} message={errors.budget?.message} />
                </div>

                {/* CPVE */}
                <div>
                    <LabelHint tip={`Cost Per Verified Engagement. Platform floor ₹${PLATFORM_FLOOR_CPVE}.`}>CPVE (₹)</LabelHint>
                    <Input
                        type="number"
                        {...register("cpve", {
                            required: "CPVE is required",
                            min: { value: PLATFORM_FLOOR_CPVE, message: `Min ₹${PLATFORM_FLOOR_CPVE}` },
                        })}
                        placeholder={`Min ₹${PLATFORM_FLOOR_CPVE}`}
                        className={cn("font-mono", errors.cpve && "border-red-400")}
                    />
                    <FieldError show={!!errors.cpve} message={errors.cpve?.message} />
                </div>

                {/* Start Date */}
                <div>
                    <LabelHint tip="Campaign activation date.">Start Date</LabelHint>
                    <Input
                        type="date"
                        {...register("startDate", { required: "Start date is required" })}
                        className={cn(errors.startDate && "border-red-400")}
                    />
                    <FieldError show={!!errors.startDate} message={errors.startDate?.message} />
                </div>

                {/* End Date */}
                <div>
                    <LabelHint tip="Campaign end date. Must be after start date.">End Date</LabelHint>
                    <Input
                        type="date"
                        {...register("endDate", {
                            required: "End date is required",
                            validate: (v) =>
                                !startDate || new Date(v) > new Date(startDate) || "End date must be after start date",
                        })}
                        className={cn(errors.endDate && "border-red-400")}
                    />
                    <FieldError show={!!errors.endDate} message={errors.endDate?.message} />
                </div>
            </div>

            {/* Live derived metrics */}
            {engagementTarget > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                        { label: "Engagement Target", value: engagementTarget.toLocaleString() },
                        { label: "Campaign Days", value: campaignDays },
                        { label: "Daily Target", value: dailyTarget.toLocaleString() },
                    ].map(({ label, value }) => (
                        <div key={label} className="rounded-lg bg-muted/50 border border-border px-3 py-2 text-center">
                            <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                            <p className="text-sm font-bold font-mono mt-0.5">{value}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── STEP 2: MEDIA ────────────────────────────────────────────────────────────
function QuestionModeIndicator({ answers }) {
    const mode = getQuestionMode(answers);
    if (mode === "undetermined") return null;
    const config = {
        survey: { label: "Survey", desc: "All answers correct — opinion-based", icon: ClipboardList, cls: "bg-blue-50 border-blue-200 text-blue-700", iconCls: "text-blue-500" },
        quiz: { label: "Quiz", desc: "Some answers correct — pick the right one", icon: HelpCircle, cls: "bg-amber-50 border-amber-200 text-amber-700", iconCls: "text-amber-500" },
    };
    const { label, desc, icon: Icon, cls, iconCls } = config[mode];
    return (
        <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium mt-2", cls)}>
            <Icon className={cn("h-3.5 w-3.5 shrink-0", iconCls)} />
            <span className="font-semibold">{label}</span>
            <span className="font-normal opacity-80 hidden sm:inline">— {desc}</span>
        </div>
    );
}

function SurveyQuestionEditor({ questionIndex, question, onChange, onRemove, canRemove }) {
    const handleQuestionText = (text) => onChange({ ...question, question: text });
    const handleAnswerText = (i, text) =>
        onChange({ ...question, answers: question.answers.map((a, idx) => idx === i ? { ...a, text } : a) });
    const handleAnswerCorrect = (i, checked) =>
        onChange({ ...question, answers: question.answers.map((a, idx) => idx === i ? { ...a, isCorrect: checked } : a) });
    const handleMarkAllCorrect = () => {
        const all = question.answers.every((a) => a.isCorrect);
        onChange({ ...question, answers: question.answers.map((a) => ({ ...a, isCorrect: !all })) });
    };
    const addAnswer = () => {
        if (question.answers.length >= 6) return;
        onChange({ ...question, answers: [...question.answers, { id: crypto.randomUUID(), text: "", isCorrect: false }] });
    };
    const removeAnswer = (i) => {
        if (question.answers.length <= 2) return;
        onChange({ ...question, answers: question.answers.filter((_, idx) => idx !== i) });
    };

    const mode = getQuestionMode(question.answers);
    const allCorrect = question.answers.length > 0 && question.answers.every((a) => a.isCorrect);

    return (
        <Card className={cn(
            "border transition-colors",
            mode === "quiz" && "border-amber-200",
            mode === "survey" && "border-blue-200",
        )}>
            <CardContent className="p-3 sm:p-4 space-y-3">
                <div className="flex items-start gap-2">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                        {questionIndex + 1}
                    </div>
                    <Input
                        value={question.question}
                        onChange={(e) => handleQuestionText(e.target.value)}
                        placeholder={`Question ${questionIndex + 1}`}
                        className="text-sm font-medium flex-1"
                    />
                    {canRemove && (
                        <Button type="button" variant="ghost" size="icon"
                            className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                            onClick={onRemove}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>

                <QuestionModeIndicator answers={question.answers} />

                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-[11px] text-muted-foreground">
                        <strong>All correct</strong> = Survey · <strong>Some correct</strong> = Quiz
                    </p>
                    <button type="button" onClick={handleMarkAllCorrect}
                        className={cn(
                            "text-[10px] font-medium px-2 py-0.5 rounded border transition-colors shrink-0",
                            allCorrect
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "text-muted-foreground border-border hover:border-blue-200 hover:text-blue-600"
                        )}>
                        {allCorrect ? "✓ All correct" : "Mark all correct"}
                    </button>
                </div>

                <div className="space-y-2">
                    {question.answers.map((answer, i) => (
                        <div key={answer.id} className="flex items-center gap-2 group">
                            <Checkbox
                                checked={answer.isCorrect}
                                onCheckedChange={(checked) => handleAnswerCorrect(i, !!checked)}
                                className={cn(
                                    "shrink-0",
                                    answer.isCorrect && mode === "quiz" && "border-amber-500 data-[state=checked]:bg-amber-500",
                                    answer.isCorrect && mode === "survey" && "border-blue-500 data-[state=checked]:bg-blue-500",
                                )}
                            />
                            <div className="relative flex-1">
                                <Input
                                    value={answer.text}
                                    onChange={(e) => handleAnswerText(i, e.target.value)}
                                    placeholder={`Answer ${i + 1}`}
                                    className={cn(
                                        "text-sm pr-8",
                                        answer.isCorrect && mode === "quiz" && "border-amber-200 bg-amber-50/50",
                                        answer.isCorrect && mode === "survey" && "border-blue-200 bg-blue-50/50",
                                    )}
                                />
                                {answer.isCorrect && (
                                    <CheckCircle2 className={cn(
                                        "absolute right-2.5 top-2.5 h-3.5 w-3.5",
                                        mode === "quiz" ? "text-amber-500" : "text-blue-500"
                                    )} />
                                )}
                            </div>
                            {question.answers.length > 2 && (
                                <Button type="button" variant="ghost" size="icon"
                                    className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 shrink-0 transition-all"
                                    onClick={() => removeAnswer(i)}>
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {question.answers.length < 6 && (
                    <Button type="button" variant="ghost" size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-primary w-full border border-dashed"
                        onClick={addAnswer}>
                        <Plus className="h-3 w-3 mr-1" /> Add Answer
                    </Button>
                )}

                {question.question.trim().length > 0 && !question.answers.some((a) => a.isCorrect) && (
                    <FieldError show message="Mark at least one answer as correct" fix="Check one answer option above" />
                )}
            </CardContent>
        </Card>
    );
}

function StepMedia() {
    const { watch, setValue, control } = useFormContext();
    const [surveyEnabled, videoName, videoSize, videoPreviewUrl, surveyQuestions] = watch([
        "surveyEnabled", "videoName", "videoSize", "videoPreviewUrl", "surveyQuestions"
    ]);
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [videoError, setVideoError] = useState("");
    const campaignType = surveyEnabled ? getMediaStepType(surveyQuestions) : null;

    const handleVideoFile = (file) => {
        setVideoError("");
        if (!file) return;
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            setVideoError("Invalid type. Supported: MP4, WebM, MOV, AVI");
            return;
        }
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > MAX_VIDEO_SIZE_MB) {
            setVideoError(`File too large (${sizeMB.toFixed(1)} MB). Max ${MAX_VIDEO_SIZE_MB} MB`);
            return;
        }
        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
        const url = URL.createObjectURL(file);
        setValue("videoFile", file, { shouldDirty: true });
        setValue("videoName", file.name);
        setValue("videoSize", sizeMB);
        setValue("videoPreviewUrl", url);
    };

    const removeVideo = () => {
        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
        setValue("videoFile", null);
        setValue("videoName", "");
        setValue("videoSize", 0);
        setValue("videoPreviewUrl", "");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const CAMPAIGN_TYPE_CONFIG = {
        survey: { label: "Survey Campaign", desc: "All answers correct — pure opinion gathering", cls: "bg-blue-50 border-blue-300 text-blue-800", icon: ClipboardList },
        quiz: { label: "Quiz Campaign", desc: "Specific correct answers — engagement with scoring", cls: "bg-amber-50 border-amber-300 text-amber-800", icon: HelpCircle },
        mixed: { label: "Mixed Campaign", desc: "Contains both survey and quiz questions", cls: "bg-purple-50 border-purple-300 text-purple-800", icon: ListChecks },
    };

    return (
        <div className="space-y-5">
            {/* Video Upload */}
            <div>
                <div className="flex items-center mb-1 gap-2">
                    <Label className="text-sm font-semibold">Campaign Video</Label>
                    <Badge variant="outline" className="text-[10px] font-normal">Optional</Badge>
                </div>

                {!videoName ? (
                    <div
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleVideoFile(e.dataTransfer.files?.[0]); }}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all py-8 px-4",
                            dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-primary/50"
                        )}
                    >
                        <div className={cn("flex items-center justify-center h-10 w-10 rounded-full", dragOver ? "bg-primary/15" : "bg-muted")}>
                            <FileVideo className={cn("h-5 w-5", dragOver ? "text-primary" : "text-muted-foreground")} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">{dragOver ? "Drop here" : "Drag & drop or click to browse"}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">MP4, WebM, MOV, AVI · Max {MAX_VIDEO_SIZE_MB} MB</p>
                        </div>
                        <input ref={fileInputRef} type="file" accept={ALLOWED_VIDEO_TYPES.join(",")} className="hidden"
                            onChange={(e) => handleVideoFile(e.target.files?.[0])} />
                    </div>
                ) : (
                    <div className="rounded-xl border overflow-hidden">
                        <div className="bg-black aspect-video">
                            <video src={videoPreviewUrl} controls className="w-full h-full object-contain" />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30">
                            <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{videoName}</p>
                                <p className="text-xs text-muted-foreground">{videoSize.toFixed(1)} MB</p>
                            </div>
                            <Button type="button" variant="ghost" size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs shrink-0"
                                onClick={removeVideo}>
                                <X className="h-3.5 w-3.5 mr-1" /> Remove
                            </Button>
                        </div>
                    </div>
                )}
                {videoError && <FieldError show message={videoError} />}
            </div>

            <Separator />

            {/* Survey / Quiz */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-semibold">Survey / Quiz</Label>
                        <Badge variant="outline" className="text-[10px] font-normal">Optional</Badge>
                    </div>
                    <Controller
                        name="surveyEnabled"
                        control={control}
                        render={({ field }) => (
                            <button type="button" onClick={() => field.onChange(!field.value)}
                                className={cn(
                                    "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                                    field.value
                                        ? "bg-green-500 text-white border-green-600"
                                        : "bg-muted text-muted-foreground border-border"
                                )}>
                                {field.value ? <><ToggleRight className="h-3.5 w-3.5" /> Enabled</> : <><ToggleLeft className="h-3.5 w-3.5" /> Disabled</>}
                            </button>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-2.5">
                        <ClipboardList className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-blue-700">Survey Mode</p>
                            <p className="text-[10px] text-blue-600 mt-0.5">Mark <strong>all</strong> answers correct.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                        <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-amber-700">Quiz Mode</p>
                            <p className="text-[10px] text-amber-600 mt-0.5">Mark <strong>some (not all)</strong> correct.</p>
                        </div>
                    </div>
                </div>

                {surveyEnabled && (
                    <div className="space-y-3">
                        {campaignType && CAMPAIGN_TYPE_CONFIG[campaignType] && (() => {
                            const cfg = CAMPAIGN_TYPE_CONFIG[campaignType];
                            const Icon = cfg.icon;
                            return (
                                <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold", cfg.cls)}>
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span>{cfg.label}</span>
                                    <span className="font-normal opacity-75 hidden sm:inline">— {cfg.desc}</span>
                                </div>
                            );
                        })()}

                        {surveyQuestions.map((q, idx) => (
                            <SurveyQuestionEditor
                                key={q.id}
                                questionIndex={idx}
                                question={q}
                                onChange={(u) => {
                                    const updated = surveyQuestions.map((sq, i) => i === idx ? u : sq);
                                    setValue("surveyQuestions", updated);
                                }}
                                onRemove={() => setValue("surveyQuestions", surveyQuestions.filter((_, i) => i !== idx))}
                                canRemove={surveyQuestions.length > 1}
                            />
                        ))}

                        <Button type="button" variant="outline" size="sm" className="w-full border-dashed text-xs"
                            onClick={() => setValue("surveyQuestions", [...surveyQuestions, DEFAULT_SURVEY_QUESTION()])}>
                            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Question
                        </Button>
                        <InfoNote>Each question is independently classified. Campaign type is determined by the most restrictive question.</InfoNote>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── STEP 3: REWARD ENGINE ────────────────────────────────────────────

const TIER_BADGE_CLS = [
    "bg-amber-100 text-amber-700",
    "bg-slate-100 text-slate-600",
    "bg-yellow-100 text-yellow-700",
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
];

function StepRewardEngine() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: "rewardTiers" });

    const rewardTiers = useWatch({ control, name: "rewardTiers" }) ?? [];
    const numCpve = safeNum(useWatch({ control, name: "cpve" }));
    const numBudget = safeNum(useWatch({ control, name: "budget" }));

    const engagementTarget = numCpve > 0 ? Math.floor(numBudget / numCpve) : 0;
    const hasBudget = engagementTarget > 0;

    const rowStats = rewardTiers.map((t) => {
        const prob = safeNum(t.probability);
        const amount = safeNum(t.amount);
        const winners = hasBudget ? Math.round(engagementTarget * (prob / 100)) : null;
        const cost = winners !== null ? winners * amount : null;
        return { prob, amount, winners, cost };
    });

    const totalProb = rowStats.reduce((s, r) => s + r.prob, 0);
    const ev = rowStats.reduce((s, r) => s + (r.prob / 100) * r.amount, 0);
    const totalCost = rowStats.reduce((s, r) => s + (r.cost ?? 0), 0);
    const remainingBudget = numBudget - totalCost;
    const marginOk = numCpve > 0 && ev < numCpve;
    const probOff = totalProb !== 100;

    return (
        <div className="space-y-4">
            <div>
                <LabelHint tip="EV = Σ(probability × reward) must be less than CPVE.">
                    <span className="text-sm font-semibold">Reward Tiers</span>
                </LabelHint>
                <p className="text-xs text-muted-foreground mb-3">
                    Edit Chance % and Prize Amount directly in the table.
                    Probabilities must sum to <strong>100%</strong>. EV must be &lt; CPVE (₹{numCpve}).
                </p>
            </div>

            {/* Prize table — always visible, inputs are inline, all values live via useWatch */}
            <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-border flex items-center gap-2 flex-wrap">
                    <Gift className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">Prize Distribution</span>
                    {!hasBudget && (
                        <span className="text-[10px] text-muted-foreground ml-auto italic">
                            Set budget &amp; CPVE on Step 1 to see winner counts
                        </span>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white border-b border-border">
                                {[
                                    { label: "Tier", align: "left" },
                                    { label: "Prize", align: "left" },
                                    { label: "Chance %", align: "right" },
                                    { label: "Prize Amount (₹)", align: "right" },
                                    { label: "Winners Count", align: "right" },
                                    { label: "Total Cost (₹)", align: "right" },
                                    { label: "", align: "right" },
                                ].map(({ label, align }, i) => (
                                    <th key={i} className={cn(
                                        "px-3 py-3 text-xs font-semibold text-slate-600 whitespace-nowrap",
                                        align === "left" ? "text-left" : "text-right"
                                    )}>
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {fields.map((field, i) => {
                                const { prob, amount, winners, cost } = rowStats[i] ?? { prob: 0, amount: 0, winners: null, cost: null };
                                return (
                                    <tr key={field.id} className="bg-white hover:bg-slate-50/40 transition-colors">
                                        {/* Tier badge */}
                                        <td className="px-3 py-2.5">
                                            <span className={cn(
                                                "inline-block text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap",
                                                TIER_BADGE_CLS[i] ?? "bg-gray-100 text-gray-700"
                                            )}>
                                                {TIER_NAMES[i] ?? `Tier ${i + 1}`}
                                            </span>
                                        </td>
                                        {/* Prize ordinal */}
                                        <td className="px-3 py-2.5 text-slate-700 font-medium whitespace-nowrap">
                                            {ORDINALS[i] ?? `${i + 1}th`} Prize
                                        </td>
                                        {/* Chance % — inline editable Controller */}
                                        <td className="px-3 py-2.5">
                                            <Controller
                                                control={control}
                                                name={`rewardTiers.${i}.probability`}
                                                render={({ field: f }) => (
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        value={f.value}
                                                        onChange={(e) => f.onChange(safeNum(e.target.value))}
                                                        className={cn(
                                                            "h-8 w-20 text-right font-mono text-sm ml-auto",
                                                            probOff && prob > 0 && "border-orange-300 focus-visible:ring-orange-300"
                                                        )}
                                                    />
                                                )}
                                            />
                                        </td>
                                        {/* Prize amount — inline editable Controller */}
                                        <td className="px-3 py-2.5">
                                            <Controller
                                                control={control}
                                                name={`rewardTiers.${i}.amount`}
                                                render={({ field: f }) => (
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={f.value}
                                                        onChange={(e) => f.onChange(safeNum(e.target.value))}
                                                        className="h-8 w-24 text-right font-mono text-sm ml-auto"
                                                    />
                                                )}
                                            />
                                        </td>
                                        {/* Winners */}
                                        <td className="px-3 py-2.5 text-right font-mono">
                                            {winners !== null
                                                ? winners.toLocaleString()
                                                : <span className="text-muted-foreground text-xs">—</span>}
                                        </td>
                                        {/* Cost */}
                                        <td className="px-3 py-2.5 text-right font-mono">
                                            {cost !== null
                                                ? `₹${cost.toLocaleString()}`
                                                : <span className="text-muted-foreground text-xs">—</span>}
                                        </td>
                                        {/* Remove */}
                                        <td className="px-3 py-2.5 text-right">
                                            {fields.length > 1 ? (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => remove(i)}
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            ) : <span className="w-7 inline-block" />}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Summary footer */}
                <div className="border-t border-border divide-y divide-border">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                        <span className="text-sm font-semibold text-slate-700">Total Campaign Cost</span>
                        <span className="font-mono font-semibold text-slate-800">
                            {hasBudget ? `₹${totalCost.toLocaleString()}` : "—"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-50/50">
                        <span className="text-sm font-semibold text-slate-700">Campaign Budget</span>
                        <span className="font-mono font-semibold text-slate-800">
                            {numBudget > 0 ? `₹${numBudget.toLocaleString()}` : "—"}
                        </span>
                    </div>
                    <div className={cn(
                        "flex items-center justify-between px-4 py-3",
                        hasBudget && remainingBudget < 0 ? "bg-red-50" : "bg-green-50/50"
                    )}>
                        <span className="text-sm font-semibold text-slate-700">Remaining Budget</span>
                        <span className={cn(
                            "font-mono font-semibold",
                            !hasBudget ? "text-slate-400"
                                : remainingBudget < 0 ? "text-red-600"
                                    : "text-green-700"
                        )}>
                            {hasBudget ? `₹${remainingBudget.toLocaleString()}` : "—"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Add tier */}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={fields.length >= TIER_NAMES.length}
                onClick={() => append({ probability: 0, amount: 0 })}
            >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Tier
            </Button>

            {/* Validation errors */}
            <FieldError
                show={probOff && totalProb > 100}
                message={`Total ${totalProb}% — over by ${totalProb - 100}%`}
                fix="Reduce one or more probabilities"
            />
            <FieldError
                show={probOff && totalProb < 100 && totalProb > 0}
                message={`Total ${totalProb}% — need ${100 - totalProb}% more`}
                fix="Increase probabilities to reach 100%"
            />
            <FieldError
                show={!marginOk && ev > 0 && numCpve > 0}
                message={`EV ₹${ev.toFixed(2)} ≥ CPVE ₹${numCpve} — margin too thin`}
                fix="Lower reward amounts or raise CPVE"
            />
        </div>
    );
}

// ─── STEP 4: TARGETING ────────────────────────────────────────────────────────
const CHIP_GROUPS = [
    { fieldName: "targetAge", label: "Age Band", options: ["18-24", "25-34", "35-44", "45+"], tip: "Leave empty to target all ages." },
    { fieldName: "targetGender", label: "Gender", options: ["Male", "Female", "Other"], tip: "Leave empty for all genders." },
    { fieldName: "targetProfession", label: "Profession", options: ["Student", "Professional", "Homemaker", "Freelancer"], tip: "Useful for B2B targeting." },
    { fieldName: "targetDevice", label: "Device Type", options: ["Android", "iOS"], tip: "Useful for app install campaigns." },
];

function StepTargeting() {
    const { register } = useFormContext();
    return (
        <div className="space-y-4">
            {CHIP_GROUPS.map((g) => <ChipGroup key={g.fieldName} {...g} />)}
            <div>
                <LabelHint tip="Comma-separated interest tags for contextual targeting.">
                    <span className="text-xs font-semibold">Interest Keywords</span>
                </LabelHint>
                <Input {...register("targetInterests")} placeholder="e.g. food, fitness, fashion" className="text-sm" />
            </div>
            <InfoNote>Leave all filters empty to reach all eligible users.</InfoNote>
        </div>
    );
}

// ─── STEP 5: LOCATIONS ────────────────────────────────────────────────────────
function normalizeLocation(raw) {
    return {
        id: raw.location_id,
        name: raw.location_name,
        city: raw.city,
        type: raw.location_type,
        area: raw.area || "",
        footfallLevel: raw.footfall_level || "",
        primaryAudience: raw.primary_audience || "",
    };
}

const SORT_OPTIONS = [["name", "Name"], ["city", "City"], ["type", "Type"], ["footfall", "Footfall"]];
const FOOTFALL_ORDER = { High: 3, Medium: 2, Low: 1 };
const FOOTFALL_COLOR = { High: "text-green-600", Medium: "text-yellow-600", Low: "text-red-500" };

function StepLocations() {
    const { control, watch } = useFormContext();
    const [budget, cpve, startDate, endDate] = watch(["budget", "cpve", "startDate", "endDate"]);
    const { dailyTarget } = calcDerivedMetrics(budget, cpve, startDate, endDate);

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [cityFilter, setCityFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortDir, setSortDir] = useState("asc");

    useEffect(() => {
        setLoading(true);
        fetch("/api/location")
            .then((res) => { if (!res.ok) throw new Error(`Error ${res.status}`); return res.json(); })
            .then((data) => {
                const raw = Array.isArray(data) ? data : (data.locations ?? []);
                setLocations(raw.map(normalizeLocation));
                setFetchError(null);
            })
            .catch((err) => setFetchError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const cities = useMemo(() => [...new Set(locations.map((l) => l.city).filter(Boolean))], [locations]);
    const types = useMemo(() => [...new Set(locations.map((l) => l.type).filter(Boolean))], [locations]);

    const filtered = useMemo(() => {
        let locs = [...locations];
        if (cityFilter !== "all") locs = locs.filter((l) => l.city === cityFilter);
        if (typeFilter !== "all") locs = locs.filter((l) => l.type === typeFilter);
        if (search) {
            const q = search.toLowerCase();
            locs = locs.filter((l) =>
                l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.area.toLowerCase().includes(q)
            );
        }
        const dir = sortDir === "asc" ? 1 : -1;
        locs.sort((a, b) => {
            if (sortBy === "name") return dir * a.name.localeCompare(b.name);
            if (sortBy === "city") return dir * a.city.localeCompare(b.city);
            if (sortBy === "type") return dir * a.type.localeCompare(b.type);
            if (sortBy === "footfall") return dir * ((FOOTFALL_ORDER[a.footfallLevel] || 0) - (FOOTFALL_ORDER[b.footfallLevel] || 0));
            return 0;
        });
        return locs;
    }, [locations, cityFilter, typeFilter, search, sortBy, sortDir]);

    const toggleSort = (field) => {
        if (sortBy === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
        else { setSortBy(field); setSortDir("asc"); }
    };

    return (
        <Controller
            name="selectedLocations"
            control={control}
            rules={{ validate: (v) => v.length > 0 || "Select at least one location" }}
            render={({ field, fieldState }) => {
                const selected = field.value;
                const dailyPerLocation = selected.length > 0 ? Math.round(dailyTarget / selected.length) : 0;
                const toggle = (id) => field.onChange(
                    selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]
                );

                return (
                    <div className="space-y-3">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative flex-1 min-w-36">
                                <Info className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input placeholder="Search locations..." value={search}
                                    onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8 text-xs" />
                            </div>
                            <Select value={cityFilter} onValueChange={setCityFilter}>
                                <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="All Cities" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cities</SelectItem>
                                    {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Badge variant="outline" className="text-xs shrink-0">{selected.length} selected</Badge>
                        </div>

                        {/* Sort buttons */}
                        <div className="flex gap-1.5 flex-wrap">
                            {SORT_OPTIONS.map(([key, label]) => (
                                <button key={key} type="button" onClick={() => toggleSort(key)}
                                    className={cn(
                                        "flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded border transition-colors",
                                        sortBy === key
                                            ? "bg-primary/10 text-primary border-primary/30"
                                            : "text-muted-foreground border-border hover:border-primary/20"
                                    )}>
                                    {label} <ArrowUpDown className="h-2.5 w-2.5" />
                                </button>
                            ))}
                        </div>

                        {/* Location List */}
                        {loading ? (
                            <div className="flex items-center justify-center py-10 gap-2 text-xs text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading locations...
                            </div>
                        ) : fetchError ? (
                            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {fetchError}
                            </div>
                        ) : (
                            <div className="space-y-1.5 max-h-72 sm:max-h-96 overflow-y-auto pr-0.5">
                                {filtered.map((loc) => {
                                    const isSelected = selected.includes(loc.id);
                                    return (
                                        <div key={loc.id} onClick={() => toggle(loc.id)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                                            )}>
                                            <Checkbox checked={isSelected} className="pointer-events-none shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{loc.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {loc.city}{loc.area ? ` · ${loc.area}` : ""} · {loc.type}
                                                </p>
                                            </div>
                                            <div className="text-right text-xs shrink-0 space-y-0.5">
                                                <p className={cn("font-medium", FOOTFALL_COLOR[loc.footfallLevel] || "text-muted-foreground")}>
                                                    {loc.footfallLevel || "—"} footfall
                                                </p>
                                                <p className="text-muted-foreground hidden sm:block">{loc.primaryAudience || "—"}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-8">No locations match your filters</p>
                                )}
                            </div>
                        )}

                        <FieldError show={!!fieldState.error} message={fieldState.error?.message} />
                        {dailyPerLocation > 0 && (
                            <p className="text-xs text-muted-foreground">
                                Daily target per location: ~{dailyPerLocation.toLocaleString()} engagements
                            </p>
                        )}
                    </div>
                );
            }}
        />
    );
}

// ─── STEP 6: REVIEW ───────────────────────────────────────────────────────────
function StepReview() {
    const { watch } = useFormContext();
    const values = watch();
    const { engagementTarget, campaignDays, dailyTarget } = calcDerivedMetrics(
        values.budget, values.cpve, values.startDate, values.endDate
    );
    const ev = values.rewardTiers.reduce(
        (s, t) => s + (safeNum(t.probability) / 100) * safeNum(t.amount), 0
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/60 border text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>
                    Saved as{" "}
                    <Badge variant="secondary" className="text-[10px] font-semibold px-1.5 py-0 mx-0.5">Draft</Badge>
                    — activate from the campaign dashboard.
                </span>
            </div>

            <ReviewSection title="Economics">
                <ReviewRow label="Name" value={values.name} />
                <ReviewRow label="Objective" value={values.objective} />
                <ReviewRow label="Budget" value={`₹${safeNum(values.budget).toLocaleString()}`} />
                <ReviewRow label="CPVE" value={`₹${values.cpve}`} />
                <ReviewRow label="Period" value={`${values.startDate} → ${values.endDate} (${campaignDays}d)`} />
                <ReviewRow label="Engagement Target" value={engagementTarget.toLocaleString()} />
                <ReviewRow label="Daily Target" value={dailyTarget.toLocaleString()} />
            </ReviewSection>

            <Separator />

            <ReviewSection title="Reward Engine">
                <ReviewRow label="Expected Value" value={`₹${ev.toFixed(2)}`} />
                <ReviewRow label="Tiers" value={values.rewardTiers.length} />
                <ReviewRow label="Max / Engagement" value={`₹${values.rewardMaxPerEngagement}`} />
                <ReviewRow label="Daily User Cap" value={`₹${values.rewardDailyUserCap}`} />
            </ReviewSection>

            <Separator />

            <ReviewSection title="Targeting">
                <ReviewRow label="Age" value={values.targetAge.length ? values.targetAge.join(", ") : "All"} />
                <ReviewRow label="Gender" value={values.targetGender.length ? values.targetGender.join(", ") : "All"} />
                <ReviewRow label="Device" value={values.targetDevice.length ? values.targetDevice.join(", ") : "All"} />
                <ReviewRow label="Profession" value={values.targetProfession.length ? values.targetProfession.join(", ") : "All"} />
            </ReviewSection>

            <Separator />

            <ReviewSection title="Locations & Status">
                <ReviewRow label="Selected Locations" value={values.selectedLocations.length} />
                <ReviewRow label="Status on Save" value="Draft" />
            </ReviewSection>
        </div>
    );
}

// ─── MAIN WIZARD ──────────────────────────────────────────────────────────────
export default function CampaignWizard({
    open,
    onClose,
    onSubmit,
    brandName = "Brand",
    brandBudgetRemaining = 0,
}) {
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const methods = useForm({ defaultValues: DEFAULT_VALUES, mode: "onChange" });
    const { watch, formState: { errors }, reset, getValues } = methods;
    const values = watch();
    const canNext = canProceed(step, values, errors);

    const handleClose = () => {
        reset(DEFAULT_VALUES);
        setStep(0);
        setSubmitError("");
        setIsSubmitting(false);
        onClose?.();
    };

    const handleDeploy = async () => {
        setSubmitError("");
        setIsSubmitting(true);
        try {
            const values = getValues();
            const payload = buildSubmitPayload(values);

            // Upload video file to Firebase Storage if present
            if (values.videoFile) {
                try {
                    const { uploadVideoToFirebase } = await import("@/firebase");
                    const videoUrl = await uploadVideoToFirebase(values.videoFile);
                    payload.media.videoUrl = videoUrl;
                } catch (uploadErr) {
                    throw new Error(`Video upload failed: ${uploadErr.message}`);
                }
            }

            await onSubmit?.(payload);
            reset(DEFAULT_VALUES);
            setStep(0);
            onClose?.();
        } catch (err) {
            setSubmitError(err?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 0: return <StepEconomics brandBudgetRemaining={brandBudgetRemaining} />;
            case 1: return <StepMedia />;
            case 2: return <StepRewardEngine />;
            case 3: return <StepTargeting />;
            case 4: return <StepLocations />;
            case 5: return <StepReview />;
            default: return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0 gap-0">
                <DialogHeader className="px-4 sm:px-6 pt-5 pb-0">
                    <DialogTitle className="text-base sm:text-lg font-bold">
                        Create Campaign — {brandName}
                    </DialogTitle>
                </DialogHeader>

                {/* Stepper */}
                <div className="flex items-center gap-1 px-4 sm:px-6 py-3 overflow-x-auto no-scrollbar">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        const active = i === step;
                        const done = i < step;
                        return (
                            <div key={i} className="flex items-center gap-1 shrink-0">
                                {i > 0 && (
                                    <div className={cn("h-px w-3 sm:w-5 shrink-0", done ? "bg-primary" : "bg-border")} />
                                )}
                                <button
                                    type="button"
                                    onClick={() => done && !isSubmitting && setStep(i)}
                                    disabled={isSubmitting}
                                    className={cn(
                                        "flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors",
                                        active && "bg-primary text-primary-foreground",
                                        done && !isSubmitting && "bg-primary/10 text-primary cursor-pointer",
                                        done && isSubmitting && "bg-primary/10 text-primary/50 cursor-not-allowed",
                                        !active && !done && "text-muted-foreground"
                                    )}
                                >
                                    {done ? <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                                    <span className="hidden xs:inline sm:inline">{s.label}</span>
                                </button>
                            </div>
                        );
                    })}
                </div>

                <Separator />

                <FormProvider {...methods}>
                    <div className="px-4 sm:px-6 py-4 min-h-75">
                        {renderStep()}
                    </div>
                </FormProvider>

                <Separator />

                {/* Footer */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3">
                    <Button type="button" variant="ghost" size="sm" disabled={isSubmitting}
                        onClick={() => step > 0 ? setStep(step - 1) : handleClose()}>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        {step > 0 ? "Back" : "Cancel"}
                    </Button>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {submitError && step === STEPS.length - 1 && (
                            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2.5 py-1.5 max-w-45 sm:max-w-xs">
                                <AlertTriangle className="h-3 w-3 shrink-0" />
                                <span className="truncate">{submitError}</span>
                            </div>
                        )}

                        {step < STEPS.length - 1 ? (
                            <Button type="button" size="sm" disabled={!canNext} onClick={() => setStep(step + 1)}>
                                Next <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button type="button" size="sm" disabled={isSubmitting} onClick={handleDeploy}>
                                {isSubmitting ? (
                                    <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving…</>
                                ) : (
                                    <><Rocket className="mr-1 h-4 w-4" /> Save as Draft</>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}