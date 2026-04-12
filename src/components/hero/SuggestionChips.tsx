type SuggestionChipsProps = {
  chips: string[];
  onSelect: (chip: string) => void;
};

export function SuggestionChips({ chips, onSelect }: SuggestionChipsProps) {
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-3">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className="rounded-full border border-white/20 bg-white/10 px-5 py-2 font-caption text-[11px] tracking-[0.1em] text-white transition-colors hover:bg-white/20"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
