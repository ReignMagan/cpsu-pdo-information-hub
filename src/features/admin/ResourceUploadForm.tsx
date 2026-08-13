import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Upload } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { maximumResourceFileSize } from "../../contracts/resourceUpload";
import { schoolYearSchema } from "../../contracts/resource";
import { uploadResource } from "../../services/resourceUpload";
import { useAuth } from "../auth/useAuth";
import { useRepositoryStructureQuery } from "../repository/useRepositoryStructureQuery";

const acceptedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const formSchema = z.object({
  sectionId: z.string().min(1, "Select a repository section."),
  categoryId: z.string().optional(),
  year: schoolYearSchema,
  file: z
    .custom<File>((value) => value instanceof File, "Select a file.")
    .refine(
      (file) => file.size <= maximumResourceFileSize,
      "The file must not exceed 25 MB.",
    )
    .refine(
      (file) => acceptedTypes.includes(file.type),
      "Select a PDF document, Excel workbook, or image.",
    ),
});
type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;

const currentDate = new Date();
const currentSchoolYearStart = currentDate.getMonth() >= 5 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
const schoolYearOptions = Array.from({ length: 12 }, (_, index) => {
  const start = currentSchoolYearStart + 1 - index;
  return `${start}-${start + 1}`;
});

export function ResourceUploadForm() {
  const { user } = useAuth();
  const structure = useRepositoryStructureQuery();
  const queryClient = useQueryClient();
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sectionId: "",
      categoryId: "",
      year: `${currentSchoolYearStart}-${currentSchoolYearStart + 1}`,
    },
  });
  const selectedSectionId = useWatch({ control, name: "sectionId" });
  const selectedSection = structure.data?.find(
    (section) => section.id === selectedSectionId,
  );
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!user) throw new Error("Please sign in before uploading a file.");
      return uploadResource(user, values.file, {
        sectionId: values.sectionId as never,
        categoryId: values.categoryId || undefined,
        year: values.year,
      });
    },
    onSuccess: async (_key, values) => {
      setUploadedFilename(values.file.name);
      resetField("file");
      await queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
    },
  });
  return (
    <form
      className="mt-6 w-full space-y-6 border-y border-strong-border bg-surface px-5 py-6 sm:px-7"
      onSubmit={handleSubmit((values) => {
        setUploadedFilename(null);
        mutation.mutate(values);
      })}
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label>
          <span className="block text-sm font-semibold">
            Repository section
          </span>
          <select
            {...register("sectionId", {
              onChange: () => resetField("categoryId"),
            })}
            disabled={structure.isPending}
            className="mt-2 min-h-12 w-full cursor-pointer border border-strong-border bg-surface px-3 disabled:cursor-not-allowed disabled:bg-surface-secondary"
          >
            <option value="">
              {structure.isPending ? "Loading sections..." : "Select section"}
            </option>
            {structure.data?.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
          {errors.sectionId ? (
            <span className="mt-2 block text-sm text-danger">
              {errors.sectionId.message}
            </span>
          ) : null}
        </label>
        <label>
          <span className="block text-sm font-semibold">Category <span className="font-normal text-muted-foreground">(optional)</span></span>
          <select
            {...register("categoryId")}
            disabled={!selectedSection}
            className="mt-2 min-h-12 w-full cursor-pointer border border-strong-border bg-surface px-3 disabled:cursor-not-allowed disabled:bg-surface-secondary"
          >
            <option value="">No category — place directly in section</option>
            {selectedSection?.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
          <span className="mt-2 block text-sm text-muted-foreground">Choose a category only when the file belongs to one.</span>
        </label>
      </div>
      <label className="block">
        <span className="block text-sm font-semibold">School year</span>
        <select
          {...register("year")}
          className="mt-2 min-h-12 w-full cursor-pointer border border-strong-border bg-surface px-4 sm:max-w-xs"
        >
          {schoolYearOptions.map((schoolYear) => <option key={schoolYear} value={schoolYear}>{schoolYear}</option>)}
        </select>
        {errors.year ? (
          <span className="mt-2 block text-sm text-danger">
            {errors.year.message}
          </span>
        ) : null}
      </label>
      <label className="block">
        <span className="block text-sm font-semibold">File</span>
        <Controller
          name="file"
          control={control}
          render={({ field: { name, onBlur, onChange, ref } }) => (
            <input
              ref={ref}
              name={name}
              onBlur={onBlur}
              onChange={(event) =>
                onChange(event.target.files?.item(0) ?? undefined)
              }
              type="file"
              accept=".pdf,.xlsx,.jpg,.jpeg,.png,.webp"
              className="mt-2 block w-full cursor-pointer border border-dashed border-strong-border bg-surface-secondary px-4 py-5 text-sm file:mr-4 file:cursor-pointer file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground"
            />
          )}
        />
        <span className="mt-2 block text-sm text-muted-foreground">
          PDF documents, Excel workbooks, and common images are accepted. Maximum 25 MB.
        </span>
        {errors.file ? (
          <span className="mt-2 block text-sm text-danger">
            {errors.file.message}
          </span>
        ) : null}
      </label>
      {mutation.isError ? (
        <p
          className="border-l-2 border-danger bg-danger-soft px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {mutation.error instanceof Error
            ? mutation.error.message
            : "The upload failed."}
        </p>
      ) : null}
      {uploadedFilename ? (
        <p
          className="flex items-start gap-2 border-l-2 border-primary bg-primary-soft px-4 py-3 text-sm text-primary"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            <span className="break-all font-medium">{uploadedFilename}</span>{" "}
            was uploaded successfully.
          </span>
        </p>
      ) : null}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex min-h-12 cursor-pointer items-center gap-2 bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-55"
      >
        <Upload className="size-4" aria-hidden="true" />
        {mutation.isPending ? "Uploading…" : "Upload resource"}
      </button>
    </form>
  );
}
