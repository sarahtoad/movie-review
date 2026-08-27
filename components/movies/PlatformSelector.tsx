"use client";

import { useState, useEffect } from "react";

interface Props {
  platform: string;
  link: string;
  setPlatform: (v: string) => void;
  setLink: (v: string) => void;
}

const PRESET_PLATFORMS = ["Netflix", "Prime Video", "Disney+", "Apple TV"];

export default function PlatformSelector({
  platform,
  link,
  setPlatform,
  setLink,
}: Props) {
  // Détermine si la plateforme actuelle est une option personnalisée ("Autre")
  const isCustomPlatform =
    platform !== "" && !PRESET_PLATFORMS.includes(platform);

  const [selectedOption, setSelectedOption] = useState<string>(
    isCustomPlatform ? "Autre" : platform
  );
  const [customName, setCustomName] = useState<string>(
    isCustomPlatform ? platform : ""
  );

  // Synchronise l'état local si le parent réinitialise le formulaire
  useEffect(() => {
    if (!platform) {
      setSelectedOption("");
      setCustomName("");
    } else if (PRESET_PLATFORMS.includes(platform)) {
      setSelectedOption(platform);
      setCustomName("");
    } else {
      setSelectedOption("Autre");
      setCustomName(platform);
    }
  }, [platform]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedOption(val);

    if (val === "Autre") {
      setPlatform(customName);
    } else {
      setPlatform(val);
    }
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomName(val);
    setPlatform(val);
  };

  return (
    <div className="mt-6">
      <h3 className="section-label !mb-4">Où regarder ?</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className="rounded-md border border-border bg-ink p-3 text-cream outline-none transition focus:border-accent/60"
          >
            <option value="">Choisir la plateforme</option>
            {PRESET_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
            <option value="Autre">Autre (Saisir un nom...)</option>
          </select>

          {/* Saisie personnalisée visible uniquement si "Autre" est sélectionné */}
          {selectedOption === "Autre" && (
            <input
              type="text"
              value={customName}
              onChange={handleCustomNameChange}
              placeholder="Ex: Canal+, Crunchyroll, HBO Max..."
              className="rounded-md border border-border bg-ink p-3 text-cream outline-none transition placeholder:text-muted/50 focus:border-accent/60"
            />
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Lien direct (https://...)"
            className="rounded-md border border-border bg-ink p-3 text-cream outline-none transition placeholder:text-muted/50 focus:border-accent/60"
          />
        </div>
      </div>
    </div>
  );
}