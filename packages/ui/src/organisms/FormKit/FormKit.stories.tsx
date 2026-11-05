import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';

import { Button } from '../../atoms/Button';
import { Switch } from '../../atoms/Switch';
import { StrokeIcon } from '../../lib/icons';
import { Select } from '../../molecules/Select/Select';

import { CheckGroup } from './Checkbox';
import { FileDrop, type FileValue } from './FileDrop';
import { FormField } from './FormField';
import { RadioGroup } from './RadioGroup';
import { Slider } from './Slider';
import { Textarea } from './Textarea';
import { TextInput } from './TextInput';

// @@S org-1 begin
/** Demo data for the "New profile" form. */
// @@S org-1 end
const FK_MODELS = [
  { value: 'haiku-4', label: 'haiku-4' },
  { value: 'sonnet-4.5', label: 'sonnet-4.5' },
  { value: 'opus-4', label: 'opus-4' },
];
const FK_TOOLS = [
  { value: 'read', label: 'Read files', hint: 'Inspect the repo' },
  { value: 'edit', label: 'Edit files', hint: 'Write changes' },
  { value: 'shell', label: 'Run commands', hint: 'Execute in a sandbox' },
  { value: 'web', label: 'Web search', hint: 'Fetch external docs' },
];
const FK_VISIBILITY = [
  { value: 'private', label: 'Private', hint: 'Only you can run it' },
  // @@S org-1 begin
  { value: 'team', label: 'Team', hint: 'Anyone in the group' },
  // @@S org-1 end
];

const BotIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 8V4H8M4 20h16a2 2 0 002-2v-8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2zM2 14h2M20 14h2M15 13v2M9 13v2" />
  </svg>
);

// @@T org-1 begin
const meta: Meta<typeof FormField> = {
// @@T org-1 end
  title: 'Organisms/FormKit',
  component: FormField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  // Every story is render-based; these only satisfy the required props.
  args: { children: null },
// @@T org-1 begin
};
// @@T org-1 end

export default meta;
type Story = StoryObj<typeof meta>;

/** Envelope + text control: label, required star, hint. */
export const TextField: Story = {
  render: function TextFieldDemo() {
    const [name, setName] = useState('');
    return (
      <div className="w-[360px]">
        <FormField
          label="Name"
          required
          htmlFor="fk-name"
          // @@S org-1 begin
          hint="Lowercase, no spaces. Used in the profile's URL."
          // @@S org-1 end
        >
          <TextInput
            id="fk-name"
            value={name}
            onChange={setName}
            placeholder="refactor-bot"
            prefix="@"
          />
        </FormField>
      </div>
    );
  },
};

/** The error slot replaces the hint and flips the border. */
export const TextFieldError: Story = {
  render: function TextFieldErrorDemo() {
    // @@S org-1 begin
    const [name, setName] = useState('My Profile');
    // @@S org-1 end
    return (
      <div className="w-[360px]">
        <FormField
          label="Name"
          required
          htmlFor="fk-name-err"
          error="Lowercase, numbers and dashes — at least 3 characters."
        >
          <TextInput
            id="fk-name-err"
            value={name}
            onChange={setName}
            invalid
            prefix="@"
          />
        </FormField>
      </div>
    );
  },
};

export const TextareaField: Story = {
  render: function TextareaFieldDemo() {
    const [desc, setDesc] = useState('');
    return (
      <div className="w-[360px]">
        <FormField
          label="Description"
          htmlFor="fk-desc"
          // @@S org-1 begin
          hint="Optional — what is this profile for?"
          // @@S org-1 end
        >
          <Textarea
            id="fk-desc"
            value={desc}
            onChange={setDesc}
            placeholder="Splits monoliths into per-role modules and fixes imports."
            rows={2}
          />
        </FormField>
      </div>
    );
  },
};

export const CheckGroupField: Story = {
  render: function CheckGroupFieldDemo() {
    const [tools, setTools] = useState(['read', 'edit']);
    return (
      <div className="w-[420px]">
        <FormField
          label="Tools"
          required
          // @@S org-1 begin
          hint="What this profile is allowed to call."
          // @@S org-1 end
        >
          <CheckGroup
            options={FK_TOOLS}
            value={tools}
            onChange={setTools}
            columns={2}
          />
        </FormField>
      </div>
    );
  },
};

export const RadioGroupField: Story = {
  render: function RadioGroupFieldDemo() {
    const [vis, setVis] = useState('team');
    return (
      <div className="w-[360px]">
        <FormField label="Visibility">
          <RadioGroup
            options={FK_VISIBILITY}
            value={vis}
            onChange={setVis}
            ariaLabel="Visibility"
          />
        </FormField>
      </div>
    );
  },
};

