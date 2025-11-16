import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n, translations } from "@/context/i18n";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
      <SelectTrigger className="w-[120px] bg-transparent border border-white/20 text-white/70 text-xs hover:text-white">
        <SelectValue placeholder="Idioma" />
      </SelectTrigger>
      <SelectContent className="bg-[#050b18] border border-white/10 text-white text-xs">
        {(Object.keys(translations) as Array<keyof typeof translations>).map((lang) => (
          <SelectItem key={lang} value={lang}>
            {translations[lang].languageLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
