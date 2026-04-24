'use client';

interface PersonToggleProps {
  visible: boolean;
  onToggle: (visible: boolean) => void;
}

export default function PersonToggle({ visible, onToggle }: PersonToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={visible}
        onChange={(e) => onToggle(e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm font-medium">Include Person 2</span>
    </label>
  );
}