export const SliderField: Story = {
  render: function SliderFieldDemo() {
    // @@S org-1 begin
    const [limit, setLimit] = useState(184000);
    // @@S org-1 end
    return (
      <div className="w-[360px]">
        <FormField
          // @@S org-1 begin
          label="Usage limit"
          // @@S org-1 end
          required
          // @@S org-1 begin
          htmlFor="fk-limit"
          hint="Per-run ceiling."
          // @@S org-1 end
        >
          <Slider
            // @@S org-1 begin
            id="fk-limit"
            value={limit}
            onChange={setLimit}
            // @@S org-1 end
            min={20000}
            max={400000}
            step={4000}
            format={(n) => `${(n / 1000).toFixed(0)}k`}
          />
        </FormField>
      </div>
    );
  },
};

export const FileDropField: Story = {
  render: function FileDropFieldDemo() {
    const [ctx, setCtx] = useState<FileValue | null>(null);
    return (
      <div className="w-[420px]">
        <FormField
          label="Seed context"
          // @@S org-1 begin
          hint="Optional — a brief or spec read first. Drag a real .md file here."
          // @@S org-1 end
        >
          <FileDrop
            value={ctx}
            onChange={(f) => setCtx(f
              ? { name: f.name, size: f.size }
              : null)
            }
            label="Drop a .md context file"
            hint=".md or .txt · up to 1 MB"
            accept={{ ext: ['.md', '.txt'], maxSize: 1048576, multiple: false }}
          />
        </FormField>
      </div>
    );
  },
};

/** The landed-file chip presentation. */
export const FileDropLanded: Story = {
  render: function FileDropLandedDemo() {
    const [ctx, setCtx] = useState<FileValue | null>({
      // @@S org-1 begin
      name: 'brief.md',
      // @@S org-1 end
      size: 4200,
    });
    return (
      <div className="w-[420px]">
        <FormField label="Seed context">
          <FileDrop
            value={ctx}
            onChange={(f) => setCtx(f
              ? { name: f.name, size: f.size }
              : null)
            }
          />
        </FormField>
      </div>
    );
  },
};

// @@S org-1 begin
interface ProfileDraft {
// @@S org-1 end
  name: string;
  desc: string;
  model: string;
  // @@S org-1 begin
  limit: number;
  // @@S org-1 end
  tools: string[];
  visibility: string;
  autorun: boolean;
  context: FileValue | null;
}

// @@S org-1 begin
const FK_INITIAL: ProfileDraft = {
// @@S org-1 end
  name: '',
  desc: '',
  model: 'sonnet-4.5',
  // @@S org-1 begin
  limit: 184000,
  // @@S org-1 end
  tools: ['read', 'edit'],
  visibility: 'team',
  autorun: false,
  context: null,
};

// @@S org-1 begin
function validateForm(v: ProfileDraft): Partial<Record<string, string>> {
// @@S org-1 end
  const e: Partial<Record<string, string>> = {};
  if (!/^[a-z0-9][a-z0-9-]{2,}$/.test(v.name))
    e.name = 'Lowercase, numbers and dashes — at least 3 characters.';
  if (v.desc.trim().length > 0 && v.desc.trim().length < 12)
    e.desc = 'Give it a sentence, or leave it blank.';
  // @@S org-1 begin
  if (v.tools.length === 0) e.tools = 'A profile needs at least one tool.';
  // @@S org-1 end
  return e;
}

