"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { z } from "zod";

import { availableTees, primaryCourse } from "@/lib/golf-course-data";
import {
  isValidHandicapInput,
  normalizeHandicapInput,
} from "@/lib/handicap";
import {
  persistRoundSetupToStorage,
  type RoundSetup,
} from "@/lib/round-setup";

const roundSetupSchema = z.object({
  playerName: z.string().trim().min(1, "Ange spelarens namn."),
  playedOn: z.string().trim().min(1, "Välj speldatum."),
  courseSlug: z.literal(primaryCourse.slug),
  teeCode: z.enum(["red", "yellow"]),
  enteredHandicap: z
    .string()
    .trim()
    .min(1, "Ange ditt handicap.")
    .refine(isValidHandicapInput, {
      message: "Handicap måste vara ett tal.",
    }),
});

type RoundSetupFormValues = z.infer<typeof roundSetupSchema>;
type FieldErrors = Partial<Record<keyof RoundSetupFormValues, string>>;

const defaultValues: RoundSetupFormValues = {
  playerName: "",
  playedOn: new Date().toISOString().slice(0, 10),
  courseSlug: primaryCourse.slug,
  teeCode: "yellow",
  enteredHandicap: "",
};

function buildDescribedByIds(...ids: Array<string | undefined>) {
  const value = ids.filter(Boolean).join(" ");
  return value === "" ? undefined : value;
}

export function RoundSetupForm() {
  const router = useRouter();
  const [values, setValues] = useState<RoundSetupFormValues>(defaultValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const isValid = useMemo(
    () => roundSetupSchema.safeParse(values).success,
    [values],
  );

  function updateValue<K extends keyof RoundSetupFormValues>(
    key: K,
    value: RoundSetupFormValues[K],
  ) {
    const nextValue =
      key === "enteredHandicap" && typeof value === "string"
        ? normalizeHandicapInput(value)
        : value;

    setValues((current) => ({ ...current, [key]: nextValue }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setFormError(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = roundSetupSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0];

        if (typeof key === "string" && !nextErrors[key as keyof FieldErrors]) {
          nextErrors[key as keyof FieldErrors] = issue.message;
        }
      }

      setFieldErrors(nextErrors);
      setFormError("Fyll i de obligatoriska fälten innan du fortsätter.");
      return;
    }

    const selectedTee = availableTees.find(
      (tee) => tee.code === parsed.data.teeCode,
    );

    if (!selectedTee) {
      setFormError("Den valda teen är inte tillgänglig.");
      return;
    }

    const setup: RoundSetup = {
      playerName: parsed.data.playerName,
      playedOn: parsed.data.playedOn,
      courseSlug: parsed.data.courseSlug,
      courseLabel: primaryCourse.displayName,
      courseShortLabel: primaryCourse.shortLabel,
      teeCode: parsed.data.teeCode,
      teeLabel: selectedTee.label,
      enteredHandicap: normalizeHandicapInput(parsed.data.enteredHandicap),
    };

    persistRoundSetupToStorage(setup);
    router.push("/rounds/new/front-nine");
  }

  return (
    <form className="form-grid" noValidate onSubmit={handleSubmit}>
      <div className="step-progress" aria-label="Rondens inställningssteg">
        <span className="pill">Steg 1 av 4</span>
        <div className="step-progress__track" aria-hidden="true">
          <div className="step-progress__fill" style={{ width: "25%" }} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="playerName">Spelare</label>
        <input
          id="playerName"
          name="playerName"
          autoComplete="name"
          aria-describedby={buildDescribedByIds(
            fieldErrors.playerName ? "playerName-error" : undefined,
            fieldErrors.playerName ? undefined : "playerName-hint",
          )}
          aria-invalid={Boolean(fieldErrors.playerName)}
          value={values.playerName}
          onChange={(event) => updateValue("playerName", event.target.value)}
        />
        {fieldErrors.playerName ? (
          <div className="field__error" id="playerName-error" role="alert">
            {fieldErrors.playerName}
          </div>
        ) : (
          <div className="field__hint" id="playerName-hint">
            En spelare per rond i MVP-versionen.
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="playedOn">Speldatum</label>
        <input
          id="playedOn"
          name="playedOn"
          type="date"
          aria-describedby={buildDescribedByIds(
            fieldErrors.playedOn ? "playedOn-error" : undefined,
          )}
          aria-invalid={Boolean(fieldErrors.playedOn)}
          value={values.playedOn}
          onChange={(event) => updateValue("playedOn", event.target.value)}
        />
        {fieldErrors.playedOn ? (
          <div className="field__error" id="playedOn-error" role="alert">
            {fieldErrors.playedOn}
          </div>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="courseSlug">Bana</label>
        <select
          id="courseSlug"
          name="courseSlug"
          aria-describedby="courseSlug-hint"
          value={values.courseSlug}
          onChange={(event) => updateValue("courseSlug", event.target.value)}
        >
          <option value={primaryCourse.slug}>{primaryCourse.displayName}</option>
        </select>
        <div className="field__hint" id="courseSlug-hint">
          MVP-versionen startar med {primaryCourse.shortLabel}.
        </div>
      </div>

      <div className="field">
        <label htmlFor="teeCode">Tee</label>
        <select
          id="teeCode"
          name="teeCode"
          aria-describedby={buildDescribedByIds(
            fieldErrors.teeCode ? "teeCode-error" : undefined,
          )}
          aria-invalid={Boolean(fieldErrors.teeCode)}
          value={values.teeCode}
          onChange={(event) => updateValue("teeCode", event.target.value as "red" | "yellow")}
        >
          {availableTees.map((tee) => (
            <option key={tee.code} value={tee.code}>
              {tee.label}
            </option>
          ))}
        </select>
        {fieldErrors.teeCode ? (
          <div className="field__error" id="teeCode-error" role="alert">
            {fieldErrors.teeCode}
          </div>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="enteredHandicap">Registrerat handicap</label>
        <input
          id="enteredHandicap"
          name="enteredHandicap"
          inputMode="decimal"
          placeholder="t.ex. 18,4"
          aria-describedby={buildDescribedByIds(
            fieldErrors.enteredHandicap ? "enteredHandicap-error" : undefined,
            fieldErrors.enteredHandicap ? undefined : "enteredHandicap-hint",
          )}
          aria-invalid={Boolean(fieldErrors.enteredHandicap)}
          value={values.enteredHandicap}
          onChange={(event) =>
            updateValue("enteredHandicap", event.target.value)
          }
        />
        {fieldErrors.enteredHandicap ? (
          <div className="field__error" id="enteredHandicap-error" role="alert">
            {fieldErrors.enteredHandicap}
          </div>
        ) : (
          <div className="field__hint" id="enteredHandicap-hint">
            Värdet sparas med ronden och du kan skriva med komma, till exempel 18,4.
          </div>
        )}
      </div>

      {formError ? (
        <div aria-live="assertive" className="form-error" role="alert">
          {formError}
        </div>
      ) : null}

      <div className="sticky-action">
        <button className="button" disabled={!isValid} type="submit">
          Fortsätt till Fram 9
        </button>
      </div>
    </form>
  );
}
