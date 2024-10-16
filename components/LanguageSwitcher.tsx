"use client";

import { LanguageSwitcher } from "next-export-i18n";

export default function LanguageSwitcherComp({
  lang,
  label,
}: {
  lang: string;
  label: string;
}) {
  return <LanguageSwitcher lang={lang}>{label}</LanguageSwitcher>;
}