/** The whole bundle demo form — a pure function of one values object. */
export const NewAgentForm: Story = {
  parameters: { layout: 'padded' },
  // @@S org-1 begin
  render: function NewProfileFormDemo() {
  // @@S org-1 end
    const [v, setV] = useState(FK_INITIAL);
    const [showErrors, setShowErrors] = useState(false);
    const set =
      // @@S org-1 begin
      <K extends keyof ProfileDraft>(k: K) => (val: ProfileDraft[K]) => setV((s) => ({ ...s, [k]: val }));
      // @@S org-1 end
    const errors = validateForm(v);
    const errFor = (k: string) => (showErrors
      ? errors[k]
      : undefined);
    const fmtK = (n: number) => `${(n / 1000).toFixed(0)}k`;
    return (
      <div className="mx-auto flex max-w-[560px] flex-col gap-4 rounded-xl border border-border-soft bg-surface-1 p-5 shadow-xs">
        <div className="mb-0.5 flex items-center gap-2.5">
          <span className="inline-flex size-[34px] items-center justify-center rounded-md bg-[color-mix(in_oklab,var(--primary)_13%,var(--surface-1))] text-primary">
            <BotIcon />
          </span>
          <div>
            <div className="font-display text-[17px] font-bold text-fg1">
              {/* @@S org-1 begin */}
              New profile
              {/* @@S org-1 end */}
            </div>
            <div className="text-[12.5px] text-fg3">
              {/* @@S org-1 begin */}
              Define a reusable profile for this group
              {/* @@S org-1 end */}
            </div>
          </div>
        </div>

        <FormField
          label="Name"
          required
          htmlFor="naf-name"
          error={errFor('name')}
          // @@S org-1 begin
          hint="Lowercase, no spaces. Used in the profile's URL."
          // @@S org-1 end
        >
          <TextInput
            id="naf-name"
            value={v.name}
            onChange={set('name')}
            invalid={!!errFor('name')}
            placeholder="refactor-bot"
            prefix="@"
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="naf-desc"
          error={errFor('desc')}
          // @@S org-1 begin
          hint="Optional — what is this profile for?"
          // @@S org-1 end
        >
          <Textarea
            id="naf-desc"
            value={v.desc}
            onChange={set('desc')}
            invalid={!!errFor('desc')}
            placeholder="Splits monoliths into per-role modules and fixes imports."
            rows={2}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3.5">
          <FormField label="Default model" htmlFor="naf-model">
            <Select
              value={v.model}
              options={FK_MODELS}
              onChange={set('model')}
              ariaLabel="Default model"
              width={180}
            />
          </FormField>
          <FormField
            // @@S org-1 begin
            label="Usage limit"
            // @@S org-1 end
            required
            // @@S org-1 begin
            htmlFor="naf-limit"
            hint="Per-run ceiling."
            // @@S org-1 end
          >
            <Slider
              // @@S org-1 begin
              id="naf-limit"
              value={v.limit}
              onChange={set('limit')}
              // @@S org-1 end
              min={20000}
              max={400000}
              step={4000}
              format={fmtK}
            />
          </FormField>
        </div>

        <FormField
          label="Tools"
          required
          error={errFor('tools')}
          // @@S org-1 begin
          hint="What this profile is allowed to call."
          // @@S org-1 end
        >
          <CheckGroup
            options={FK_TOOLS}
            value={v.tools}
            onChange={set('tools')}
            columns={2}
          />
        </FormField>

        <FormField label="Visibility">
          <RadioGroup
            options={FK_VISIBILITY}
            value={v.visibility}
            onChange={set('visibility')}
            ariaLabel="Visibility"
          />
        </FormField>

        <FormField
          label="Seed context"
          // @@S org-1 begin
          hint="Optional — a brief or spec read first. Drag a real .md file here."
          // @@S org-1 end
        >
          <FileDrop
            value={v.context}
            onChange={(f) => set('context')(f
              ? { name: f.name, size: f.size }
              : null)
            }
            label="Drop a .md context file"
            hint=".md or .txt · up to 1 MB"
            accept={{ ext: ['.md', '.txt'], maxSize: 1048576, multiple: false }}
          />
        </FormField>

        <div className="flex items-center gap-3 rounded-md border border-border-soft bg-surface-sunk px-3.5 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold text-fg1">
              Auto-run on roadmap items
            </div>
            <div className="mt-px text-xs text-fg3">
              {/* @@S org-1 begin */}
              Start a run whenever a matching task appears
              {/* @@S org-1 end */}
            </div>
          </div>
          <Switch
            checked={v.autorun}
            onChange={set('autorun')}
            aria-label="Auto-run"
          />
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          {/* @@S org-1 begin */}
          <Button onClick={() => setShowErrors(true)}>Create profile</Button>
          {/* @@S org-1 end */}
          <Button
            variant="secondary"
            onClick={() => {
              setV(FK_INITIAL);
              setShowErrors(false);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  },
};

/** Auth-sourced extension: ReactNode prefix + interactive suffix, labelEnd, hint above. */
export const WithAffixes: Story = {
  render: function WithAffixesStory() {
    const [value, setValue] = useState('sam@example.com');
    return (
      <div className="w-80">
        <FormField
          label="Email"
          labelEnd={<a href="#forgot" className="text-xs font-semibold text-accent">Forgot?</a>}
          hint="We'll send a confirmation link."
          hintPlacement="above"
        >
          <TextInput
            value={value}
            onChange={setValue}
            type="email"
            prefix={<StrokeIcon name="mail" size={14} />}
            suffix={<StrokeIcon name="check" size={14} className="text-success" />}
          />
        </FormField>
      </div>
    );
  },
};
